// app/dashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function DashboardPage() {
  const router = useRouter();
  const [featured, setFeatured] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [activePage, setActivePage] = useState<"parts" | "search">("parts");

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await client.models.Product.list({ limit: 4 });
        setFeatured(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <Authenticator>
      {({ signOut }) => (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Helvetica, sans-serif" }}>
          {/* Sidebar */}
          <aside
            style={{
              width: "220px",
              background: "#f8f9fa",
              padding: "1rem",
              borderRight: "1px solid #ddd",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Dashboard</h2>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button onClick={() => setActivePage("parts")}>Parts</button>
              <button onClick={() => setActivePage("search")}>Search</button>
              <button onClick={signOut} style={{ marginTop: "1rem" }}>
                Log Out
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <main style={{ flex: 1, padding: "2rem" }}>
            {activePage === "parts" && (
              <>
                {/* Header row with button */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <h1 style={{ margin: 0 }}>Featured Parts</h1>
                  <button
                    onClick={() => router.push("/add-part")}
                    style={{
                      backgroundColor: "#0070f3",
                      color: "white",
                      border: "none",
                      padding: "0.6rem 1.2rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    + List New Part
                  </button>
                </div>

                {/* Parts grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {featured.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => router.push(`/product/${p.id}`)}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "12px",
                        padding: "1rem",
                        cursor: "pointer",
                        background: "white",
                      }}
                    >
                      <img
                        src={p.imageUrl || "/placeholder.png"}
                        alt={p.name}
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <h3>{p.name}</h3>
                      <p>{p.partNumber}</p>
                      <p style={{ fontWeight: "bold" }}>${p.price?.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activePage === "search" && (
              <>
                <h1>Search Parts</h1>
                <form
                  onSubmit={handleSearch}
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    gap: "0.5rem",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search part number..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="submit">Search</button>
                </form>
              </>
            )}
          </main>
        </div>
      )}
    </Authenticator>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { getCurrentUser, signOut } from "aws-amplify/auth";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [featured, setFeatured] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Check user login status
  useEffect(() => {
    const checkUser = async () => {
      try {
        const current = await getCurrentUser();
        setUser(current);
      } catch {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  // Fetch featured products
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

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <main style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "2rem",
          color: "white",
          backgroundImage:
            "url('https://static.wixstatic.com/media/e8b6a5_001239302c944734bff081680ca1a935~mv2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              marginBottom: "0.5rem",
            }}
          >
            Heliparts USA
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              marginBottom: "2rem",
              color: "#f5f5f5",
            }}
          >
            Your trusted source for helicopter parts worldwide.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Search part number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                minWidth: "250px",
                flexGrow: 1,
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#0070f3",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#005bb5")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#0070f3")
              }
            >
              Search
            </button>
          </form>

          {/* Action Buttons */}
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => router.push("/add-part")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#1f2937",
                color: "white",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              + Add Part
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#4b5563",
                color: "white",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Dashboard
            </button>
            {user && (
              <button
                onClick={handleLogout}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#dc2626",
                  color: "white",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Featured Parts</h2>
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
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "1rem",
                cursor: "pointer",
                background: "white",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src={p.imageUrl || "/placeholder.png"}
                alt={p.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "0.5rem",
                }}
              />
              <h3 style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                {p.name}
              </h3>
              <p style={{ color: "#6b7280", marginBottom: "0.25rem" }}>
                {p.partNumber}
              </p>
              {p.price != null && (
                <p style={{ fontWeight: "bold", color: "#111827" }}>
                  ${p.price.toFixed(2)}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

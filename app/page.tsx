"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [featured, setFeatured] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await client.models.Product.list({ limit: 4 });
      setFeatured(data);
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
    <main>
      {/* Hero */}
      <section
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            backgroundImage: "linear-gradient(90deg, red, white, blue)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Heliparts USA
        </h1>
        <p style={{ fontSize: "1.25rem", marginTop: "0.5rem" }}>
          Your trusted source for helicopter parts worldwide.
        </p>
        <form
          onSubmit={handleSearch}
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search part number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </section>

      {/* Featured Listings */}
      <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h2>Featured Parts</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1rem",
            marginTop: "2rem",
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
      </section>
    </main>
  );
}

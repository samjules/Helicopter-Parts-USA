"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const client = generateClient<Schema>();

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) return;
      const { data } = await client.models.Product.list({
        filter: { partNumber: { contains: query } },
      });
      setProducts(data);
    };
    fetchProducts();
  }, [query]);

  return (
    <main style={{ padding: "2rem" }}>
      {/* Hero */}
      <section style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1>Search Results</h1>
        <p>Showing results for "{query}"</p>
      </section>

      {/* Listings */}
      <section>
        {products.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {products.map((p) => (
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
        ) : (
          <p>No products found.</p>
        )}
      </section>
    </main>
  );
}

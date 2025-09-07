"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const client = generateClient<Schema>();

interface Product {
  id: string;
  partNumber: string;
  name: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams?.get("q") || "";
    setQuery(q);

    if (!q) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await client.models.Product.list({
          filter: {
            or: [
              { partNumber: { contains: q } },
              { name: { contains: q } },
            ],
          },
        });

        // Gen 2 returns { data: ProductType[], nextToken?, errors? }
        setProducts(result.data as Product[]);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  return (
    <main style={{ padding: "2rem" }}>
      {/* Hero */}
      <section style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1>Search Results</h1>
        <p>Showing results for "{query}"</p>
      </section>

      {/* Listings */}
      <section>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length > 0 ? (
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
                {p.price != null && (
                  <p style={{ fontWeight: "bold" }}>${p.price.toFixed(2)}</p>
                )}
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

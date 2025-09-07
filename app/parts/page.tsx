"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function PartsPage() {
  const router = useRouter();
  const [parts, setParts] = useState<any[]>([]);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const { data } = await client.models.Product.list();
        setParts(data);
      } catch (err) {
        console.error("Error fetching parts:", err);
      }
    };
    fetchParts();
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1 style={{ margin: 0 }}>All Parts</h1>
        <button
          onClick={() => router.push("/parts/new")}
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

      {parts.length === 0 ? (
        <p>No parts listed yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          {parts.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "1rem",
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
      )}
    </main>
  );
}

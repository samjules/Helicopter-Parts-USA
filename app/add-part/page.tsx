"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function AddPartPage() {
  const [name, setName] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [price, setPrice] = useState<number | undefined>();
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !partNumber || !price) {
      alert("Please fill in all required fields.");
      return;
    }

    await client.models.Product.create({
      name,
      partNumber,
      price,
      imageUrl,
    });

    alert("Part added successfully!");
    router.push("/");
  };

  return (
    <main
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          backgroundImage: "linear-gradient(90deg, red, white, blue)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "1.5rem",
        }}
      >
        Add New Part
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <input
          type="text"
          placeholder="Part Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Part Number"
          value={partNumber}
          onChange={(e) => setPartNumber(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price (USD)"
          value={price || ""}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button type="submit">Save Part</button>
        <button type="button" onClick={() => router.push("/")}>
          Cancel
        </button>
      </form>
    </main>
  );
}

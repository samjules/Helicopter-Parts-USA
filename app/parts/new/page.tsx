"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs); // Configure Amplify with Gen 2 outputs
const client = generateClient<Schema>();

export default function NewPartPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    partNumber: "",
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
  });

  useEffect(() => {
    console.log("Available models:", client.models); // Should log Product
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log("Input changed:", e.target.name, e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!client.models.Product) {
      console.error("Product model is undefined. Check Amplify Gen 2 setup!");
      return;
    }

    console.log("Creating part with data:", form);

    try {
      const newPart = await client.models.Product.create({
        partNumber: form.partNumber,
        name: form.name,
        description: form.description || undefined,
        price: form.price ? parseFloat(form.price) : undefined,
        imageUrl: form.imageUrl || undefined,
        category: form.category || undefined,
      });
      console.log("Part created:", newPart);
      alert("Part created successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating part:", err);
      alert("Failed to create part. Check console.");
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>List a New Part</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "500px" }}
      >
        <input
          type="text"
          name="partNumber"
          placeholder="Part Number"
          value={form.partNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Part Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
        />
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <button
          type="submit"
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
          Save Part
        </button>
      </form>
    </main>
  );
}

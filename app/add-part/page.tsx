// app/add-part/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function AddPartPage() {
  const [partNumber, setPartNumber] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [newVendorName, setNewVendorName] = useState("");
  const [vendors, setVendors] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const { data } = await client.models.Vendor.list();
        setVendors(data);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      }
    };
    fetchVendors();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await client.models.Product.list();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Create product with optional new vendor
  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    try {
      let vendorIdToUse = vendorId;

      if (newVendorName.trim()) {
        const { data: newVendor } = await client.models.Vendor.create({
          name: newVendorName.trim(),
        });

        if (!newVendor) {
          throw new Error("Vendor creation failed");
        }

        vendorIdToUse = newVendor.id;
      }

      await client.models.Product.create({
        partNumber,
        name,
        description: description || null,
        price: price === "" ? null : Number(price),
        imageUrl: imageUrl || null,
        category: category || null,
        vendorId: vendorIdToUse,
      });

      alert("✅ Product created!");
      setPartNumber("");
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setCategory("");
      setVendorId("");
      setNewVendorName("");

      const { data } = await client.models.Product.list();
      setProducts(data);
    } catch (err) {
      console.error("Error creating product:", err);
      alert("❌ Failed to create product, check console.");
    }
  }

  // Delete product
  async function deleteProduct(id: string) {
    try {
      await client.models.Product.delete({ id });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("❌ Failed to delete product.");
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "Helvetica, sans-serif" }}>
      <h1 style={{ marginBottom: "1rem" }}>Add a New Part</h1>

      <form
        onSubmit={createProduct}
        style={{ display: "grid", gap: "1rem", maxWidth: "500px" }}
      >
        <input
          type="text"
          placeholder="Part Number"
          value={partNumber}
          onChange={(e) => setPartNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {/* Vendor selection */}
        <select
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          disabled={!!newVendorName.trim()}
        >
          <option value="">Select Vendor</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>

        {/* OR create new vendor */}
        <input
          type="text"
          placeholder="Or enter new vendor name"
          value={newVendorName}
          onChange={(e) => setNewVendorName(e.target.value)}
          disabled={!!vendorId}
        />

        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          + Add Part
        </button>
        <button type="button" onClick={() => router.push("/")}>
          ⬅ Back to Home
        </button>
      </form>

      {/* Existing products */}
      <section style={{ marginTop: "3rem" }}>
        <h2>Existing Parts</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((p) => (
            <li
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.5rem 0",
                borderBottom: "1px solid #ddd",
              }}
            >
              <span>
                {p.name} ({p.partNumber})
              </span>
              <button
                onClick={() => deleteProduct(p.id)}
                style={{
                  background: "crimson",
                  color: "white",
                  padding: "0.25rem 0.75rem",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

import type { NextApiRequest, NextApiResponse } from "next";
import { Product } from "../../types";

let products: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 35000000,
    description: "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP",
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
    category: "smartphone",
    brand: "Apple",
    inStock: true,
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    price: 28000000,
    description: "Samsung Galaxy S24 Ultra với S Pen tích hợp",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop",
    category: "smartphone",
    brand: "Samsung",
    inStock: true,
  },
  {
    id: "3",
    name: "MacBook Pro M3",
    price: 45000000,
    description: "MacBook Pro với chip M3, hiệu năng vượt trội",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    category: "laptop",
    brand: "Apple",
    inStock: true,
  },
  {
    id: "4",
    name: "iPad Pro 12.9",
    price: 25000000,
    description: "iPad Pro 12.9 inch với chip M2",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
    category: "tablet",
    brand: "Apple",
    inStock: false,
  },
  {
    id: "5",
    name: "AirPods Pro 2",
    price: 6500000,
    description: "AirPods Pro 2 với Active Noise Cancellation",
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop",
    category: "accessories",
    brand: "Apple",
    inStock: true,
  },
  {
    id: "6",
    name: "Apple Watch Series 9",
    price: 12000000,
    description: "Apple Watch Series 9 với tính năng sức khỏe nâng cao",
    image:
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop",
    category: "accessories",
    brand: "Apple",
    inStock: true,
  },
  {
    id: "7",
    name: "Dell XPS 13",
    price: 32000000,
    description: "Dell XPS 13 với thiết kế InfinityEdge",
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop",
    category: "laptop",
    brand: "Dell",
    inStock: true,
  },
  {
    id: "8",
    name: "Samsung Galaxy Tab S9",
    price: 18000000,
    description: "Samsung Galaxy Tab S9 với màn hình AMOLED",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    category: "tablet",
    brand: "Samsung",
    inStock: true,
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Filter by category if provided
    const { category } = req.query;
    if (category && typeof category === "string") {
      const filteredProducts = products.filter(
        (product) => product.category === category
      );
      return res.status(200).json(filteredProducts);
    }
    res.status(200).json(products);
  } else if (req.method === "POST") {
    // Thêm mới sản phẩm
    const {
      name,
      price,
      description,
      image,
      category,
      brand,
      inStock,
      discount,
    } = req.body;
    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      price: Number(price),
      description,
      image,
      category,
      brand,
      inStock: inStock !== undefined ? inStock : true,
      discount: discount ? Number(discount) : 0,
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } else if (req.method === "PUT") {
    // Sửa sản phẩm
    const {
      id,
      name,
      price,
      description,
      image,
      category,
      brand,
      inStock,
      discount,
    } = req.body;
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    products[idx] = {
      ...products[idx],
      name,
      price: Number(price),
      description,
      image,
      category,
      brand,
      inStock: inStock !== undefined ? inStock : products[idx].inStock,
      discount: discount ? Number(discount) : 0,
    };
    res.status(200).json(products[idx]);
  } else if (req.method === "DELETE") {
    // Xoá sản phẩm
    const { id } = req.query;
    if (!id || typeof id !== "string")
      return res.status(400).json({ error: "Missing id" });
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    const deleted = products.splice(idx, 1);
    res.status(200).json(deleted[0]);
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

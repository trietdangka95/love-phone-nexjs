import type { NextApiRequest, NextApiResponse } from "next";
import { Promo } from "../../types";

const promos: Promo[] = [
  {
    _id: "1",
    name: "Khuyến mãi mùa hè",
    description: "Giảm giá các sản phẩm mùa hè",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop",
    discount: 20,
    maxProducts: 3,
    products: ["1", "2", "3"],
    isActive: true,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  },
  {
    _id: "2",
    name: "Flash Sale",
    description: "Giảm giá nhanh trong 24h",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop",
    discount: 30,
    maxProducts: 2,
    products: ["4", "5"],
    isActive: true,
    startDate: "2024-06-01",
    endDate: "2024-06-02",
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Get all promos or filter by isActive
    const { active } = req.query;
    if (active && typeof active === "string") {
      const filteredPromos = promos.filter(
        (promo) => promo.isActive === (active === "true")
      );
      return res.status(200).json(filteredPromos);
    }
    res.status(200).json(promos);
  } else if (req.method === "POST") {
    // Create new promo
    const {
      name,
      description,
      image,
      discount,
      maxProducts,
      products,
      isActive,
      startDate,
      endDate,
    } = req.body;

    // Validate max products
    if (products && products.length > maxProducts) {
      return res.status(400).json({
        error: `Số sản phẩm không được vượt quá ${maxProducts}`,
      });
    }

    const newPromo: Promo = {
      _id: Date.now().toString(),
      name,
      description,
      image,
      discount: Number(discount),
      maxProducts: Number(maxProducts),
      products: products || [],
      isActive: isActive !== undefined ? isActive : true,
      startDate,
      endDate,
    };
    promos.push(newPromo);
    res.status(201).json(newPromo);
  } else if (req.method === "PUT") {
    // Update promo
    const {
      _id,
      name,
      description,
      image,
      discount,
      maxProducts,
      products,
      isActive,
      startDate,
      endDate,
    } = req.body;

    // Validate max products
    if (products && products.length > maxProducts) {
      return res.status(400).json({
        error: `Số sản phẩm không được vượt quá ${maxProducts}`,
      });
    }

    const idx = promos.findIndex((p) => p._id === _id);
    if (idx === -1) return res.status(404).json({ error: "Promo not found" });

    promos[idx] = {
      ...promos[idx],
      name,
      description,
      image,
      discount: Number(discount),
      maxProducts: Number(maxProducts),
      products: products || [],
      isActive: isActive !== undefined ? isActive : promos[idx].isActive,
      startDate,
      endDate,
    };
    res.status(200).json(promos[idx]);
  } else if (req.method === "DELETE") {
    // Delete promo
    const { id } = req.query;
    if (!id || typeof id !== "string")
      return res.status(400).json({ error: "Missing id" });
    const idx = promos.findIndex((p) => p._id === id);
    if (idx === -1) return res.status(404).json({ error: "Promo not found" });
    const deleted = promos.splice(idx, 1);
    res.status(200).json(deleted[0]);
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

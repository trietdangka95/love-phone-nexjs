import type { NextApiRequest, NextApiResponse } from "next";
import { Product } from "../../types";

const products: Product[] = [
  {
    _id: "1",
    name: "Váy Công Chúa Elsa",
    price: 350000,
    description: "Váy Elsa cho bé gái, chất liệu cotton thoáng mát, thiết kế xinh xắn.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
    brand: "Nhà Bơ",
    sizes: [
      { size: "1", inStock: 10 },
      { size: "2", inStock: 5 },
    ],
    discount: 15,
  },
  {
    _id: "2",
    name: "Áo Thun Bé Trai Siêu Nhân",
    price: 180000,
    description: "Áo thun in hình siêu nhân cho bé trai, chất liệu mềm mại.",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop",
    brand: "Nhà Bơ",
    sizes: [
      { size: "1", inStock: 15 },
      { size: "2", inStock: 8 },
    ],
    discount: 10,
  },
  {
    _id: "3",
    name: "Bộ Đồ Chơi Xếp Hình",
    price: 250000,
    description: "Bộ xếp hình thông minh giúp phát triển tư duy cho bé.",
    image: "https://images.unsplash.com/photo-1503457574465-494bba506e52?w=400&h=300&fit=crop",
    brand: "Nhà Bơ",
    sizes: [{ size: "1", inStock: 20 }],
  },
  {
    _id: "4",
    name: "Set 3 Quần Legging Bé Gái",
    price: 220000,
    description: "Set 3 quần legging nhiều màu cho bé gái, co giãn tốt.",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&fit=crop",
    brand: "Nhà Bơ",
    sizes: [
      { size: "1", inStock: 0 },
      { size: "2", inStock: 12 },
    ],
  },
  {
    _id: "5",
    name: "Nón Tai Gấu Dễ Thương",
    price: 90000,
    description: "Nón len tai gấu cho bé, giữ ấm và cực kỳ dễ thương.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop",
    brand: "Nhà Bơ",
    sizes: [{ size: "1", inStock: 25 }],
    discount: 20,
  },
  {
    _id: "6",
    name: "Balo Hình Thú Cho Bé",
    price: 150000,
    description: "Balo nhỏ xinh hình thú cho bé đi học mẫu giáo.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    brand: "Nhà Bơ",
    sizes: [{ size: "1", inStock: 18 }],
  },
  {
    _id: "7",
    name: "Váy Công Chúa Anna",
    price: 320000,
    description: "Váy Anna cho bé gái, thiết kế đẹp mắt với họa tiết hoa.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
    brand: "Nhà Bơ",
    sizes: [
      { size: "1", inStock: 8 },
      { size: "2", inStock: 6 },
    ],
    discount: 25,
  },
  {
    _id: "8",
    name: "Áo Thun Spider-Man",
    price: 160000,
    description: "Áo thun in hình Spider-Man cho bé trai, chất liệu cotton 100%.",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop",
    brand: "Nhà Bơ",
    sizes: [
      { size: "1", inStock: 12 },
      { size: "2", inStock: 7 },
    ],
  },
  {
    _id: "9",
    name: "Quần Jean Bé Trai",
    price: 280000,
    description: "Quần jean nam tính cho bé trai, chất liệu bền bỉ.",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&fit=crop",
    brand: "Nhà Bơ",
    sizes: [
      { size: "1", inStock: 9 },
      { size: "2", inStock: 11 },
    ],
  },
  {
    _id: "10",
    name: "Bộ Xếp Hình LEGO",
    price: 450000,
    description: "Bộ xếp hình LEGO chính hãng, phát triển tư duy sáng tạo.",
    image: "https://images.unsplash.com/photo-1503457574465-494bba506e52?w=400&h=300&fit=crop",
    brand: "LEGO",
    sizes: [{ size: "1", inStock: 15 }],
    discount: 30,
  },
  {
    _id: "11",
    name: "Giày Sneaker Bé Trai",
    price: 320000,
    description: "Giày sneaker thể thao cho bé trai, thoải mái khi vận động.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop",
    brand: "Nhà Bơ",
    sizes: [
      { size: "1", inStock: 14 },
      { size: "2", inStock: 8 },
    ],
  },
  {
    _id: "12",
    name: "Túi Đeo Chéo Bé Gái",
    price: 120000,
    description: "Túi đeo chéo nhỏ xinh cho bé gái, nhiều màu sắc.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    brand: "Nhà Bơ",
    sizes: [{ size: "1", inStock: 22 }],
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Return all products
    res.status(200).json(products);
  } else if (req.method === "POST") {
    // Thêm mới sản phẩm
    const {
      name,
      price,
      description,
      image,
      brand,
      discount,
      sizes,
    } = req.body;
    const newProduct: Product = {
      _id: Date.now().toString(),
      name,
      price: Number(price),
      description,
      image,
      brand,
      discount: discount ? Number(discount) : undefined,
      sizes: sizes || [],
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } else if (req.method === "PUT") {
    // Sửa sản phẩm
    const {
      _id,
      name,
      price,
      description,
      image,
      brand,
      discount,
      sizes,
    } = req.body;
    const idx = products.findIndex((p) => p._id === _id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    products[idx] = {
      ...products[idx],
      name,
      price: Number(price),
      description,
      image,
      brand,
      discount: discount ? Number(discount) : undefined,
      sizes: sizes || products[idx].sizes,
    };
    res.status(200).json(products[idx]);
  } else if (req.method === "DELETE") {
    // Xoá sản phẩm
    const { _id } = req.query;
    if (!_id || typeof _id !== "string")
      return res.status(400).json({ error: "Missing _id" });
    const idx = products.findIndex((p) => p._id === _id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    const deleted = products.splice(idx, 1);
    res.status(200).json(deleted[0]);
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

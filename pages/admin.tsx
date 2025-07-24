import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useToast } from "../components/ui/Toast";
import { getImageUrl } from "../ultil";
import PreviewImage from "../components/PreviewImage";
import Image from "next/image";

interface SizeStock {
  size: string; // '1', '2', '3'
  inStock: number;
}
interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  discount?: number;
  description: string;
  sizes?: SizeStock[];
  brand?: string;
}

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // State cho file ảnh và preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { showToast } = useToast();
  // State cho modal preview ảnh
  const [modalImage, setModalImage] = useState<string | null>(null);

  // Check admin login (mock)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      const user = localStorage.getItem("user");
      if (user === "admin" || user === "admin@gmail.com") {
        setIsAdmin(true);
      } else {
        router.replace("/login");
      }
    }
  }, [router]);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error("Lỗi khi lấy danh sách sản phẩm");
      const data = await res.json();

      // Không cần gán id, dùng _id từ backend
      setProducts(data);
    } catch (err) {
      const error = err as Error;
      showToast(error.message || "Lỗi không xác định", "error");
    } finally {
      setLoading(false);
    }
  }, [API_BASE, showToast]);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin, fetchProducts]);

  if (!isClient) return null;
  if (!isAdmin) return null;

  const handleInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "file" && name === "image") {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        setImageFile(files[0]);
        setPreview(URL.createObjectURL(files[0]));
      }
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.name || !form.price || !form.description) return;
    setLoading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await fetch(`${API_BASE}/upload`, {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        imageUrl =
          uploadData.imageUrl || uploadData.url || uploadData.link || "";
      }
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          image: imageUrl,
          sizes: form.sizes?.filter((s: SizeStock) => s.inStock > 0) || [],
        }),
      });
      if (!res.ok) throw new Error("Lỗi khi thêm sản phẩm");
      setForm({});
      setImageFile(null);
      setPreview(null);
      setShowAdd(false);
      await fetchProducts();
      showToast("Tạo sản phẩm thành công!", "success");
    } catch (err) {
      const error = err as Error;
      showToast(error.message || "Lỗi không xác định", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: Product) => {
    setEditingId(p._id);
    setForm(p);
  };

  const handleCancel = () => {
    setShowAdd(false);
    setEditingId(null);
    setForm({});
    setImageFile(null);
    setPreview(null);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.image || "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await fetch(`${API_BASE}/upload`, {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        imageUrl =
          uploadData.imageUrl || uploadData.url || uploadData.link || "";
      }

      const res = await fetch(`${API_BASE}/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          _id: editingId,
          image: imageUrl,
          sizes: form.sizes?.filter((s: SizeStock) => s.inStock > 0) || [],
        }),
      });

      console.log(
        JSON.stringify({
          ...form,
          _id: editingId,
          image: imageUrl,
        })
      );

      if (!res.ok) throw new Error("Lỗi khi sửa sản phẩm");
      setEditingId(null);
      setForm({});
      setImageFile(null);
      setPreview(null);
      await fetchProducts();
      showToast("Cập nhật sản phẩm thành công!", "success");
    } catch (err) {
      const error = err as Error;
      showToast(error.message || "Lỗi không xác định", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Lỗi khi xoá sản phẩm");
      await fetchProducts();
    } catch (err) {
      const error = err as Error;
      showToast(error.message || "Lỗi không xác định", "error");
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy link ảnh đầy đủ

  return (
    <div className="mx-8 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Quản lý sản phẩm</h1>
      <div className="mb-4 flex justify-end">
        <button
          className="px-4 py-2 bg-primary-500 text-white rounded"
          onClick={() => setShowAdd((v) => !v)}
        >
          {showAdd ? "Đóng" : "Thêm sản phẩm"}
        </button>
      </div>
      {showAdd && (
        <div className="mb-6 p-4 border rounded bg-primary-50 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Tên sản phẩm"
              className="border p-2 rounded w-full"
              value={form.name || ""}
              onChange={handleInput}
            />
            <input
              name="image"
              type="file"
              accept="image/*"
              className="border p-2 rounded w-full"
              onChange={handleInput}
            />
            {preview && (
              <Image
                src={preview}
                alt="preview"
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded mt-1"
              />
            )}
            <input
              name="price"
              type="number"
              placeholder="Giá"
              className="border p-2 rounded w-full"
              value={form.price || ""}
              onChange={handleInput}
            />
            {/* Chọn size và nhập tồn kho cho từng size */}
            <div className="flex flex-col gap-2 mt-2">
              {["1", "2", "3"].map((size) => {
                const found = form.sizes?.find(
                  (s: SizeStock) => s.size === size
                );
                return (
                  <div key={size} className="flex items-center gap-2">
                    <label className="w-28">
                      {size === "1"
                        ? "Size 1 (5-7 tháng)"
                        : size === "2"
                        ? "Size 2 (7-12 tháng)"
                        : "Size 3 (>12 tháng)"}
                    </label>
                    <input
                      type="number"
                      min={0}
                      className="border p-2 rounded w-32"
                      placeholder="Tồn kho"
                      value={found?.inStock ?? ""}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setForm((prev: Partial<Product>) => {
                          const sizes = prev.sizes ? [...prev.sizes] : [];
                          const idx = sizes.findIndex(
                            (s: SizeStock) => s.size === size
                          );
                          if (val === 0 || isNaN(val)) {
                            if (idx !== -1) sizes.splice(idx, 1);
                          } else {
                            if (idx !== -1) sizes[idx].inStock = val;
                            else sizes.push({ size, inStock: val });
                          }
                          return { ...prev, sizes };
                        });
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <input
              name="discount"
              type="number"
              placeholder="Giảm giá (%)"
              className="border p-2 rounded w-full"
              value={form.discount || ""}
              onChange={handleInput}
            />
            <textarea
              name="description"
              placeholder="Mô tả"
              className="border p-2 rounded w-full col-span-1 md:col-span-2"
              value={form.description || ""}
              onChange={handleInput}
            />
          </div>
          <div className="mt-4 flex gap-2 flex-wrap justify-end">
            <button
              className="px-4 py-2 bg-primary-600 text-white rounded"
              onClick={handleAdd}
              disabled={loading}
            >
              Thêm
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={handleCancel}
              disabled={loading}
            >
              Huỷ
            </button>
          </div>
        </div>
      )}
      {loading && <div className="mb-4 text-primary-500">Đang xử lý...</div>}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-primary-100">
            <th className="p-2 border">No</th>
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">Hình</th>
            <th className="p-2 border">Giá</th>
            <th className="p-2 border">Size & tồn kho</th>
            <th className="p-2 border">Giảm giá</th>
            <th className="p-2 border">Mô tả</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => (
            <tr key={p._id}>
              <td className="border p-2 w-16 text-center">{idx + 1}</td>
              <td className="border p-2 w-40 text-center">
                {editingId === p._id ? (
                  <input
                    name="name"
                    className="border p-1 rounded w-full"
                    value={form.name || ""}
                    onChange={handleInput}
                  />
                ) : (
                  p.name
                )}
              </td>
              <td className="border p-2 w-80 text-center">
                {editingId === p._id ? (
                  <>
                    <input
                      name="image"
                      type="file"
                      accept="image/*"
                      className="border p-1 rounded w-full"
                      onChange={handleInput}
                    />
                    {preview && (
                      <Image
                        src={preview}
                        alt="preview"
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded mt-1"
                      />
                    )}
                  </>
                ) : (
                  <Image
                    src={getImageUrl(p.image)}
                    alt={p.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded cursor-pointer mx-auto"
                    onClick={() => setModalImage(getImageUrl(p.image))}
                  />
                )}
              </td>
              <td className="border p-2 w-32 text-center">
                {editingId === p._id ? (
                  <input
                    name="price"
                    type="number"
                    className="border p-1 rounded w-full"
                    value={form.price || ""}
                    onChange={handleInput}
                  />
                ) : (
                  p.price.toLocaleString("vi-VN")
                )}
              </td>
              <td className="border p-2 w-48 text-center">
                {editingId === p._id ? (
                  <div className="flex flex-col gap-1">
                    {["1", "2", "3"].map((size) => {
                      const found = form.sizes?.find(
                        (s: SizeStock) => s.size === size
                      );
                      return (
                        <div key={size} className="flex items-center gap-2">
                          <label className="w-20">
                            {size === "1"
                              ? "Size 1"
                              : size === "2"
                              ? "Size 2"
                              : "Size 3"}
                          </label>
                          <input
                            type="number"
                            min={0}
                            className="border p-1 rounded w-16"
                            value={found?.inStock ?? ""}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setForm((prev: Partial<Product>) => {
                                const sizes = prev.sizes ? [...prev.sizes] : [];
                                const idx = sizes.findIndex(
                                  (s: SizeStock) => s.size === size
                                );
                                if (val === 0 || isNaN(val)) {
                                  if (idx !== -1) sizes.splice(idx, 1);
                                } else {
                                  if (idx !== -1) sizes[idx].inStock = val;
                                  else sizes.push({ size, inStock: val });
                                }
                                return { ...prev, sizes };
                              });
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : p.sizes && p.sizes.length > 0 ? (
                  p.sizes.map((s: SizeStock) => (
                    <div key={s.size}>
                      {s.size === "1"
                        ? "Size 1"
                        : s.size === "2"
                        ? "Size 2"
                        : "Size 3"}
                      : {s.inStock}
                    </div>
                  ))
                ) : (
                  <span>—</span>
                )}
              </td>
              <td className="border p-2 w-32 text-center">
                {editingId === p._id ? (
                  <input
                    name="discount"
                    type="number"
                    className="border p-1 rounded w-full"
                    value={form.discount || ""}
                    onChange={handleInput}
                  />
                ) : (
                  (p.discount || 0) + "%"
                )}
              </td>
              <td className="border p-2 text-center">
                {editingId === p._id ? (
                  <textarea
                    name="description"
                    className="border p-1 rounded w-full"
                    value={form.description || ""}
                    onChange={handleInput}
                  />
                ) : (
                  p.description
                )}
              </td>
              <td className="border p-2 w-32 text-center">
                {editingId === p._id ? (
                  <>
                    <button
                      className="px-2 py-1 bg-primary-500 text-white rounded mr-1"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      Lưu
                    </button>
                    <button
                      className="px-2 py-1 bg-gray-300 rounded"
                      onClick={() => setEditingId(null)}
                      disabled={loading}
                    >
                      Huỷ
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="px-2 py-1 bg-primary-500 text-white rounded mr-1"
                      onClick={() => handleEdit(p)}
                      disabled={loading}
                    >
                      Sửa
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleDelete(p._id)}
                      disabled={loading}
                    >
                      Xoá
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal preview ảnh */}
      {modalImage && (
        <PreviewImage src={modalImage} onClose={() => setModalImage(null)} />
      )}
    </div>
  );
};

export default AdminPage;

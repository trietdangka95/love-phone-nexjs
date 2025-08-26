import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useToast } from "../components/ui/Toast";
import { getImageUrl } from "../ultil";
import PreviewImage from "../components/PreviewImage";
import Image from "next/image";
import {
  FiHome,
  FiPackage,
  FiUsers,
  FiShoppingCart,
  FiSettings,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiBarChart,
  FiDollarSign,
  FiTrendingUp,
  FiGrid,
} from "react-icons/fi";

interface SizeStock {
  size: string;
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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { showToast } = useToast();
  const [modalImage, setModalImage] = useState<string | null>(null);

  // Check admin login
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
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Lỗi khi xoá sản phẩm");
      await fetchProducts();
      showToast("Xóa sản phẩm thành công!", "success");
    } catch (err) {
      const error = err as Error;
      showToast(error.message || "Lỗi không xác định", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = products.reduce(
    (sum, product) => sum + product.price,
    0
  );
  const totalProducts = products.length;
  const lowStockProducts = products.filter((product) =>
    product.sizes?.some((size) => size.inStock < 5)
  ).length;

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiDollarSign size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng doanh thu
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalRevenue.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiPackage size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiTrendingUp size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Sản phẩm bán chạy
              </p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FiBarChart size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sắp hết hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {lowStockProducts}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Hoạt động gần đây
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product._id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Image
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Còn hàng
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h2>
          <p className="text-gray-600">
            Quản lý tất cả sản phẩm trong cửa hàng
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" size={16} />
          Thêm sản phẩm
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-lg shadow-lg border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Thêm sản phẩm mới
            </h3>
          </div>
          <form onSubmit={handleAdd} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sản phẩm
                </label>
                <input
                  name="name"
                  placeholder="Nhập tên sản phẩm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.name || ""}
                  onChange={handleInput}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh
                </label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={handleInput}
                />
                {preview && (
                  <div className="mt-2">
                    <Image
                      src={preview}
                      alt="preview"
                      width={100}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá (VNĐ)
                </label>
                <input
                  name="price"
                  type="number"
                  placeholder="Nhập giá sản phẩm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.price || ""}
                  onChange={handleInput}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giảm giá (%)
                </label>
                <input
                  name="discount"
                  type="number"
                  placeholder="Nhập % giảm giá"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.discount || ""}
                  onChange={handleInput}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                placeholder="Nhập mô tả sản phẩm"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.description || ""}
                onChange={handleInput}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Quản lý kho hàng
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["1", "2", "3"].map((size) => {
                  const found = form.sizes?.find(
                    (s: SizeStock) => s.size === size
                  );
                  return (
                    <div key={size} className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {size === "1"
                          ? "Size 1 (5-7 tháng)"
                          : size === "2"
                          ? "Size 2 (7-12 tháng)"
                          : "Size 3 (>12 tháng)"}
                      </label>
                      <input
                        type="number"
                        min={0}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Số lượng"
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
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Thêm sản phẩm"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h3 className="text-lg font-medium text-gray-900">
              Danh sách sản phẩm ({filteredProducts.length})
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiGrid
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kho hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <Image
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-lg object-cover cursor-pointer"
                          onClick={() =>
                            setModalImage(getImageUrl(product.image))
                          }
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {editingId === product._id ? (
                            <input
                              name="name"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                              value={form.name || ""}
                              onChange={handleInput}
                            />
                          ) : (
                            product.name
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {editingId === product._id ? (
                            <textarea
                              name="description"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                              value={form.description || ""}
                              onChange={handleInput}
                              rows={2}
                            />
                          ) : (
                            product.description
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {editingId === product._id ? (
                        <input
                          name="price"
                          type="number"
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          value={form.price || ""}
                          onChange={handleInput}
                        />
                      ) : (
                        <span className="font-medium">
                          {product.price.toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </div>
                    {product.discount && (
                      <div className="text-sm text-green-600">
                        Giảm {product.discount}%
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === product._id ? (
                      <div className="space-y-2">
                        {["1", "2", "3"].map((size) => {
                          const found = form.sizes?.find(
                            (s: SizeStock) => s.size === size
                          );
                          return (
                            <div
                              key={size}
                              className="flex items-center space-x-2"
                            >
                              <span className="text-xs text-gray-500 w-8">
                                Size {size}
                              </span>
                              <input
                                type="number"
                                min={0}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                                value={found?.inStock ?? ""}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setForm((prev: Partial<Product>) => {
                                    const sizes = prev.sizes
                                      ? [...prev.sizes]
                                      : [];
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
                    ) : (
                      <div className="space-y-1">
                        {product.sizes && product.sizes.length > 0 ? (
                          product.sizes.map((size) => (
                            <div
                              key={size.size}
                              className="text-sm text-gray-900"
                            >
                              <span className="font-medium">
                                Size {size.size}:
                              </span>{" "}
                              <span
                                className={
                                  size.inStock < 5
                                    ? "text-red-600"
                                    : "text-gray-600"
                                }
                              >
                                {size.inStock}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">—</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.sizes &&
                    product.sizes.some((s) => s.inStock > 0) ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Còn hàng
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Hết hàng
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingId === product._id ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleSave}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                          disabled={loading}
                        >
                          <FiSave size={12} className="mr-1" />
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                          disabled={loading}
                        >
                          <FiX size={12} className="mr-1" />
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                          disabled={loading}
                        >
                          <FiEdit2 size={12} className="mr-1" />
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                          disabled={loading}
                        >
                          <FiTrash2 size={12} className="mr-1" />
                          Xóa
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "products":
        return renderProducts();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <FiHome className="mr-3" size={18} />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "products"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <FiPackage className="mr-3" size={18} />
                Sản phẩm
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "orders"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <FiShoppingCart className="mr-3" size={18} />
                Đơn hàng
              </button>
              <button
                onClick={() => setActiveTab("customers")}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "customers"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <FiUsers className="mr-3" size={18} />
                Khách hàng
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "settings"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <FiSettings className="mr-3" size={18} />
                Cài đặt
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          {loading && (
            <div className="mb-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Đang xử lý...</span>
            </div>
          )}
          {renderContent()}
        </main>
      </div>

      {/* Modal preview ảnh */}
      {modalImage && (
        <PreviewImage src={modalImage} onClose={() => setModalImage(null)} />
      )}
    </div>
  );
};

export default AdminPage;

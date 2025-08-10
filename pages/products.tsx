import React, { useState, useEffect, useMemo, useRef } from "react";
import { Product } from "../types/index";
import { useDispatch } from "react-redux";
import { addToCart } from "../lib/slices/cartSlice";
import ProductCard from "../components/product/ProductCard";
import Button from "../components/ui/Button";
import { FaFilter } from "react-icons/fa";

// Không dùng mockProducts nữa

const sortTabs = [
  { key: "featured", label: "Nổi bật" },
  { key: "bestseller", label: "Bán chạy" },
  { key: "discount", label: "Giảm giá" },
  { key: "new", label: "Mới" },
  { key: "price", label: "Giá" },
];

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState<
    "name" | "price-low" | "price-high"
  >("name");
  const [activeSortTab, setActiveSortTab] = useState("featured");
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const priceDropdownRef = useRef<HTMLDivElement>(null);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch products from API
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi lấy danh sách sản phẩm");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message || "Lỗi không xác định"))
      .finally(() => setLoading(false));
  }, [API_BASE]);

  // Đặt lại sortOption khi chọn tab Giá
  useEffect(() => {
    if (activeSortTab !== "price") {
      setShowPriceDropdown(false);
    }
  }, [activeSortTab]);
  // Đóng dropdown khi click ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        priceDropdownRef.current &&
        !priceDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPriceDropdown(false);
      }
    }
    if (showPriceDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPriceDropdown]);

  // Đóng filter khi click ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    }
    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  // Get unique categories and brands
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category))
    );
    return uniqueCategories;
  }, [products]);

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(
      new Set(products.map((product) => product.brand))
    );
    return uniqueBrands;
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      // Không còn lọc theo category
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;
      // Lọc còn hàng dựa vào tổng tồn kho các size
      const totalStock = Array.isArray(product.sizes)
        ? product.sizes.reduce((sum, s) => sum + (s.inStock || 0), 0)
        : 0;
      const matchesStock = !showInStockOnly || totalStock > 0;

      return matchesSearch && matchesBrand && matchesStock;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchTerm, selectedBrand, showInStockOnly, sortOption]);

  interface SizeSelection {
    size: string;
    quantity: number;
  }
  const handleAddToCart = (product: Product, selections: SizeSelection[]) => {
    selections.forEach((sel) => {
      const sizeInfo = product.sizes?.find((s) => s.size === sel.size);
      if (sizeInfo && sel.quantity > 0) {
        dispatch(
          addToCart({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: sel.quantity,
            size: sel.size,
          })
        );
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedBrand("");
    setShowInStockOnly(false);
    setSortOption("name");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tất cả sản phẩm
          </h1>
          <p className="text-lg text-gray-600">
            Khám phá các sản phẩm nổi bật của Tiệm Nhỏ Nhà Bơ
          </p>
        </div>

        {/* Section filter chỉ hiện khi showFilter true */}
        {showFilter && (
          <div
            ref={filterRef}
            className="bg-white rounded-lg shadow border border-gray-200 mb-4 p-3 relative z-20"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-semibold text-gray-900">
                Bộ lọc & Sắp xếp
              </h2>
              <button
                className="text-xs px-2 py-1 text-gray-500 hover:text-primary-600"
                onClick={() => setShowFilter(false)}
              >
                Đóng
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Category Filter */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Loại sản phẩm
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-2 py-1 pr-7 border border-gray-300 rounded-md bg-white text-xs font-normal leading-normal focus:outline-none focus:ring-1 focus:ring-primary-300 focus:border-primary-400 transition appearance-none"
                  >
                    <option value="">Tất cả loại</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="w-3 h-3 text-gray-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {/* Brand Filter */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Thương hiệu
                </label>
                <div className="relative">
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-2 py-1 pr-7 border border-gray-300 rounded-md bg-white text-xs font-normal leading-normal focus:outline-none focus:ring-1 focus:ring-primary-300 focus:border-primary-400 transition appearance-none"
                  >
                    <option value="">Tất cả thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="w-3 h-3 text-gray-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {/* Stock Filter */}
              <div className="flex items-end">
                <label className="flex items-center h-7">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={(e) => setShowInStockOnly(e.target.checked)}
                    className="h-3 w-3 text-primary-500 focus:ring-primary-300 border-gray-300 rounded transition"
                  />
                  <span className="ml-2 text-xs text-gray-700">Còn hàng</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Sort Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">Sắp xếp theo:</span>
          {sortTabs.map((tab) => (
            <div key={tab.key} className="relative">
              <button
                type="button"
                className={`px-2 py-1 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-1 focus:ring-primary-300
                  ${
                    activeSortTab === tab.key
                      ? "text-primary-600 bg-primary-100"
                      : "text-gray-600 hover:text-primary-600"
                  }
                `}
                onClick={() => {
                  if (tab.key === "price") {
                    setActiveSortTab("price");
                    setShowPriceDropdown((v) => !v);
                  } else {
                    setActiveSortTab(tab.key);
                    setShowPriceDropdown(false);
                    // setSortOption theo tab nếu muốn
                  }
                }}
              >
                {tab.label}
                {tab.key === "price" && (
                  <svg
                    className="inline w-3 h-3 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>
              {tab.key === "price" &&
                showPriceDropdown &&
                activeSortTab === "price" && (
                  <div
                    ref={priceDropdownRef}
                    className="absolute left-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow z-10"
                  >
                    <button
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-primary-50 ${
                        sortOption === "price-low"
                          ? "text-primary-600 font-semibold"
                          : "text-gray-700"
                      }`}
                      onClick={() => {
                        setSortOption("price-low");
                        setShowPriceDropdown(false);
                      }}
                    >
                      Giá thấp - cao
                    </button>
                    <button
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-primary-50 ${
                        sortOption === "price-high"
                          ? "text-primary-600 font-semibold"
                          : "text-gray-700"
                      }`}
                      onClick={() => {
                        setSortOption("price-high");
                        setShowPriceDropdown(false);
                      }}
                    >
                      Giá cao - thấp
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-gray-500 text-lg mb-2">
              Không tìm thấy sản phẩm phù hợp
            </div>
            <p className="text-gray-400 mb-4">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="text-sm"
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

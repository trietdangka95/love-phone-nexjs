import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";

import { addToCart } from "../lib/slices/cartSlice";
import { getImageUrl } from "../ultil";

interface ApiProduct {
  _id: string;
  name: string;
  image: string;
  price: number;
  discount?: number;
  description: string;
  sizes?: Array<{ size: string; inStock: number }>;
  brand?: string;
}

interface Category {
  name: string;
  icon: string;
  count: number;
  color: string;
  products: ApiProduct[];
}

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Slider data
  const slides = [
    {
      id: 1,
      title: "Váy Công Chúa Elsa",
      subtitle: "Ưu đãi lên đến 30% cho bé gái",
      description:
        "Khám phá bộ sưu tập váy công chúa xinh xắn, chất liệu an toàn cho bé.",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop&crop=center",
      discount: "30%",
      buttonText: "Mua ngay",
      bgGradient: "from-pink-400 via-pink-300 to-pink-500",
    },
    {
      id: 2,
      title: "Áo Thun Bé Trai Siêu Nhân",
      subtitle: "Giảm giá 20% cho áo thun hè",
      description:
        "Áo thun in hình siêu nhân, chất liệu cotton mềm mại, thoáng mát cho bé trai.",
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&h=600&fit=crop&crop=center",
      discount: "20%",
      buttonText: "Khám phá",
      bgGradient: "from-blue-400 via-blue-300 to-blue-500",
    },
    {
      id: 3,
      title: "Bộ Đồ Chơi Xếp Hình",
      subtitle: "Tặng quà cho bé khi mua từ 2 bộ trở lên",
      description:
        "Đồ chơi xếp hình thông minh, phát triển tư duy sáng tạo cho bé.",
      image:
        "https://images.unsplash.com/photo-1503457574465-494bba506e52?w=800&h=600&fit=crop&crop=center",
      discount: "Quà tặng",
      buttonText: "Xem chi tiết",
      bgGradient: "from-yellow-400 via-yellow-300 to-yellow-500",
    },
  ];

  // Category definitions
  const categoryDefinitions = [
    {
      name: "Váy bé gái",
      keywords: ["váy", "dress", "công chúa", "princess", "elsa", "anna"],
      icon: "👗",
      color: "bg-pink-400",
    },
    {
      name: "Áo bé trai",
      keywords: ["áo", "shirt", "thun", "siêu nhân", "superman", "spider"],
      icon: "👕",
      color: "bg-blue-400",
    },
    {
      name: "Quần bé gái",
      keywords: ["quần", "pants", "legging", "short"],
      icon: "👖",
      color: "bg-purple-400",
    },
    {
      name: "Đồ chơi",
      keywords: ["đồ chơi", "toy", "xếp hình", "puzzle", "block"],
      icon: "🧸",
      color: "bg-yellow-400",
    },
    {
      name: "Phụ kiện trẻ em",
      keywords: ["nón", "mũ", "balo", "túi", "giày", "dép", "accessory"],
      icon: "🎀",
      color: "bg-green-400",
    },
    {
      name: "Sản phẩm khác",
      keywords: [],
      icon: "📦",
      color: "bg-gray-400",
    },
  ];

  // Categorize products based on name
  const categorizeProducts = (products: ApiProduct[]): Category[] => {
    const categorizedProducts: { [key: string]: ApiProduct[] } = {};

    // Initialize categories
    categoryDefinitions.forEach((cat) => {
      categorizedProducts[cat.name] = [];
    });

    products.forEach((product) => {
      const productName = product.name.toLowerCase();
      let isCategorized = false;

      // Try to match with specific categories
      for (let i = 0; i < categoryDefinitions.length - 1; i++) {
        const category = categoryDefinitions[i];
        if (
          category.keywords.some((keyword) => productName.includes(keyword))
        ) {
          categorizedProducts[category.name].push(product);
          isCategorized = true;
          break;
        }
      }

      // If no match found, put in "Sản phẩm khác"
      if (!isCategorized) {
        categorizedProducts["Sản phẩm khác"].push(product);
      }
    });

    // Convert to Category array
    return categoryDefinitions
      .map((cat) => ({
        name: cat.name,
        icon: cat.icon,
        count: categorizedProducts[cat.name]?.length || 0,
        color: cat.color,
        products: categorizedProducts[cat.name] || [],
      }))
      .filter((cat) => cat.count > 0); // Only show categories with products
  };

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Use NEXT_PUBLIC_API_BASE_URL if available, otherwise use local API
      const apiUrl = API_BASE || "";
      const endpoint = apiUrl ? `${apiUrl}/products` : "/products";
      console.log("Fetching products from:", endpoint);

      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response status:", res.status);
      if (!res.ok) throw new Error("Lỗi khi lấy danh sách sản phẩm");
      const data = await res.json();
      console.log("Products fetched:", data);
      console.log("Number of products:", data.length);
      setProducts(data);

      // Categorize products
      const categorized = categorizeProducts(data);
      console.log("Categories created:", categorized);
      setCategories(categorized);
    } catch (err) {
      console.error("Error fetching products:", err);
      // Fallback to mock data if API fails
      const mockProducts: ApiProduct[] = [
        {
          _id: "1",
          name: "Váy Công Chúa Elsa",
          price: 350000,
          description:
            "Váy Elsa cho bé gái, chất liệu cotton thoáng mát, thiết kế xinh xắn.",
          image:
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
          brand: "Nhà Bơ",
          sizes: [
            { size: "1", inStock: 10 },
            { size: "2", inStock: 5 },
          ],
        },
        {
          _id: "2",
          name: "Áo Thun Bé Trai Siêu Nhân",
          price: 180000,
          description:
            "Áo thun in hình siêu nhân cho bé trai, chất liệu mềm mại.",
          image:
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop",
          brand: "Nhà Bơ",
          sizes: [
            { size: "1", inStock: 15 },
            { size: "2", inStock: 8 },
          ],
        },
        {
          _id: "3",
          name: "Bộ Đồ Chơi Xếp Hình",
          price: 250000,
          description: "Bộ xếp hình thông minh giúp phát triển tư duy cho bé.",
          image:
            "https://images.unsplash.com/photo-1503457574465-494bba506e52?w=400&h=300&fit=crop",
          brand: "Nhà Bơ",
          sizes: [{ size: "1", inStock: 20 }],
        },
        {
          _id: "4",
          name: "Set 3 Quần Legging Bé Gái",
          price: 220000,
          description: "Set 3 quần legging nhiều màu cho bé gái, co giãn tốt.",
          image:
            "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&fit=crop",
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
          image:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop",
          brand: "Nhà Bơ",
          sizes: [{ size: "1", inStock: 25 }],
        },
        {
          _id: "6",
          name: "Balo Hình Thú Cho Bé",
          price: 150000,
          description: "Balo nhỏ xinh hình thú cho bé đi học mẫu giáo.",
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
          brand: "Nhà Bơ",
          sizes: [{ size: "1", inStock: 18 }],
        },
      ];
      setProducts(mockProducts);
      const categorized = categorizeProducts(mockProducts);
      setCategories(categorized);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  }, [slides.length]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, [autoPlayRef]);

  const handleUserInteraction = useCallback(() => {
    setIsAutoPlay(false);
    stopAutoPlay();

    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlay(true);
      startAutoPlay();
    }, 10000);
  }, [startAutoPlay, stopAutoPlay]);

  useEffect(() => {
    if (isAutoPlay) {
      startAutoPlay();
    }

    return () => {
      stopAutoPlay();
    };
  }, [isAutoPlay, slides.length, startAutoPlay, stopAutoPlay]);

  const handleAddToCart = (product: ApiProduct) => {
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: getImageUrl(product.image),
        quantity: 1,
      })
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    handleUserInteraction();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    handleUserInteraction();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    handleUserInteraction();
  };

  // Get filtered products based on selected category
  const getFilteredProducts = () => {
    if (!selectedCategory) {
      return products;
    }
    const category = categories.find((cat) => cat.name === selectedCategory);
    return category ? category.products : products;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Slider */}
      <section className="relative h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-full"
            }`}
          >
            <div
              className={`relative h-full bg-gradient-to-br ${slide.bgGradient} text-white overflow-hidden`}
            >
              {/* Background decoration */}
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-white opacity-10 rounded-full"></div>
                <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white opacity-10 rounded-full"></div>
              </div>

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                        🎉 Khuyến mãi đặc biệt - {slide.discount} giảm giá
                      </div>
                      <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                        {slide.title}
                        <span className="block text-3xl md:text-4xl font-normal opacity-90 mt-2">
                          {slide.subtitle}
                        </span>
                      </h1>
                      <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
                        {slide.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <span className="text-lg">🚚</span>
                        </div>
                        <div>
                          <p className="font-semibold">Miễn phí vận chuyển</p>
                          <p className="text-sm opacity-90">Toàn quốc</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <span className="text-lg">🛡️</span>
                        </div>
                        <div>
                          <p className="font-semibold">Bảo hành chính hãng</p>
                          <p className="text-sm opacity-90">12 tháng</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <span className="text-lg">💳</span>
                        </div>
                        <div>
                          <p className="font-semibold">Trả góp 0%</p>
                          <p className="text-sm opacity-90">Lãi suất</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="bg-white text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        {slide.buttonText}
                      </button>
                      <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-800 transition-all duration-300">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="relative z-10">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        width={400}
                        height={300}
                        className="rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                        priority={index === 0}
                      />
                    </div>
                    <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-6 shadow-xl z-20">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">
                          {slide.discount}
                        </div>
                        <div className="text-sm text-gray-600">Giảm giá</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 z-30"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 z-30"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Auto-play indicator */}
        <div className="absolute top-4 right-4 z-30">
          <div
            className={`flex items-center space-x-2 px-3 py-2 bg-white bg-opacity-20 rounded-full text-white text-sm ${
              isAutoPlay ? "opacity-100" : "opacity-50"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isAutoPlay ? "bg-white" : "bg-white bg-opacity-50"
              }`}
            ></div>
            <span>{isAutoPlay ? "Tự động" : "Tạm dừng"}</span>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Danh mục sản phẩm
            </h2>
            <p className="text-gray-600">Chọn danh mục bạn quan tâm</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div
              onClick={() => setSelectedCategory(null)}
              className={`bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border-2 ${
                selectedCategory === null
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200"
              }`}
            >
              <div className="w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tất cả
              </h3>
              <p className="text-gray-600">{products.length} sản phẩm</p>
            </div>

            {categories.map((category) => (
              <div
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border-2 ${
                  selectedCategory === category.name
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200"
                }`}
              >
                <div
                  className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600">{category.count} sản phẩm</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedCategory ? `${selectedCategory}` : "Tất cả sản phẩm"}
              </h2>
              <p className="text-gray-600">
                {selectedCategory
                  ? `Khám phá ${selectedCategory.toLowerCase()} tại Tiệm Nhỏ Nhà Bố`
                  : "Những sản phẩm được yêu thích nhất tại Tiệm Nhỏ Nhà Bố"}
              </p>
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Xem tất cả →
              </button>
            )}
          </div>

          {getFilteredProducts().length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không có sản phẩm nào
              </h3>
              <p className="text-gray-600">
                Hiện tại chưa có sản phẩm trong danh mục này
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getFilteredProducts().map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <Image
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    {product.discount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                        -{product.discount}%
                      </div>
                    )}
                    {product.sizes &&
                    product.sizes.some((s) => s.inStock > 0) ? (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                        Còn hàng
                      </div>
                    ) : (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                        Hết hàng
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xl font-bold text-teal-600">
                        {product.price.toLocaleString("vi-VN")}đ
                      </span>
                      {product.brand && (
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {product.brand}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={
                        !product.sizes ||
                        !product.sizes.some((s) => s.inStock > 0)
                      }
                      className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {product.sizes && product.sizes.some((s) => s.inStock > 0)
                        ? "Thêm vào giỏ"
                        : "Hết hàng"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotions */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Khuyến mãi đặc biệt
            </h2>
            <p className="text-gray-600">
              Ưu đãi lên đến 30% cho các sản phẩm thời trang trẻ em hot nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-pink-400 to-pink-500 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Váy Công Chúa Elsa</h3>
              <p className="text-pink-100 mb-4">
                Ưu đãi lên đến 30% cho bé gái
              </p>
              <button className="bg-white text-pink-600 px-6 py-2 rounded font-medium hover:bg-gray-100">
                Mua ngay
              </button>
            </div>
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Áo Thun Bé Trai Siêu Nhân
              </h3>
              <p className="text-blue-100 mb-4">Giảm giá 20% cho áo thun hè</p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded font-medium hover:bg-gray-100">
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

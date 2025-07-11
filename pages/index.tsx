import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Product } from '../types/index';
import { addToCart } from '../lib/slices/cartSlice';
import ProductCard from '../components/product/ProductCard';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Slider data
  const slides = [
    {
      id: 1,
      title: "iPhone 15 Series",
      subtitle: "Giảm giá lên đến 5 triệu đồng",
      description: "Khám phá thế giới công nghệ với những sản phẩm chất lượng cao",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop&crop=center",
      discount: "50%",
      buttonText: "Mua ngay",
      bgGradient: "from-teal-600 via-teal-500 to-teal-700"
    },
    {
      id: 2,
      title: "Samsung Galaxy S24",
      subtitle: "Tặng kèm phụ kiện trị giá 2 triệu",
      description: "Trải nghiệm công nghệ mới nhất với Samsung Galaxy",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop&crop=center",
      discount: "30%",
      buttonText: "Khám phá",
      bgGradient: "from-blue-600 via-blue-500 to-blue-700"
    },
    {
      id: 3,
      title: "MacBook Pro M3",
      subtitle: "Giảm giá 3 triệu + tặng AirPods",
      description: "Hiệu năng vượt trội với chip M3 mới nhất",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop&crop=center",
      discount: "25%",
      buttonText: "Xem chi tiết",
      bgGradient: "from-purple-600 via-purple-500 to-purple-700"
    }
  ];

  const startAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  const handleUserInteraction = () => {
    setIsAutoPlay(false);
    stopAutoPlay();
    
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlay(true);
      startAutoPlay();
    }, 10000);
  };

  useEffect(() => {
    if (isAutoPlay) {
      startAutoPlay();
    }

    return () => {
      stopAutoPlay();
    };
  }, [isAutoPlay, slides.length]);

  useEffect(() => {
    // Mock data - replace with API call
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'iPhone 15 Pro Max',
        price: 35000000,
        description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
        category: 'smartphone',
        inStock: true,
      },
      {
        id: '2',
        name: 'Samsung Galaxy S24 Ultra',
        price: 28000000,
        description: 'Samsung Galaxy S24 Ultra với S Pen tích hợp',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop',
        category: 'smartphone',
        inStock: true,
      },
      {
        id: '3',
        name: 'MacBook Pro M3',
        price: 45000000,
        description: 'MacBook Pro với chip M3, hiệu năng vượt trội',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
        category: 'laptop',
        inStock: true,
      },
      {
        id: '4',
        name: 'iPad Pro 12.9',
        price: 25000000,
        description: 'iPad Pro 12.9 inch với chip M2',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
        category: 'tablet',
        inStock: false,
      },
      {
        id: '5',
        name: 'AirPods Pro 2',
        price: 6500000,
        description: 'AirPods Pro 2 với Active Noise Cancellation',
        image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop',
        category: 'accessories',
        inStock: true,
      },
      {
        id: '6',
        name: 'Apple Watch Series 9',
        price: 12000000,
        description: 'Apple Watch Series 9 với tính năng sức khỏe nâng cao',
        image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop',
        category: 'accessories',
        inStock: true,
      },
      {
        id: '7',
        name: 'Dell XPS 13',
        price: 32000000,
        description: 'Dell XPS 13 với thiết kế InfinityEdge',
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop',
        category: 'laptop',
        inStock: true,
      },
      {
        id: '8',
        name: 'Samsung Galaxy Tab S9',
        price: 18000000,
        description: 'Samsung Galaxy Tab S9 với màn hình AMOLED',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
        category: 'tablet',
        inStock: true,
      },
    ];

    setTimeout(() => {
      setFeaturedProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    }));
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
              index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
          >
            <div className={`relative h-full bg-gradient-to-br ${slide.bgGradient} text-white overflow-hidden`}>
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
                      <img 
                        src={slide.image}
                        alt={slide.title}
                        className="rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-6 shadow-xl z-20">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">{slide.discount}</div>
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
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 z-30"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Auto-play indicator */}
        <div className="absolute top-4 right-4 z-30">
          <div className={`flex items-center space-x-2 px-3 py-2 bg-white bg-opacity-20 rounded-full text-white text-sm ${
            isAutoPlay ? 'opacity-100' : 'opacity-50'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isAutoPlay ? 'bg-white' : 'bg-white bg-opacity-50'}`}></div>
            <span>{isAutoPlay ? 'Tự động' : 'Tạm dừng'}</span>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
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
            <p className="text-gray-600">
              Chọn danh mục bạn quan tâm
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Smartphone', icon: '📱', count: 50, color: 'bg-blue-500' },
              { name: 'Laptop', icon: '💻', count: 30, color: 'bg-green-500' },
              { name: 'Tablet', icon: '📱', count: 20, color: 'bg-purple-500' },
              { name: 'Phụ kiện', icon: '🎧', count: 100, color: 'bg-orange-500' },
            ].map((category) => (
              <div
                key={category.name}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
              >
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
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

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Sản phẩm nổi bật
              </h2>
              <p className="text-gray-600">
                Những sản phẩm được yêu thích nhất
              </p>
            </div>
            <button className="text-teal-600 hover:text-teal-700 font-medium">
              Xem tất cả →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
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
              Giảm giá lên đến 50% cho các sản phẩm hot
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">iPhone 15 Series</h3>
              <p className="text-teal-100 mb-4">Giảm giá lên đến 5 triệu đồng</p>
              <button className="bg-white text-teal-600 px-6 py-2 rounded font-medium hover:bg-gray-100">
                Mua ngay
              </button>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Samsung Galaxy</h3>
              <p className="text-blue-100 mb-4">Tặng kèm phụ kiện trị giá 2 triệu</p>
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
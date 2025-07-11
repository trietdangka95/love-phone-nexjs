import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types/index';
import { useDispatch } from 'react-redux';
import { addToCart } from '../lib/slices/cartSlice';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Dell XPS 13',
    price: 32000000,
    discount: 10,
    description: 'Dell XPS 13 với thiết kế InfinityEdge',
    image: 'https://cdn.tgdd.vn/Products/Images/44/303226/dell-xps-13-9315-i5-1230u-16gb-512gb-win11-4k-600x600.jpg',
    category: 'Laptop',
    brand: 'Dell',
    inStock: true,
  },
  {
    id: '2',
    name: 'iPad Pro 12.9',
    price: 25000000,
    discount: 10,
    description: 'iPad Pro 12.9 inch với chip M2',
    image: 'https://cdn.tgdd.vn/Products/Images/522/303226/ipad-pro-12-9-m2-2022-600x600.jpg',
    category: 'Tablet',
    brand: 'Apple',
    inStock: false,
  },
  {
    id: '3',
    name: 'MacBook Pro M3',
    price: 45000000,
    discount: 10,
    description: 'MacBook Pro với chip M3, hiệu năng vượt trội',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    category: 'laptop',
    brand: 'Apple',
    inStock: true,
  },
  {
    id: '4',
    name: 'iPad Pro 12.9',
    price: 25000000,
    discount: 10,
    description: 'iPad Pro 12.9 inch với chip M2',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    category: 'tablet',
    brand: 'Apple',
    inStock: false,
  },
  {
    id: '5',
    name: 'AirPods Pro 2',
    price: 6500000,
    discount: 10,
    description: 'AirPods Pro 2 với Active Noise Cancellation',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop',
    category: 'accessories',
    brand: 'Apple',
    inStock: true,
  },
  {
    id: '6',
    name: 'Apple Watch Series 9',
    price: 12000000,
    discount: 10,
    description: 'Apple Watch Series 9 với tính năng sức khỏe nâng cao',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop',
    category: 'accessories',
    brand: 'Apple',
    inStock: true,
  },
  {
    id: '7',
    name: 'Dell XPS 13',
    price: 32000000,
    discount: 10,
    description: 'Dell XPS 13 với thiết kế InfinityEdge',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop',
    category: 'laptop',
    brand: 'Dell',
    inStock: true,
  },
  {
    id: '8',
    name: 'Samsung Galaxy Tab S9',
    price: 18000000,
    discount: 10,
    description: 'Samsung Galaxy Tab S9 với màn hình AMOLED',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    category: 'tablet',
    brand: 'Samsung',
    inStock: true,
  },
];

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState<'name' | 'price-low' | 'price-high'>('name');

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, []);

  // Get unique categories and brands
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(mockProducts.map(product => product.category)));
    return uniqueCategories;
  }, []);

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(mockProducts.map(product => product.brand)));
    return uniqueBrands;
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;
      const matchesStock = !showInStockOnly || product.inStock;
      
      return matchesSearch && matchesCategory && matchesBrand && matchesStock;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedBrand, showInStockOnly, sortOption]);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setShowInStockOnly(false);
    setSortOption('name');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tất cả sản phẩm</h1>
          <p className="text-lg text-gray-600">Khám phá các sản phẩm nổi bật của Love Phone</p>
        </div>

        {/* Enhanced Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Bộ lọc & Sắp xếp</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-sm hover:bg-teal-50 border-teal-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Xóa bộ lọc
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Loại sản phẩm
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-1.5 pr-10 border border-gray-300 rounded-xl shadow bg-white text-base font-medium leading-normal focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition appearance-none"
                  >
                    <option value="">Tất cả loại</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <svg
                    className="w-5 h-5 text-gray-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {/* Brand Filter */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Thương hiệu
                </label>
                <div className="relative">
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-4 py-1.5 pr-10 border border-gray-300 rounded-xl shadow bg-white text-base font-medium leading-normal focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition appearance-none"
                  >
                    <option value="">Tất cả thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                  <svg
                    className="w-5 h-5 text-gray-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {/* Sort Filter */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Sắp xếp theo
                </label>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as 'name' | 'price-low' | 'price-high')}
                    className="w-full px-4 py-1.5 pr-10 border border-gray-300 rounded-xl shadow bg-white text-base font-medium leading-normal focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition appearance-none"
                  >
                    <option value="name">Tên sản phẩm</option>
                    <option value="price-low">Giá tăng dần</option>
                    <option value="price-high">Giá giảm dần</option>
                  </select>
                  <svg
                    className="w-5 h-5 text-gray-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {/* Stock Filter */}
              <div className="flex items-end">
                <label className="flex items-center h-10">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={(e) => setShowInStockOnly(e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition"
                  />
                  <span className="ml-2 text-sm text-gray-700">Chỉ hiện còn hàng</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
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
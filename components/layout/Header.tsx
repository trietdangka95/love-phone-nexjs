import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../lib/store';

const Header: React.FC = () => {
  const router = useRouter();
  const cartState = useSelector((state: RootState) => state.cart);
  const cartItemCount = cartState?.items?.reduce((total: number, item: any) => total + (item.quantity || 0), 0) || 0;

  const isActive = (path: string) => {
    if (path === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Main header */}
        <div className="flex items-center h-16">
          {/* Left side - Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-teal-600">Love Phone</h1>
            </Link>
          </div>

          {/* Center - Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : 'text-gray-700 hover:text-teal-600'
              }`}
            >
              Trang chủ
            </Link>
            <Link
              href="/products"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/products') 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : 'text-gray-700 hover:text-teal-600'
              }`}
            >
              Sản phẩm
            </Link>
            <Link
              href="/about"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : 'text-gray-700 hover:text-teal-600'
              }`}
            >
              Giới thiệu
            </Link>
            <Link
              href="/contact"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/contact') 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : 'text-gray-700 hover:text-teal-600'
              }`}
            >
              Liên hệ
            </Link>
          </nav>

          {/* Right side - Search, Auth, Cart */}
          <div className="flex items-center space-x-4">
            {/* Search bar */}
            <div className="hidden md:flex">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white p-1 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Auth buttons */}
            <div className="flex space-x-3">
              <Link 
                href="/login" 
                className={`text-sm transition-colors ${
                  isActive('/login') 
                    ? 'text-teal-600 font-medium' 
                    : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                Đăng nhập
              </Link>
              <Link 
                href="/register" 
                className={`text-sm transition-colors ${
                  isActive('/register') 
                    ? 'text-teal-600 font-medium' 
                    : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                Đăng ký
              </Link>
            </div>

            {/* Cart */}
            <Link 
              href="/cart" 
              className={`relative p-2 transition-colors ${
                isActive('/cart') 
                  ? 'text-teal-600' 
                  : 'text-gray-700 hover:text-teal-600'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {cartItemCount}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
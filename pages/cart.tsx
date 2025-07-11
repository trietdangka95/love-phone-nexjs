import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { RootState } from '../lib/store';
import { removeFromCart, updateQuantity } from '../lib/slices/cartSlice';
import Button from '../components/ui/Button';
import Image from 'next/image';
import { CartItem } from '../types';

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
              />
            </svg>
            <h2 className="mt-2 text-lg font-medium text-gray-900">Giỏ hàng trống</h2>
            <p className="mt-1 text-sm text-gray-500">
              Bạn chưa có sản phẩm nào trong giỏ hàng.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          <div className="lg:col-span-7">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Giỏ hàng</h1>

            <div className="border-t border-gray-200 divide-y divide-gray-200">
              {items.map((item: CartItem) => (
                <div key={item.id} className="py-6 flex">
                  <div className="flex-shrink-0 w-24 h-24">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <label htmlFor={`quantity-${item.id}`} className="text-gray-700">
                          Số lượng:
                        </label>
                        <select
                          id={`quantity-${item.id}`}
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-blue-600 hover:text-blue-500"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <section className="mt-16 lg:mt-0 lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Tổng đơn hàng</h2>

              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Tạm tính</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatPrice(total)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Phí vận chuyển</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatPrice(30000)}</dd>
                </div>
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">Tổng cộng</dt>
                  <dd className="text-base font-medium text-gray-900">
                    {formatPrice(total + 30000)}
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <Button
                  onClick={() => {/* Navigate to checkout */}}
                  className="w-full"
                >
                  Tiến hành thanh toán
                </Button>
              </div>

              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <p>
                  hoặc{' '}
                  <Link
                    href="/"
                    className="text-blue-600 font-medium hover:text-blue-500"
                  >
                    Tiếp tục mua sắm
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 
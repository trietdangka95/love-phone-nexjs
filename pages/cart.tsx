import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { RootState } from "../lib/store";
import { removeFromCart, updateQuantity } from "../lib/slices/cartSlice";
import Button from "../components/ui/Button";
import Image from "next/image";
import { CartItem } from "../types";
import { getImageUrl } from "../ultil";

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleRemoveItem = (id: string, size?: string) => {
    dispatch(removeFromCart({ _id: id, size }));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ _id: id, quantity }));
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
            <h2 className="mt-2 text-lg font-medium text-gray-900">
              Giỏ hàng trống
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Bạn chưa có sản phẩm nào trong giỏ hàng.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("items", items);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          <div className="lg:col-span-7">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
              Giỏ hàng
            </h1>

            <div className="border-t border-gray-200 divide-y divide-gray-200">
              {/* Gom các item cùng tên sản phẩm */}
              {Object.entries(
                items.reduce(
                  (acc: Record<string, CartItem[]>, item: CartItem) => {
                    acc[item.name] = acc[item.name] || [];
                    acc[item.name].push(item);
                    return acc;
                  },
                  {}
                )
              ).map(([name, group]) => {
                const first = group[0];
                const totalQty = group.reduce((sum, i) => sum + i.quantity, 0);
                const totalPrice = group.reduce(
                  (sum, i) => sum + i.price * i.quantity,
                  0
                );
                return (
                  <div
                    key={name}
                    className="py-6 flex border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-shrink-0 w-24 h-24">
                      <Image
                        src={getImageUrl(first.image)}
                        alt={first.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-bold text-gray-900 mb-1">
                          <h3>{name}</h3>
                          <span className="text-pink-700 bg-pink-100 rounded px-2 py-1 text-xs font-semibold">
                            Tổng số lượng: {totalQty} | Tổng:{" "}
                            {formatPrice(totalPrice)}
                          </span>
                        </div>
                        {/* Hiển thị từng size */}
                        <div className="flex flex-wrap gap-4 mb-2">
                          {group.map((item) =>
                            item.size ? (
                              <div
                                key={item._id + item.size}
                                className="relative flex flex-col items-left gap-2 text-xs font-semibold px-2 py-1 rounded bg-pink-50 text-pink-700 border border-pink-200 w-fit"
                              >
                                {/* Nút xoá size */}
                                <button
                                  className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs text-red-500 hover:bg-red-100 z-10"
                                  title="Xoá size này khỏi giỏ hàng"
                                  onClick={() =>
                                    handleRemoveItem(item._id, item.size)
                                  }
                                >
                                  ×
                                </button>
                                <span>
                                  Size:{" "}
                                  {item.size === "1"
                                    ? "Size 1"
                                    : item.size === "2"
                                    ? "Size 2"
                                    : "Size 3"}
                                </span>
                                <span className="flex items-center gap-1">
                                  Số lượng:
                                  <select
                                    value={item.quantity}
                                    onChange={(e) =>
                                      handleUpdateQuantity(
                                        item._id,
                                        parseInt(e.target.value)
                                      )
                                    }
                                    className="border border-gray-300 rounded-md px-1 py-0.5 text-xs font-bold bg-white"
                                  >
                                    {[...Array(20)].map((_, i) => (
                                      <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                      </option>
                                    ))}
                                  </select>
                                </span>
                                <span>
                                  Tổng:{" "}
                                  <span className="font-bold">
                                    {formatPrice(item.price * item.quantity)}
                                  </span>
                                </span>
                              </div>
                            ) : null
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order summary */}
          <section className="mt-16 lg:mt-0 lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Tổng đơn hàng
              </h2>

              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Tạm tính</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {formatPrice(total)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Phí vận chuyển</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {formatPrice(30000)}
                  </dd>
                </div>
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">
                    Tổng cộng
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    {formatPrice(total + 30000)}
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <Button
                  onClick={() => {
                    /* Navigate to checkout */
                  }}
                  className="w-full"
                >
                  Tiến hành thanh toán
                </Button>
              </div>

              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <p>
                  hoặc{" "}
                  <Link
                    href="/"
                    className="text-primary-600 font-medium hover:text-primary-500"
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

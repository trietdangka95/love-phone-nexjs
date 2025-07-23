import React, { useState, useRef, useEffect } from "react";
import { Product, SizeStock } from "../../types/index";
import Button from "../ui/Button";
import { badges, text, combineClasses } from "../../lib/tailwindClasses";
import { getImageUrl } from "../../ultil";
import PreviewImage from "../PreviewImage";

interface SizeSelection {
  size: string;
  quantity: number;
}
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selections: SizeSelection[]) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  // Lưu số lượng chọn cho từng size
  const [sizeSelections, setSizeSelections] = useState<SizeSelection[]>([]);
  // Thêm state selectedSize ở đầu component
  const [selectedSize, setSelectedSize] = useState<string>("");
  const sizeBoxRef = useRef<HTMLDivElement>(null);

  // Đóng input khi click ra ngoài vùng chọn size
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sizeBoxRef.current &&
        !sizeBoxRef.current.contains(event.target as Node)
      ) {
        setSelectedSize("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const originalPrice = product.discount
    ? Math.floor(product.price / (1 - product.discount / 100))
    : undefined;

  // Tổng tồn kho của tất cả size
  const totalStock = Array.isArray(product.sizes)
    ? product.sizes.reduce((sum, s) => sum + (s.inStock || 0), 0)
    : 0;

  // Đã thay thế kiểm tra tồn kho bằng totalStock ở trên
  const handleAddToCart = () => {
    if (totalStock <= 0) return;
    // Lấy các size có quantity > 0
    const selected = sizeSelections.filter((s) => s.quantity > 0);
    if (
      Array.isArray(product.sizes) &&
      product.sizes.length > 0 &&
      selected.length === 0
    ) {
      alert("Vui lòng chọn size và số lượng!");
      return;
    }
    setIsAddingToCart(true);
    onAddToCart(product, selected);
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 2000);
  };

  console.log("product", product);

  return (
    <div
      className={combineClasses(
        "flex flex-col h-full rounded-2xl shadow-md bg-white overflow-hidden border-2 border-gray-200 hover:border-teal-500 transition"
      )}
    >
      <div className="relative">
        {product.discount && Number(product.discount) ? (
          <span className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded z-10">
            -{product.discount}%
          </span>
        ) : (
          <> </>
        )}
        {/* Không còn dùng product.inStock, đã kiểm tra tổng tồn kho ở trên */}
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-48 object-cover object-center bg-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
          }}
          onClick={() => setModalImage(getImageUrl(product.image))}
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3
          className={combineClasses(text.h6, "mb-2 line-clamp-2 leading-tight")}
        >
          {product.name}
        </h3>

        <div className="flex items-center space-x-2 mb-2">
          <span className={combineClasses(text.h5, "text-primary-600")}>
            {formatPrice(product.price)}
          </span>
          {product.discount && originalPrice ? (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(originalPrice)}
            </span>
          ) : (
            <> </>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col gap-2" ref={sizeBoxRef}>
            {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
              product.sizes.map((s: SizeStock) => {
                const selection = sizeSelections.find(
                  (sel) => sel.size === s.size
                ) || { size: s.size, quantity: 0 };
                const [activeSize, setActiveSize] = [
                  selectedSize,
                  setSelectedSize,
                ];
                // selectedSize là state lưu size đang active
                return (
                  <div
                    key={s.size}
                    className={
                      "relative flex flex-col items-start gap-1 text-xs font-semibold px-2 py-1 rounded bg-pink-50 text-pink-700 border border-pink-200 w-fit min-w-[120px] cursor-pointer transition " +
                      (activeSize === s.size
                        ? "ring-2 ring-pink-400"
                        : "hover:bg-pink-100")
                    }
                    onClick={() => setActiveSize(s.size)}
                  >
                    <span className="flex items-center">
                      {s.size === "1"
                        ? "Size 1 (5-7 tháng)"
                        : s.size === "2"
                        ? "Size 2 (7-12 tháng)"
                        : "Size 3 (>12 tháng)"}
                      <span className="ml-1 text-gray-500">({s.inStock})</span>
                      {selection.quantity > 0 && (
                        <span className="ml-2 text-green-600 text-base">✓</span>
                      )}
                    </span>
                    {activeSize === s.size && (
                      <div className="flex items-center gap-1 mt-1">
                        <span>Số lượng:</span>
                        <select
                          value={selection.quantity}
                          disabled={s.inStock <= 0}
                          className="border border-gray-300 rounded px-3 text-base bg-white focus:outline-pink-400"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setSizeSelections((prev) => {
                              const other = prev.filter(
                                (sel) => sel.size !== s.size
                              );
                              return val > 0
                                ? [...other, { size: s.size, quantity: val }]
                                : other;
                            });
                          }}
                        >
                          {Array.from({ length: s.inStock + 1 }, (_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <span className={combineClasses(badges.secondary, "capitalize")}>
                Không có size
              </span>
            )}
          </div>
        </div>

        <p className={combineClasses(text.small, "mb-4 line-clamp-2 flex-1")}>
          {product.description}
        </p>

        <Button
          onClick={handleAddToCart}
          disabled={totalStock <= 0 || isAddingToCart}
          className="w-full mt-auto text-sm py-2"
          variant={
            isAddingToCart ? "teal" : totalStock > 0 ? "primary" : "secondary"
          }
        >
          {isAddingToCart
            ? "Đã thêm ✓"
            : totalStock > 0
            ? "Thêm vào giỏ"
            : "Hết hàng"}
        </Button>
      </div>
      {modalImage && (
        <PreviewImage src={modalImage} onClose={() => setModalImage(null)} />
      )}
    </div>
  );
};

export default ProductCard;

import React, { useState, useRef, useEffect } from "react";
import { Product } from "../../types/index";
import Button from "../ui/Button";
import { text, combineClasses } from "../../lib/tailwindClasses";
import { getImageUrl } from "../../ultil";
import PreviewImage from "../PreviewImage";
import Image from "next/image";
import ProductSizeSelector from "./ProductSizeSelector";

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
    ? Math.floor(product.price - (product.price * product.discount) / 100)
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
      <div className="relative w-full h-48">
        {product.discount && Number(product.discount) ? (
          <span className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded z-10">
            -{product.discount}%
          </span>
        ) : (
          <> </>
        )}
        <Image
          src={getImageUrl(product.image)}
          alt={product.name}
          fill
          className="object-cover object-center bg-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer rounded-t-2xl"
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
          {product.discount && originalPrice ? (
            <span className="text-xl text-primary-600">
              {formatPrice(originalPrice)}
            </span>
          ) : (
            <> </>
          )}

          <span
            className={combineClasses(
              text.h5,
              `text-sm text-gray-500 ${product.discount ? "line-through" : ""}`
            )}
          >
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <ProductSizeSelector
            sizes={product.sizes}
            sizeSelections={sizeSelections}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            setSizeSelections={setSizeSelections}
            sizeBoxRef={sizeBoxRef as React.RefObject<HTMLDivElement>}
          />
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

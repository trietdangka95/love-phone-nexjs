import React from "react";
import { SizeStock } from "../../types/index";

interface SizeSelection {
  size: string;
  quantity: number;
}

interface ProductSizeSelectorProps {
  sizes?: SizeStock[];
  sizeSelections: SizeSelection[];
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  setSizeSelections: React.Dispatch<React.SetStateAction<SizeSelection[]>>;
  sizeBoxRef: React.RefObject<HTMLDivElement>;
}

const ProductSizeSelector: React.FC<ProductSizeSelectorProps> = ({
  sizes,
  sizeSelections,
  selectedSize,
  setSelectedSize,
  setSizeSelections,
  sizeBoxRef,
}) => {
  if (!sizes || sizes.length === 0) {
    return (
      <span className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs">
        Không có size
      </span>
    );
  }
  return (
    <div className="flex flex-col gap-2" ref={sizeBoxRef}>
      {sizes.map((s) => {
        const selection = sizeSelections.find((sel) => sel.size === s.size) || {
          size: s.size,
          quantity: 0,
        };
        const activeSize = selectedSize;
        return (
          <div
            key={s.size}
            className={
              "relative flex flex-col items-start gap-1 text-xs font-semibold px-2 py-1 rounded bg-pink-50 text-pink-700 border border-pink-200 w-fit min-w-[120px] cursor-pointer transition " +
              (activeSize === s.size
                ? "ring-2 ring-pink-400"
                : "hover:bg-pink-100")
            }
            onClick={() => setSelectedSize(s.size)}
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
                      const other = prev.filter((sel) => sel.size !== s.size);
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
      })}
    </div>
  );
};

export default ProductSizeSelector;

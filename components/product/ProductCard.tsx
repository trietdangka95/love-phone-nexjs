import React, { useState } from 'react';
import { Product } from '../../types/index';
import Button from '../ui/Button';
import { cards, badges, text, combineClasses } from '../../lib/tailwindClasses';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const originalPrice = product.discount
    ? Math.floor(product.price / (1 - product.discount / 100))
    : undefined;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    
    setIsAddingToCart(true);
    onAddToCart(product);
    
    // Show success state for 2 seconds
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 2000);
  };

  return (
    <div
      className={combineClasses(
        'flex flex-col h-full rounded-2xl shadow-md bg-white overflow-hidden border-2 border-gray-200 hover:border-teal-500 transition'
      )}
    >
      <div className="relative">
        {product.discount && (
          <span className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded z-10">
            -{product.discount}%
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
            Hết hàng
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover object-center bg-gray-100"
          onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}
        />
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className={combineClasses(text.h6, 'mb-2 line-clamp-2 leading-tight')}>
          {product.name}
        </h3>
        
        <div className="flex items-center space-x-2 mb-2">
          <span className={combineClasses(text.h5, 'text-primary-600')}>
            {formatPrice(product.price)}
          </span>
          {product.discount && originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className={combineClasses(badges.secondary, 'capitalize')}>
            {product.category}
          </span>
          <div className="flex items-center text-xs text-warning-600">
            <span>★★★★★</span>
            <span className="ml-1">(12)</span>
          </div>
        </div>
        
        <p className={combineClasses(text.small, 'mb-4 line-clamp-2 flex-1')}>
          {product.description}
        </p>
        
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAddingToCart}
          className="w-full mt-auto text-sm py-2"
          variant={isAddingToCart ? 'teal' : (product.inStock ? 'primary' : 'secondary')}
        >
          {isAddingToCart ? 'Đã thêm ✓' : (product.inStock ? 'Thêm vào giỏ' : 'Hết hàng')}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard; 
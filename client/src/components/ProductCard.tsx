import { useState } from 'react';
import { Link } from 'wouter';
import { Heart, Star, ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addItem(product);
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsAdding(false);
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="product-card bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <img 
            src={`data:image/jpeg;base64,${product.imageBase64}`}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            data-testid={`img-product-${product.id}`}
          />
        </Link>
        
        <div className="absolute top-3 right-3">
          <Button
            variant="secondary"
            size="sm"
            className="bg-card/80 hover:bg-accent text-card-foreground hover:text-accent-foreground p-2 rounded-full"
            data-testid={`button-favorite-${product.id}`}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        
        {product.featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary text-primary-foreground">
              Best Seller
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-2">
          <Badge variant="secondary" className="text-xs bg-accent/10 text-accent">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Badge>
        </div>
        
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors cursor-pointer"
              data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2"
           data-testid={`text-product-description-${product.id}`}>
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
              {formatPrice(product.price)}
            </span>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className={`transition-all duration-300 ${
              showSuccess 
                ? 'bg-green-600 hover:bg-green-600' 
                : product.stock === 0 
                ? 'bg-muted text-muted-foreground' 
                : ''
            }`}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            {showSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added!
              </>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-accent mr-1 fill-current" />
            <span data-testid={`text-product-rating-${product.id}`}>
              {product.rating || 4.8} ({product.reviewCount || 0} reviews)
            </span>
          </div>
          <span className={`${product.stock < 5 ? 'text-destructive' : ''}`} 
                data-testid={`text-product-stock-${product.id}`}>
            {product.stock} left
          </span>
        </div>
      </div>
    </div>
  );
};

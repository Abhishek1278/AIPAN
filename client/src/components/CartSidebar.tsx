import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';

export const CartSidebar = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotalPrice, 
    isOpen, 
    closeCart 
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
        data-testid="cart-overlay"
      />
      
      {/* Cart Sidebar */}
      <div className="fixed top-0 right-0 h-full w-96 bg-card border-l border-border z-50 shadow-xl transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold" data-testid="text-cart-title">
              Shopping Cart ({items.length})
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeCart}
              data-testid="button-close-cart"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-4">
                  Add some beautiful Aipan crafts to get started
                </p>
                <Button onClick={closeCart} data-testid="button-continue-shopping-empty">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.productId} 
                    className="flex items-center space-x-4 bg-secondary p-4 rounded-lg"
                    data-testid={`cart-item-${item.productId}`}
                  >
                    <img 
                      src={`data:image/jpeg;base64,${item.imageBase64}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      data-testid={`img-cart-item-${item.productId}`}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate" data-testid={`text-cart-item-name-${item.productId}`}>
                        {item.name}
                      </h3>
                      <p className="text-primary font-semibold" data-testid={`text-cart-item-price-${item.productId}`}>
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        data-testid={`button-decrease-${item.productId}`}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      
                      <span className="w-8 text-center font-semibold" data-testid={`text-quantity-${item.productId}`}>
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        data-testid={`button-increase-${item.productId}`}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/80 p-2"
                      onClick={() => removeItem(item.productId)}
                      data-testid={`button-remove-${item.productId}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-6 space-y-4">
              <Separator />
              
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary" data-testid="text-cart-total">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
              
              <Link href="/checkout">
                <Button 
                  className="w-full py-3 font-semibold"
                  onClick={closeCart}
                  data-testid="button-checkout"
                >
                  Proceed to Checkout
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full py-2"
                onClick={closeCart}
                data-testid="button-continue-shopping"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

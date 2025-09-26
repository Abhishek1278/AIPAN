import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { NavHeader } from '@/components/NavHeader';
import { Footer } from '@/components/Footer';
import { CartSidebar } from '@/components/CartSidebar';
import { AuthModal } from '@/components/AuthModal';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { data: product, isLoading } = useProduct(id!);
  const { addItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAdding(true);
    addItem(product);
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsAdding(false);
    }, 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader 
          onShowAuth={() => setShowAuthModal(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-24 bg-muted rounded"></div>
                <div className="h-12 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader 
          onShowAuth={() => setShowAuthModal(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader 
        onShowAuth={() => setShowAuthModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors" data-testid="link-home">
            Home
          </Link>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-foreground truncate">{product.name}</span>
        </div>

        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
              <img 
                src={`data:image/jpeg;base64,${product.imageBase64}`}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="img-product-detail"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3 bg-accent/10 text-accent">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Badge>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2" data-testid="text-product-title">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-accent fill-current mr-1" />
                  <span className="font-semibold" data-testid="text-product-rating">
                    {product.rating || 4.8}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleShare} data-testid="button-share">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <div className="text-3xl font-bold text-primary mb-2" data-testid="text-product-price">
                {formatPrice(product.price)}
              </div>
              <p className="text-muted-foreground">
                Stock: <span className={`font-semibold ${product.stock < 5 ? 'text-destructive' : 'text-green-600'}`}>
                  {product.stock} available
                </span>
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed" data-testid="text-product-description">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Product Details</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Handcrafted by skilled artisans</li>
                <li>• Traditional Aipan patterns</li>
                <li>• Authentic Uttarakhand heritage</li>
                <li>• Premium quality materials</li>
              </ul>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
                className={`flex-1 py-3 text-lg transition-all duration-300 ${
                  showSuccess 
                    ? 'bg-green-600 hover:bg-green-600' 
                    : product.stock === 0 
                    ? 'bg-muted text-muted-foreground' 
                    : ''
                }`}
                data-testid="button-add-to-cart-detail"
              >
                {showSuccess ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added to Cart!
                  </>
                ) : product.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              
              <Button variant="outline" className="py-3" data-testid="button-add-to-wishlist">
                <Heart className="w-5 h-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="bg-secondary p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Shipping Information</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Free shipping on orders over ₹1000</li>
                <li>• Standard delivery: 5-7 business days</li>
                <li>• Express delivery: 2-3 business days</li>
                <li>• Cash on delivery available</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <CartSidebar />
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

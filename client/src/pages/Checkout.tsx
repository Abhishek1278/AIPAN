import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { ArrowLeft, CreditCard, Truck, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { NavHeader } from '@/components/NavHeader';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import type { InsertOrder } from '@/types';

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const createOrderMutation = useCreateOrder();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    paymentMethod: 'cod',
  });

  // Redirect if cart is empty and order not complete
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      setLocation('/');
    }
  }, [items.length, orderComplete, setLocation]);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerEmail: user.email,
        customerName: user.name,
      }));
    }
  }, [user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 1000 ? 0 : 100;
  const total = subtotal + shipping;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['customerName', 'customerEmail', 'shippingAddress'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]?.trim());
    
    if (missing.length > 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customerEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsProcessing(true);

    try {
      const orderData: InsertOrder = {
        userId: user.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageBase64: item.imageBase64,
        })),
        totalAmount: total,
        status: 'pending',
      };

      const newOrderId = await createOrderMutation.mutateAsync(orderData);
      setOrderId(newOrderId);
      setOrderComplete(true);
      clearCart();
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${newOrderId.slice(0, 8)} has been placed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader 
          onShowAuth={() => setShowAuthModal(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4" data-testid="text-order-success">
              Order Placed Successfully!
            </h1>
            
            <p className="text-muted-foreground mb-2">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            
            <p className="text-sm text-muted-foreground mb-8">
              Order ID: <span className="font-mono font-semibold" data-testid="text-order-id">
                #{orderId.slice(0, 8)}
              </span>
            </p>

            <div className="bg-secondary p-6 rounded-lg mb-8">
              <h3 className="font-semibold mb-4">What's Next?</h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li>• You'll receive an email confirmation shortly</li>
                <li>• Your order will be processed within 1-2 business days</li>
                <li>• We'll send you tracking information once shipped</li>
                <li>• Expected delivery: 5-7 business days</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button data-testid="button-continue-shopping">
                  Continue Shopping
                </Button>
              </Link>
              <Button variant="outline" data-testid="button-track-order">
                Track Your Order
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
        
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
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
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Checkout</h1>
              <p className="text-muted-foreground">Complete your order for traditional Aipan crafts</p>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                      1
                    </div>
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        required
                        data-testid="input-customer-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Email Address *</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                        required
                        data-testid="input-customer-email"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      data-testid="input-customer-phone"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                      2
                    </div>
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="shippingAddress">Shipping Address *</Label>
                    <Textarea
                      id="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                      placeholder="Enter your complete address including city, state, and PIN code"
                      rows={4}
                      required
                      data-testid="textarea-shipping-address"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                      3
                    </div>
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                    data-testid="radio-payment-method"
                  >
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">Cash on Delivery</div>
                            <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
                          </div>
                          <Truck className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg opacity-50">
                      <RadioGroupItem value="card" id="card" disabled />
                      <Label htmlFor="card" className="flex-1 cursor-not-allowed">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">Credit/Debit Card</div>
                            <div className="text-sm text-muted-foreground">Coming soon</div>
                          </div>
                          <CreditCard className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <div className="bg-secondary p-4 rounded-lg">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 mr-2 text-green-600" />
                  Your order is secured with SSL encryption
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-3" data-testid={`checkout-item-${item.productId}`}>
                      <img 
                        src={`data:image/jpeg;base64,${item.imageBase64}`}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span data-testid="text-subtotal">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''} data-testid="text-shipping">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-600">Free shipping on orders over ₹1000!</p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span data-testid="text-total">{formatPrice(total)}</span>
                </div>

                <Button 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || items.length === 0}
                  className="w-full py-3 text-lg font-semibold"
                  data-testid="button-place-order"
                >
                  {isProcessing ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
                </Button>

                {!user && (
                  <p className="text-xs text-muted-foreground text-center">
                    You need to sign in to complete your order
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

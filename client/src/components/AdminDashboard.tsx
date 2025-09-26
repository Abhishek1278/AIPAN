import { useState } from 'react';
import { Plus, Package, Clock, TrendingUp, Upload, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts, useAddProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import type { InsertProduct, Category, OrderStatus } from '@/types';

export const AdminDashboard = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState<InsertProduct>({
    name: '',
    description: '',
    price: 0,
    category: 'thaalis',
    imageBase64: '',
    stock: 0,
  });

  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders();
  const addProductMutation = useAddProduct();
  const deleteProductMutation = useDeleteProduct();
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const { toast } = useToast();

  const stats = {
    totalProducts: products.length,
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    revenue: orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.totalAmount, 0),
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        setProductForm(prev => ({ ...prev, imageBase64: base64Data }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.imageBase64) {
      toast({
        title: "Error",
        description: "Please upload a product image",
        variant: "destructive",
      });
      return;
    }

    try {
      await addProductMutation.mutateAsync(productForm);
      toast({
        title: "Success",
        description: "Product added successfully!",
      });
      setShowAddProduct(false);
      setProductForm({
        name: '',
        description: '',
        price: 0,
        category: 'thaalis',
        imageBase64: '',
        stock: 0,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductMutation.mutateAsync(productId);
        toast({
          title: "Success",
          description: "Product deleted successfully!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatusMutation.mutateAsync({ orderId, status });
      toast({
        title: "Success",
        description: "Order status updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="bg-muted py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage products, orders, and view analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Products</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-products">
                    {stats.totalProducts}
                  </p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Pending Orders</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-pending-orders">
                    {stats.pendingOrders}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-revenue">
                    {formatPrice(stats.revenue)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product Management</CardTitle>
                <Button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  data-testid="button-toggle-add-product"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddProduct && (
                <form onSubmit={handleAddProduct} className="space-y-4 mb-6 p-4 bg-secondary rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        value={productForm.name}
                        onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                        data-testid="input-product-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="productPrice">Price (₹)</Label>
                      <Input
                        id="productPrice"
                        type="number"
                        min="0"
                        value={productForm.price || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                        required
                        data-testid="input-product-price"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productCategory">Category</Label>
                      <Select
                        value={productForm.category}
                        onValueChange={(value: Category) => setProductForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger data-testid="select-product-category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="thaalis">Thaalis</SelectItem>
                          <SelectItem value="loataas">Loataas</SelectItem>
                          <SelectItem value="diyaas">Diyaas</SelectItem>
                          <SelectItem value="crafts">Other Crafts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="productStock">Stock</Label>
                      <Input
                        id="productStock"
                        type="number"
                        min="0"
                        value={productForm.stock || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, stock: Number(e.target.value) }))}
                        required
                        data-testid="input-product-stock"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="productDescription">Description</Label>
                    <Textarea
                      id="productDescription"
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      required
                      data-testid="textarea-product-description"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="productImage">Product Image</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground mb-2">Drop image here or click to browse</p>
                      <Input
                        id="productImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        data-testid="input-product-image"
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('productImage')?.click()}
                      >
                        Choose File
                      </Button>
                      {productForm.imageBase64 && (
                        <p className="text-sm text-green-600 mt-2">Image uploaded successfully</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      disabled={addProductMutation.isPending}
                      data-testid="button-submit-product"
                    >
                      {addProductMutation.isPending ? 'Adding...' : 'Add Product'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowAddProduct(false)}
                      data-testid="button-cancel-product"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {/* Products List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center space-x-4 p-3 border border-border rounded-lg"
                    data-testid={`product-item-${product.id}`}
                  >
                    <img 
                      src={`data:image/jpeg;base64,${product.imageBase64}`}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-destructive hover:text-destructive/80"
                      data-testid={`button-delete-product-${product.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Management */}
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="border border-border rounded-lg p-4"
                    data-testid={`order-item-${order.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">#{order.id.slice(0, 8)}</span>
                      <Select
                        value={order.status}
                        onValueChange={(status: OrderStatus) => handleUpdateOrderStatus(order.id, status)}
                      >
                        <SelectTrigger className="w-32" data-testid={`select-order-status-${order.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-sm text-muted-foreground">Customer: {order.customerName}</p>
                    <p className="text-sm text-muted-foreground">Items: {order.items.length} products</p>
                    <p className="font-semibold text-primary">{formatPrice(order.totalAmount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                
                {orders.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No orders yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

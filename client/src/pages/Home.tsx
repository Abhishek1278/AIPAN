import { useState } from 'react';
import { NavHeader } from '@/components/NavHeader';
import { HeroSection } from '@/components/HeroSection';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductGrid } from '@/components/ProductGrid';
import { FeaturedArtisans } from '@/components/FeaturedArtisans';
import { Footer } from '@/components/Footer';
import { CartSidebar } from '@/components/CartSidebar';
import { AuthModal } from '@/components/AuthModal';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import type { Category } from '@/types';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { isAdmin } = useAuth();
  const { data: products = [] } = useProducts();

  const filteredProductsCount = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    return true;
  }).length;

  return (
    <div className="min-h-screen bg-background">
      <NavHeader 
        onShowAuth={() => setShowAuthModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main>
        <HeroSection />
        
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          productsCount={filteredProductsCount}
        />
        
        <ProductGrid
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          searchQuery={searchQuery}
        />
        
        <FeaturedArtisans />
        
        {isAdmin && <AdminDashboard />}
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

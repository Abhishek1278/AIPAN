import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ProductCard } from './ProductCard';
import { useProducts, useProductsByCategory } from '@/hooks/useProducts';
import type { Category, Product } from '@/types';

interface ProductGridProps {
  selectedCategory: Category | 'all';
  sortBy: string;
  searchQuery: string;
}

export const ProductGrid = ({ selectedCategory, sortBy, searchQuery }: ProductGridProps) => {
  const [visibleCount, setVisibleCount] = useState(12);
  
  const { data: allProducts = [], isLoading: loadingAll } = useProducts();
  const { data: categoryProducts = [], isLoading: loadingCategory } = useProductsByCategory(
    selectedCategory as Category
  );

  const isLoading = selectedCategory === 'all' ? loadingAll : loadingCategory;
  const products = selectedCategory === 'all' ? allProducts : categoryProducts;

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return sorted;
  }, [products, searchQuery, sortBy]);

  const visibleProducts = filteredAndSortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedProducts.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-card rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-muted"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-6 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-muted rounded w-1/4"></div>
                    <div className="h-10 bg-muted rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (filteredAndSortedProducts.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No Products Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchQuery.trim() 
                ? `No products match your search for "${searchQuery}".`
                : selectedCategory === 'all'
                ? 'No products available at the moment.'
                : `No products found in the ${selectedCategory} category.`
              }
            </p>
            {searchQuery.trim() && (
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search terms or browse all categories.
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-12">
            <Button
              variant="secondary"
              onClick={loadMore}
              className="px-8 py-3"
              data-testid="button-load-more"
            >
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

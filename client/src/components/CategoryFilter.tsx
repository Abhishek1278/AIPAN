import { Circle, Wine, Flame, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Category } from '@/types';

interface CategoryFilterProps {
  selectedCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  productsCount: number;
}

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  productsCount,
}: CategoryFilterProps) => {
  const categories = [
    {
      id: 'thaalis' as Category,
      name: 'Thaalis',
      description: 'Decorative Plates',
      icon: Circle,
    },
    {
      id: 'loataas' as Category,
      name: 'Loataas',
      description: 'Water Vessels',
      icon: Wine,
    },
    {
      id: 'diyaas' as Category,
      name: 'Diyaas',
      description: 'Oil Lamps',
      icon: Flame,
    },
    {
      id: 'crafts' as Category,
      name: 'Other Crafts',
      description: 'Miscellaneous',
      icon: Palette,
    },
  ];

  return (
    <section id="categories" className="bg-secondary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
            Explore Our Collections
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each category represents centuries of traditional craftsmanship passed down through generations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <Button
                key={category.id}
                variant={isSelected ? 'default' : 'secondary'}
                className={`h-auto p-6 flex flex-col items-center space-y-4 transition-all duration-300 ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-primary hover:text-primary-foreground'
                }`}
                onClick={() => onCategoryChange(category.id)}
                data-testid={`button-category-${category.id}`}
              >
                <Icon className="w-8 h-8" />
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                  <p className="text-sm opacity-80">{category.description}</p>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {selectedCategory !== 'all' && (
              <Button
                variant="outline"
                onClick={() => onCategoryChange('all')}
                data-testid="button-clear-filter"
              >
                Show All Categories
              </Button>
            )}
            
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground text-sm">Sort by:</span>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-48" data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="text-muted-foreground" data-testid="text-products-count">
            <span className="font-semibold">{productsCount}</span> products found
          </div>
        </div>
      </div>
    </section>
  );
};

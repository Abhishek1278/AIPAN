import { useState } from 'react';
import { Link } from 'wouter';
import { Search, User, ShoppingCart, Menu, X, Palette } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavHeaderProps {
  onShowAuth: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const NavHeader = ({ onShowAuth, searchQuery, onSearchChange }: NavHeaderProps) => {
  const { user, signOut } = useAuth();
  const { getTotalItems, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = getTotalItems();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '#categories', label: 'Categories' },
    { href: '#about', label: 'About' },
  ];

  return (
    <header className="bg-card border-b border-border geometric-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-4">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl text-primary">Aipan Arts</h1>
              <p className="text-xs text-muted-foreground">Traditional Crafts</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search traditional crafts..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 bg-secondary"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors"
                  data-testid={`link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{user.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  data-testid="button-signout"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowAuth}
                data-testid="button-signin"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCart}
              className="relative"
              data-testid="button-cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Cart Button - Mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCart}
              className="relative"
              data-testid="button-cart-mobile"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                  {totalItems}
                </span>
              )}
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" data-testid="button-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search traditional crafts..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="w-full pl-10 bg-secondary"
                      data-testid="input-search-mobile"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-foreground hover:text-primary transition-colors text-lg"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid={`link-${link.label.toLowerCase()}-mobile`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Auth */}
                  {user ? (
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm text-muted-foreground">Signed in as {user.name}</span>
                      <Button
                        variant="outline"
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        data-testid="button-signout-mobile"
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        onShowAuth();
                        setMobileMenuOpen(false);
                      }}
                      data-testid="button-signin-mobile"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

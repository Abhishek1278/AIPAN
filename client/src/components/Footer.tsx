import { Palette, Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'wouter';

export const Footer = () => {
  const quickLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/artisans', label: 'Our Artisans' },
    { href: '/shipping', label: 'Shipping Info' },
    { href: '/returns', label: 'Return Policy' },
    { href: '/contact', label: 'Contact' },
  ];

  const categories = [
    { href: '/?category=thaalis', label: 'Thaalis' },
    { href: '/?category=loataas', label: 'Loataas' },
    { href: '/?category=diyaas', label: 'Diyaas' },
    { href: '/?category=crafts', label: 'Wall Art' },
    { href: '/', label: 'All Crafts' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-primary">Aipan Arts</h3>
                <p className="text-xs text-background/80">Traditional Crafts</p>
              </div>
            </div>
            <p className="text-background/80 text-sm">
              Preserving the rich heritage of Uttarakhand through authentic Aipan art and traditional crafts.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={social.label}
                    href={social.href} 
                    className="text-background/60 hover:text-primary transition-colors"
                    aria-label={social.label}
                    data-testid={`link-social-${social.label.toLowerCase()}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-background/80">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="hover:text-primary transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-2 text-background/80">
              {categories.map((category) => (
                <li key={category.href}>
                  <Link 
                    href={category.href} 
                    className="hover:text-primary transition-colors"
                    data-testid={`link-footer-category-${category.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3 text-background/80">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm">Almora, Uttarakhand, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a 
                  href="tel:+911234567890" 
                  className="text-sm hover:text-primary transition-colors"
                  data-testid="link-phone"
                >
                  +91 12345 67890
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a 
                  href="mailto:info@aipanarts.com" 
                  className="text-sm hover:text-primary transition-colors"
                  data-testid="link-email"
                >
                  info@aipanarts.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 text-center">
          <p className="text-background/60 text-sm">
            © 2024 Aipan Arts. All rights reserved. | Made with ❤️ for preserving traditional crafts
          </p>
        </div>
      </div>
    </footer>
  );
};

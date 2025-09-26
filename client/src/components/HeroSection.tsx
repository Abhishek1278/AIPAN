import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  const handleExploreCollections = () => {
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-primary to-red-600 text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 aipan-pattern"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="hero-text font-serif font-bold text-5xl mb-4 leading-tight">
                Authentic Aipan 
                <span className="text-accent"> Traditional Arts</span>
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Discover handcrafted Thaalis, Loataas, Diyaas, and traditional crafts from the heart of Uttarakhand. 
                Each piece tells a story of cultural heritage and artistic excellence.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-accent text-accent-foreground px-8 py-3 hover:bg-accent/90"
                onClick={handleExploreCollections}
                data-testid="button-explore-collections"
              >
                Explore Collections
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-primary-foreground text-primary-foreground px-8 py-3 hover:bg-primary-foreground hover:text-primary"
                data-testid="button-watch-stories"
              >
                Watch Artisan Stories
              </Button>
            </div>

            {/* Cultural Highlights */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold" data-testid="text-products-count">500+</div>
                <div className="text-sm text-primary-foreground/80">Handcrafted Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" data-testid="text-artisans-count">50+</div>
                <div className="text-sm text-primary-foreground/80">Master Artisans</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" data-testid="text-customers-count">1000+</div>
                <div className="text-sm text-primary-foreground/80">Happy Customers</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://pixabay.com/get/g8f34992a615dbe39132cdb8ec2ebd8560d0dd924ea0ef5a0291f4a0a9506833c223c4b1b56f61cc1d3556c78736b15e70859b59086a5fb564d5fedde435dddd3_1280.jpg" 
                alt="Traditional Aipan decorated thali with intricate red and white patterns" 
                className="w-full h-96 object-cover"
                data-testid="img-hero-thali"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-card text-card-foreground p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="text-accent text-xl">⭐</div>
                <div>
                  <div className="font-semibold" data-testid="text-rating">4.9/5 Rating</div>
                  <div className="text-sm text-muted-foreground">From 200+ Reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

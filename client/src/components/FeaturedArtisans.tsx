import { Star } from 'lucide-react';

export const FeaturedArtisans = () => {
  const artisans = [
    {
      id: 1,
      name: 'Meera Devi',
      specialty: 'Master Aipan Artist',
      experience: '30+ years experience',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    },
    {
      id: 2,
      name: 'Ramesh Pandey',
      specialty: 'Brass Craft Specialist',
      experience: '25+ years experience',
      image: 'https://pixabay.com/get/g4a591f80296d3422209891b613b54dcc8b1ad50b4b281df08bacc92ff36cf4687b74c4b4059bb871e2544dafed6da3f04ebad7d58a4fd33fbbec96e5e7da91a5_1280.jpg',
    },
    {
      id: 3,
      name: 'Sunita Bisht',
      specialty: 'Clay & Ceramic Artist',
      experience: '20+ years experience',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    },
  ];

  return (
    <section className="bg-secondary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
            Meet Our Master Artisans
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every piece is crafted by skilled artisans who have preserved these traditional techniques for generations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {artisans.map((artisan) => (
            <div 
              key={artisan.id} 
              className="bg-card rounded-xl p-6 text-center shadow-sm"
              data-testid={`artisan-card-${artisan.id}`}
            >
              <img 
                src={artisan.image}
                alt={`Master artisan ${artisan.name}`}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                data-testid={`img-artisan-${artisan.id}`}
              />
              <h3 className="font-semibold text-lg mb-2" data-testid={`text-artisan-name-${artisan.id}`}>
                {artisan.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-1" data-testid={`text-artisan-specialty-${artisan.id}`}>
                {artisan.specialty}
              </p>
              <p className="text-muted-foreground text-sm mb-4" data-testid={`text-artisan-experience-${artisan.id}`}>
                {artisan.experience}
              </p>
              <div className="flex justify-center space-x-1 text-accent">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

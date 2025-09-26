import { addProduct } from '@/lib/firebase';
import type { InsertProduct } from '@/types';

// Sample products with your beautiful Aipan art images
const sampleProducts: InsertProduct[] = [
  {
    name: "Traditional Aipan Lota",
    description: "Beautifully hand-painted traditional water vessel with intricate red and white Aipan patterns. Perfect for ceremonial use and home decoration.",
    price: 899,
    category: "loataas",
    imageBase64: "", // Will be populated from the JSON
    stock: 15,
    featured: true,
    rating: 4.9,
    reviewCount: 23
  },
  {
    name: "Complete Aipan Dining Set",
    description: "Exquisite set featuring traditional thaali, bowl, and vessel with authentic Aipan artwork. Ideal for special occasions and festivals.",
    price: 2499,
    category: "thaalis",
    imageBase64: "",
    stock: 8,
    featured: true,
    rating: 4.8,
    reviewCount: 15
  },
  {
    name: "Decorative Aipan Plate Collection",
    description: "Set of beautifully decorated plates showcasing traditional Aipan geometric patterns in vibrant red and white colors.",
    price: 1799,
    category: "thaalis",
    imageBase64: "",
    stock: 12,
    featured: false,
    rating: 4.7,
    reviewCount: 31
  },
  {
    name: "Personalized Aipan Nameplate",
    description: "Custom nameplate with traditional Aipan border designs. Perfect for home entrance decoration with cultural authenticity.",
    price: 1299,
    category: "crafts",
    imageBase64: "",
    stock: 25,
    featured: false,
    rating: 4.6,
    reviewCount: 18
  },
  {
    name: "Sacred Aipan Ceremonial Thali",
    description: "Large ceremonial plate with intricate geometric patterns and traditional motifs. Handcrafted by master artisans from Uttarakhand.",
    price: 1599,
    category: "thaalis",
    imageBase64: "",
    stock: 10,
    featured: true,
    rating: 4.9,
    reviewCount: 42
  },
  {
    name: "Spiritual Aipan Worship Plate",
    description: "Traditional worship plate featuring Hindu symbols and sacred Aipan patterns. Perfect for daily prayers and special ceremonies.",
    price: 1399,
    category: "thaalis",
    imageBase64: "",
    stock: 18,
    featured: false,
    rating: 4.8,
    reviewCount: 27
  },
  {
    name: "Ganesha Aipan Blessing Plate",
    description: "Beautiful ceremonial plate with Lord Ganesha motif surrounded by traditional Aipan patterns. Brings prosperity and good fortune.",
    price: 1799,
    category: "thaalis",
    imageBase64: "",
    stock: 14,
    featured: true,
    rating: 5.0,
    reviewCount: 38
  }
];

export async function addAllSampleProducts() {
  try {
    // Load the products with base64 images
    const response = await fetch('/sample-products.json');
    const productsWithImages = await response.json();
    
    console.log('Adding sample products to Firebase...');
    
    for (let i = 0; i < productsWithImages.length; i++) {
      const product = productsWithImages[i];
      console.log(`Adding product ${i + 1}: ${product.name}`);
      
      try {
        const productId = await addProduct(product);
        console.log(`✅ Added product: ${product.name} (ID: ${productId})`);
      } catch (error) {
        console.error(`❌ Failed to add product: ${product.name}`, error);
      }
    }
    
    console.log('🎉 Sample products added successfully!');
    return true;
  } catch (error) {
    console.error('Failed to add sample products:', error);
    return false;
  }
}

// Function to be called from browser console
(window as any).addSampleProducts = addAllSampleProducts;
const fs = require('fs');
const path = require('path');

// Convert image to base64
function imageToBase64(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString('base64');
}

// Sample products with your Aipan art images
const products = [
  {
    name: "Traditional Aipan Lota",
    description: "Beautifully hand-painted traditional water vessel with intricate red and white Aipan patterns. Perfect for ceremonial use and home decoration.",
    price: 899,
    category: "loataas",
    stock: 15,
    featured: true,
    rating: 4.9,
    reviewCount: 23,
    imageFile: "lota_1758906873662.jpg"
  },
  {
    name: "Complete Aipan Dining Set",
    description: "Exquisite set featuring traditional thaali, bowl, and vessel with authentic Aipan artwork. Ideal for special occasions and festivals.",
    price: 2499,
    category: "thaalis",
    stock: 8,
    featured: true,
    rating: 4.8,
    reviewCount: 15,
    imageFile: "multi_1758906873664.jpg"
  },
  {
    name: "Decorative Aipan Plate Collection",
    description: "Set of beautifully decorated plates showcasing traditional Aipan geometric patterns in vibrant red and white colors.",
    price: 1799,
    category: "thaalis",
    stock: 12,
    featured: false,
    rating: 4.7,
    reviewCount: 31,
    imageFile: "multi2_1758906873664.jpg"
  },
  {
    name: "Personalized Aipan Nameplate",
    description: "Custom nameplate with traditional Aipan border designs. Perfect for home entrance decoration with cultural authenticity.",
    price: 1299,
    category: "crafts",
    stock: 25,
    featured: false,
    rating: 4.6,
    reviewCount: 18,
    imageFile: "Nameplate1_1758906873668.jpg"
  },
  {
    name: "Sacred Aipan Ceremonial Thali",
    description: "Large ceremonial plate with intricate geometric patterns and traditional motifs. Handcrafted by master artisans from Uttarakhand.",
    price: 1599,
    category: "thaalis",
    stock: 10,
    featured: true,
    rating: 4.9,
    reviewCount: 42,
    imageFile: "plate 2_1758906873671.jpg"
  },
  {
    name: "Spiritual Aipan Worship Plate",
    description: "Traditional worship plate featuring Hindu symbols and sacred Aipan patterns. Perfect for daily prayers and special ceremonies.",
    price: 1399,
    category: "thaalis",
    stock: 18,
    featured: false,
    rating: 4.8,
    reviewCount: 27,
    imageFile: "plate_1758906873671.jpg"
  },
  {
    name: "Ganesha Aipan Blessing Plate",
    description: "Beautiful ceremonial plate with Lord Ganesha motif surrounded by traditional Aipan patterns. Brings prosperity and good fortune.",
    price: 1799,
    category: "thaalis",
    stock: 14,
    featured: true,
    rating: 5.0,
    reviewCount: 38,
    imageFile: "plate1_1758906873672.jpg"
  }
];

// Convert all images and create JSON output
function createProductsWithBase64() {
  const productsWithImages = products.map(product => {
    const imagePath = path.join(__dirname, 'attached_assets', product.imageFile);
    const base64Image = imageToBase64(imagePath);
    
    return {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageBase64: base64Image,
      stock: product.stock,
      featured: product.featured,
      rating: product.rating,
      reviewCount: product.reviewCount
    };
  });

  // Write to JSON file for easy import
  fs.writeFileSync('sample-products.json', JSON.stringify(productsWithImages, null, 2));
  console.log('Sample products with base64 images created successfully!');
  console.log(`Generated ${productsWithImages.length} products`);
  
  // Also create individual product objects for manual addition
  productsWithImages.forEach((product, index) => {
    console.log(`\n--- Product ${index + 1}: ${product.name} ---`);
    console.log(`Category: ${product.category}`);
    console.log(`Price: ₹${product.price}`);
    console.log(`Stock: ${product.stock}`);
    console.log(`Base64 length: ${product.imageBase64.length} characters`);
  });
}

createProductsWithBase64();
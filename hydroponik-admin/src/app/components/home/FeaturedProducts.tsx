/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

const ProductCard = ({ name, description, price, imageUrl }: { name: string, description: string, price: string, imageUrl: string }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
    {/* Image Section - Larger */}
    <div className="relative h-56 overflow-hidden">
      <img 
        className="w-full h-full object-cover" 
        src={imageUrl} 
        alt={name} 
      />
    </div>
    
    {/* Content Section */}
    <div className="p-5">
      {/* Product Name */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {name}
      </h3>
      
      {/* Product Description */}
      <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">
        {description}
      </p>
      
      {/* Price and Button Row */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-xl font-bold text-[#3E8467]">
          Rp {new Intl.NumberFormat('id-ID').format(Number(price))}
        </span>
        <button className="bg-[#70B398] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-[#5fa085] transition-colors duration-200">
          Order
        </button>
      </div>
    </div>
  </div>
);

async function getProducts() {
  try {
    const res = await fetch('http://localhost:3000/products', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

const FeaturedProducts = async () => {
  const products = await getProducts();
  // Assuming "unggulan" means the first 4 products for this example
  const featured = products.slice(0, 4);

  return (
    <section className="bg-[#F4FFF8] py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">🌾 Produk Unggulan</h2>
          <Link href="/kategori" className="bg-[#70B398] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#5fa085] transition-colors duration-200">
            Kategori {'>'}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product: any) => (
            <ProductCard 
              key={product.id} 
              name={product.name}
              description={product.description}
              price={product.price}
              imageUrl={product.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
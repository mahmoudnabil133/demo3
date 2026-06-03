import Link from 'next/link';
import dbConnect from '@/lib/db';
import ProductModel from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/Product';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    await dbConnect();
    // Fetches top 3 items dynamically for landing page hero presentation
    const rawProducts = await ProductModel.find({}).limit(3).lean();
    return JSON.parse(JSON.stringify(rawProducts));
  } catch (error) {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Welcome Unit */}
      <section className="bg-slate-900 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Discover Exceptional <span className="text-indigo-400">Products</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto">
            Experience real-time inventory rendering, secured with social auth guards and lightning fast SSR delivery mechanisms.
          </p>
          <div className="pt-4">
            <Link
              href="/Products"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all inline-block"
            >
              Explore Full Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection Component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">
          Featured Highlights
        </h2>
        {featured.length === 0 ? (
          <p className="text-slate-500 italic">No products available in the database at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
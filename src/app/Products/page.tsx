import dbConnect from '@/lib/db';
import ProductModel from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/Product';

async function getAllProducts(): Promise<Product[]> {
    try {
        await dbConnect();
        const rawProducts = await ProductModel.find({}).lean();
        return JSON.parse(JSON.stringify(rawProducts));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function ProductsPage() {
    const products = await getAllProducts();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="border-b border-slate-200 pb-5 mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Full Product Inventory</h1>
                <p className="text-slate-500 mt-1">Browse our full range of live database entries synced instantly.</p>
            </div>

            {products.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-center">
                    Failed to fetch stock updates or the database is currently empty.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
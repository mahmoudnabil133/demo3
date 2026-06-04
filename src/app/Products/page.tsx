import dbConnect from '@/lib/db';
import ProductModel from '@/models/Product';
import ProductListClient from '@/components/ProductListClient';
import { Product } from '@/types/Product';

async function getAllProducts(): Promise<Product[]> {
    try {
        await dbConnect();
        // Sort by id descending so newly added products show up at the top
        const rawProducts = await ProductModel.find({}).sort({ id: -1 }).lean();
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

            <ProductListClient initialProducts={products} />
        </div>
    );
}
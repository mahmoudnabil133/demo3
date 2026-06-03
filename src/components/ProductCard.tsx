import Link from 'next/link';
import { Product } from '@/types/Product';

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <div className="relative aspect-square overflow-hidden bg-slate-50">
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
                    {product.category}
                </span>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-semibold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                    {product.title}
                </h3>

                <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center text-amber-500 text-sm">
                        ★ <span className="ml-1 text-slate-600 font-medium">{product.rating.toFixed(1)}</span>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
                    <Link
                        href={`/Products/${product.id}`}
                        className="text-sm font-medium bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white px-4 py-2 rounded-lg transition-all"
                    >
                        Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
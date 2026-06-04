import Link from 'next/link';
import { Product } from '@/types/Product';

export default function ProductCard({
    product,
    onEdit,
    onDelete
}: {
    product: Product;
    onEdit?: (product: Product) => void;
    onDelete?: (product: Product) => void;
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
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

                {(onEdit || onDelete) && (
                    <div className="absolute top-3 right-3 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        {onEdit && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onEdit(product);
                                }}
                                className="w-8 h-8 rounded-full bg-white/95 hover:bg-indigo-600 hover:text-white text-slate-700 flex items-center justify-center shadow-md backdrop-blur-sm transition-all duration-200 cursor-pointer"
                                title="Edit Product"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 20.013a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDelete(product);
                                }}
                                className="w-8 h-8 rounded-full bg-white/95 hover:bg-red-600 hover:text-white text-slate-700 flex items-center justify-center shadow-md backdrop-blur-sm transition-all duration-200 cursor-pointer"
                                title="Delete Product"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-semibold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                    {product.title}
                </h3>

                <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center text-amber-500 text-sm">
                        ★ <span className="ml-1 text-slate-600 font-medium">{(product.rating || 0).toFixed(1)}</span>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">${(product.price || 0).toFixed(2)}</span>
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
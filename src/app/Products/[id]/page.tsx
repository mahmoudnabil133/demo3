import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import ProductModel from '@/models/Product';
import { Product } from '@/types/Product';

async function getProduct(id: string): Promise<Product | null> {
    try {
        await dbConnect();
        const rawProduct = await ProductModel.findOne({ id: Number(id) }).lean();
        if (!rawProduct) return null;
        return JSON.parse(JSON.stringify(rawProduct));
    } catch (error) {
        return null;
    }
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 sm:p-10 rounded-2xl border border-slate-100 shadow-sm">

                {/* Gallery Engine */}
                <div className="space-y-4">
                    <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                        <img
                            src={product.images[0] || product.thumbnail}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {product.images.slice(0, 4).map((img, index) => (
                            <div key={index} className="aspect-square bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                                <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Informational Profile Metadata Panel */}
                <div className="flex flex-col justify-between space-y-6">
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-indigo-600 uppercase px-2.5 py-1 bg-indigo-50 rounded-md">
                            {product.category}
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">{product.title}</h1>
                        <p className="text-sm text-slate-400 mt-1">SKU: {product.sku} | Brand: {product.brand}</p>

                        <div className="flex items-center mt-4 space-x-4">
                            <span className="text-3xl font-extrabold text-slate-900">${product.price}</span>
                            {product.discountPercentage > 0 && (
                                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">
                                    {product.discountPercentage}% OFF
                                </span>
                            )}
                        </div>

                        <p className="text-slate-600 mt-6 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Operational Logistics Grid */}
                    <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-6 my-2 text-sm">
                        <div>
                            <p className="text-slate-400 font-medium">Availability</p>
                            <p className="text-slate-800 font-semibold mt-0.5">{product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 font-medium">Warranty</p>
                            <p className="text-slate-800 font-semibold mt-0.5">{product.warrantyInformation}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 font-medium">Shipping Profile</p>
                            <p className="text-slate-800 font-semibold mt-0.5">{product.shippingInformation}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 font-medium">Return window Policy</p>
                            <p className="text-slate-800 font-semibold mt-0.5">{product.returnPolicy}</p>
                        </div>
                    </div>

                    {/* Customer Reviews Presentation Segment */}
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg mb-4">Reviews From Customers ({product.reviews.length})</h3>
                        <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
                            {product.reviews.map((rev, index) => (
                                <div key={index} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-semibold text-slate-800">{rev.reviewerName}</p>
                                        <span className="text-amber-500 text-xs">★ {rev.rating}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 italic">"{rev.comment}"</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
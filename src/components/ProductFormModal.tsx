'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/Product';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Product) => void;
    product: Product | null; // null means create mode, Product object means edit mode
}

const CATEGORIES = [
    'beauty',
    'fragrances',
    'furniture',
    'groceries',
    'home-decoration',
    'kitchen-accessories',
    'laptops',
    'mobile-accessories',
    'smartphones',
    'mens-shirts',
    'mens-shoes',
    'womens-dresses',
    'womens-shoes',
];

export default function ProductFormModal({ isOpen, onClose, onSave, product }: ProductFormModalProps) {
    const isEditMode = !!product;

    const [title, setTitle] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [stock, setStock] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [description, setDescription] = useState('');

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (product) {
            setTitle(product.title || '');
            setBrand(product.brand || '');
            setCategory(product.category || '');
            setPrice(product.price?.toString() || '');
            setDiscountPercentage(product.discountPercentage?.toString() || '0');
            setStock(product.stock?.toString() || '0');
            setThumbnail(product.thumbnail || '');
            setDescription(product.description || '');
        } else {
            // Reset form for create mode
            setTitle('');
            setBrand('');
            setCategory(CATEGORIES[0]);
            setPrice('');
            setDiscountPercentage('0');
            setStock('10');
            setThumbnail('');
            setDescription('');
        }
        setError('');
    }, [product, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!title.trim() || !brand.trim() || !category.trim() || !price.trim() || !stock.trim() || !description.trim()) {
            setError('Please fill in all required fields.');
            return;
        }

        const priceNum = parseFloat(price);
        const stockNum = parseInt(stock, 10);
        const discountNum = parseFloat(discountPercentage) || 0;

        if (isNaN(priceNum) || priceNum <= 0) {
            setError('Price must be a valid positive number.');
            return;
        }
        if (isNaN(stockNum) || stockNum < 0) {
            setError('Stock must be a non-negative integer.');
            return;
        }
        if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
            setError('Discount must be between 0 and 100.');
            return;
        }

        setIsSubmitting(true);

        const payload = {
            title: title.trim(),
            brand: brand.trim(),
            category: category.trim(),
            price: priceNum,
            discountPercentage: discountNum,
            stock: stockNum,
            thumbnail: thumbnail.trim() || undefined,
            description: description.trim(),
        };

        try {
            const url = isEditMode ? `/api/products/${product.id}` : '/api/products';
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save product');
            }

            onSave(data);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with premium blur */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto z-10 transform scale-100 transition-all duration-300 flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEditMode ? 'Edit Product Details' : 'Add New Product'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-grow">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 font-medium">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Title */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-800">Product Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-400 bg-white transition-all"
                                placeholder="e.g. iPhone 15 Pro"
                                required
                            />
                        </div>

                        {/* Brand */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-800">Brand *</label>
                            <input
                                type="text"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-400 bg-white transition-all"
                                placeholder="e.g. Apple"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-800">Category *</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 bg-white transition-all"
                                required
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat} className="text-slate-900 bg-white">
                                        {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-800">Price ($) *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-400 bg-white transition-all"
                                placeholder="999.99"
                                required
                            />
                        </div>

                        {/* Discount */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-800">Discount Percentage (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="100"
                                value={discountPercentage}
                                onChange={(e) => setDiscountPercentage(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-400 bg-white transition-all"
                                placeholder="10"
                            />
                        </div>

                        {/* Stock */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-800">Stock Units *</label>
                            <input
                                type="number"
                                min="0"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-400 bg-white transition-all"
                                placeholder="50"
                                required
                            />
                        </div>
                    </div>

                    {/* Thumbnail URL */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-800">Thumbnail Image URL</label>
                        <input
                            type="url"
                            value={thumbnail}
                            onChange={(e) => setThumbnail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-400 bg-white transition-all"
                            placeholder="https://example.com/image.jpg (leave blank for default placeholder)"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-800">Description *</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-400 bg-white transition-all resize-none"
                            placeholder="Describe the key features, specs, and condition of the product..."
                            required
                        />
                    </div>

                    {/* Form Actions Footer */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 bg-white sticky bottom-0 z-10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>{isEditMode ? 'Save Changes' : 'Create Product'}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

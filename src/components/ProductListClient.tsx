'use client';

import React, { useState, useTransition } from 'react';
import { Product } from '@/types/Product';
import ProductCard from './ProductCard';
import ProductFormModal from './ProductFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface ProductListClientProps {
    initialProducts: Product[];
}

export default function ProductListClient({ initialProducts }: ProductListClientProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Modals state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [, startTransition] = useTransition();

    // Dynamically derive categories from current list of products
    const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

    // Filter products based on search query and category
    const filteredProducts = products.filter((product) => {
        const titleStr = product.title || '';
        const brandStr = product.brand || '';
        const descStr = product.description || '';

        const matchesSearch =
            titleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
            brandStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
            descStr.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleAddClick = () => {
        setCurrentProduct(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (product: Product) => {
        setCurrentProduct(product);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteOpen(true);
    };

    const handleFormSave = (savedProduct: Product) => {
        if (currentProduct) {
            // Edit Mode: update in state
            setProducts((prev) =>
                prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
            );
        } else {
            // Create Mode: append to state
            setProducts((prev) => [savedProduct, ...prev]);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/products/${productToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete product');
            }

            // Remove from local state
            setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
            setIsDeleteOpen(false);
            setProductToDelete(null);
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('Failed to delete product. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
    };

    return (
        <div className="space-y-8">
            {/* Search, Filter, and Add Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search & Category Filter */}
                <div className="flex flex-col sm:flex-row gap-3 flex-grow max-w-2xl">
                    <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search products by title, brand, description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-sm transition-all text-slate-800"
                        />
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-sm transition-all text-slate-800 bg-white"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat === 'all'
                                    ? 'All Categories'
                                    : cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Add Product Button */}
                <div>
                    <button
                        onClick={handleAddClick}
                        className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer text-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-xl mx-auto shadow-sm space-y-4">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 text-slate-400">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-800">No Products Found</h3>
                        <p className="text-slate-500 text-sm">
                            We couldn't find any products matching your search query or filters.
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={handleResetFilters}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-4 py-2 rounded-xl text-sm transition-all cursor-pointer"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}

            {/* CRUD Modals */}
            <ProductFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={handleFormSave}
                product={currentProduct}
            />

            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                productTitle={productToDelete?.title || ''}
                isDeleting={isDeleting}
            />
        </div>
    );
}

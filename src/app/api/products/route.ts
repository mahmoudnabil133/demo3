import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ProductModel from '@/models/Product';

export async function GET() {
    try {
        await dbConnect();
        const products = await ProductModel.find({});
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { title, description, category, brand, price, stock, discountPercentage, thumbnail, tags, images } = body;

        if (!title || !description || !category || !brand || price === undefined || stock === undefined) {
            return NextResponse.json({ error: 'Missing required fields: title, description, category, brand, price, stock' }, { status: 400 });
        }

        // Get max custom ID and increment it
        const lastProduct = await ProductModel.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
        const nextId = lastProduct && typeof lastProduct.id === 'number' ? lastProduct.id + 1 : 1;

        const discount = discountPercentage !== undefined ? Number(discountPercentage) : 0;
        const priceNum = Number(price);
        const stockNum = Number(stock);
        const thumbUrl = thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';
        const imgUrls = Array.isArray(images) && images.length > 0 ? images : [thumbUrl];

        const newProduct = new ProductModel({
            id: nextId,
            title,
            description,
            category,
            price: priceNum,
            discountPercentage: discount,
            rating: 5,
            stock: stockNum,
            tags: Array.isArray(tags) ? tags : [],
            brand,
            sku: `SKU-${nextId}-${Math.floor(1000 + Math.random() * 9000)}`,
            weight: 1,
            dimensions: {
                width: 10,
                height: 10,
                depth: 10
            },
            warrantyInformation: '1 year warranty',
            shippingInformation: 'Ships in 1-2 business days',
            availabilityStatus: stockNum > 0 ? 'In Stock' : 'Out of Stock',
            reviews: [],
            returnPolicy: '30 days return policy',
            minimumOrderQuantity: 1,
            meta: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                barcode: `BAR-${nextId}`,
                qrCode: `QR-${nextId}`
            },
            images: imgUrls,
            thumbnail: thumbUrl
        });

        const savedProduct = await newProduct.save();
        return NextResponse.json(savedProduct, { status: 201 });
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
    }
}
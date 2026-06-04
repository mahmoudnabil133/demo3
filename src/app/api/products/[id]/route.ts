import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ProductModel from '@/models/Product';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        // Handles database lookups seamlessly whether 'id' is stored as a custom number or string mapping
        const product = await ProductModel.findOne({ id: Number(id) });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        // Prevent modifying the unique custom ID
        delete body.id;
        delete body._id;

        // Ensure numeric fields are converted properly if sent as strings
        if (body.price !== undefined) body.price = Number(body.price);
        if (body.stock !== undefined) body.stock = Number(body.stock);
        if (body.discountPercentage !== undefined) body.discountPercentage = Number(body.discountPercentage);

        if (body.stock !== undefined) {
            body.availabilityStatus = body.stock > 0 ? 'In Stock' : 'Out of Stock';
        }

        // Set the nested meta updatedAt field
        const updateData: any = { ...body };
        updateData['meta.updatedAt'] = new Date().toISOString();

        const updatedProduct = await ProductModel.findOneAndUpdate(
            { id: Number(id) },
            { $set: updateData },
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error: any) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const deletedProduct = await ProductModel.findOneAndDelete({ id: Number(id) });

        if (!deletedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product deleted successfully', id: Number(id) }, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
    }
}
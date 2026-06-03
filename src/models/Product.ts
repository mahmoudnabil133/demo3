import mongoose, { Schema, Document } from 'mongoose';

const ProductSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    rating: { type: Number, required: true },
    stock: { type: Number, required: true },
    tags: [{ type: String }],
    brand: { type: String, required: true },
    sku: { type: String, required: true },
    weight: { type: Number, required: true },
    dimensions: {
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        depth: { type: Number, required: true }
    },
    warrantyInformation: { type: String, required: true },
    shippingInformation: { type: String, required: true },
    availabilityStatus: { type: String, required: true },
    reviews: [{
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        date: { type: String, required: true },
        reviewerName: { type: String, required: true },
        reviewerEmail: { type: String, required: true }
    }],
    returnPolicy: { type: String, required: true },
    minimumOrderQuantity: { type: Number, required: true },
    meta: {
        createdAt: { type: String, required: true },
        updatedAt: { type: String, required: true },
        barcode: { type: String, required: true },
        qrCode: { type: String, required: true }
    },
    images: [{ type: String }],
    thumbnail: { type: String, required: true }
});

// Avoid duplicate model compilation in Next.js development server
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
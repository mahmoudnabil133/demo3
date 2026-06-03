import { withAuth } from 'next-auth/middleware';

export default withAuth({
    pages: {
        signIn: '/', // Gracefully fallback to base configuration routes automatically
    },
});

// Protect all sub-products interfaces from unauthenticated programmatic requests
export const config = {
    matcher: [
        '/Products/:path*',
        '/api/products/:path*'
    ]
};
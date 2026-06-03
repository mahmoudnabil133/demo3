'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold tracking-wider text-indigo-400">
                            STORE.io
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link>
                        <Link href="/Products" className="hover:text-indigo-400 transition-colors">Products</Link>
                        <Link href="/About" className="hover:text-indigo-400 transition-colors">About</Link>
                        <Link href="/Contact" className="hover:text-indigo-400 transition-colors">Contact</Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {session ? (
                            <div className="flex items-center space-x-4">
                                {session.user?.image && (
                                    <img
                                        src={session.user.image}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full border border-indigo-400"
                                    />
                                )}
                                <span className="text-sm text-slate-300 max-w-[120px] truncate">{session.user?.name}</span>
                                <button
                                    onClick={() => signOut()}
                                    className="bg-red-600 hover:bg-red-700 text-xs px-4 py-2 rounded-md transition-all font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <button onClick={() => signIn('github')} className="bg-slate-700 hover:bg-slate-600 text-xs px-3 py-2 rounded-md font-medium transition-all">
                                    GitHub Login
                                </button>
                                <button onClick={() => signIn('google')} className="bg-indigo-600 hover:bg-indigo-700 text-xs px-3 py-2 rounded-md font-medium transition-all">
                                    Google Login
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-slate-800 px-2 pt-2 pb-4 space-y-1 sm:px-3 border-t border-slate-700">
                    <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700">Home</Link>
                    <Link href="/Products" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700">Products</Link>
                    <Link href="/About" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700">About</Link>
                    <Link href="/Contact" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700">Contact</Link>
                    <div className="pt-4 border-t border-slate-700 mt-2">
                        {session ? (
                            <div className="px-3 flex flex-col space-y-3">
                                <div className="flex items-center space-x-3">
                                    {session.user?.image && <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full" />}
                                    <span className="text-sm font-medium text-slate-300">{session.user?.name}</span>
                                </div>
                                <button onClick={() => signOut()} className="w-full bg-red-600 hover:bg-red-700 text-sm py-2 rounded-md transition-colors">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="px-3 flex flex-col space-y-2">
                                <button onClick={() => signIn('github')} className="w-full bg-slate-700 hover:bg-slate-600 text-sm py-2 rounded-md">
                                    Sign in with GitHub
                                </button>
                                <button onClick={() => signIn('google')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-sm py-2 rounded-md">
                                    Sign in with Google
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
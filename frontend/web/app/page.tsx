"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Sparkles, Heart, Moon } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/stories');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center text-white">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <Moon className="w-12 h-12 text-yellow-300" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Bonne Nuit
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-2xl mx-auto">
            Create magical, personalized bedtime stories for your little ones
          </p>
          <p className="text-white/60 mb-12">
            Powered by AI • Illustrated • Unique every time
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-white text-indigo-900 hover:bg-white/90 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
            <div className="p-3 bg-indigo-500/30 rounded-xl w-fit mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Stories</h3>
            <p className="text-white/70">
              Generate unique tales tailored to your child's age, interests, and favorite characters.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
            <div className="p-3 bg-pink-500/30 rounded-xl w-fit mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Beautiful Illustrations</h3>
            <p className="text-white/70">
              Every story comes with vivid AI-generated images to spark imagination.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
            <div className="p-3 bg-purple-500/30 rounded-xl w-fit mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Made with Love</h3>
            <p className="text-white/70">
              Stories with heartwarming lessons and happy endings, perfect for bedtime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

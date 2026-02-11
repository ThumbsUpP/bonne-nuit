"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, PlusCircle, Trash2 } from 'lucide-react';
import { Story } from '@/types/story';
import { getStoredStories, deleteStory } from '@/lib/storage';

export default function StoriesList() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from local storage
    const loaded = getStoredStories();
    setStories(loaded);
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Delete this story?')) {
      deleteStory(id);
      setStories(getStoredStories());
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tes Histoires</h1>
            <p className="text-gray-500 mt-1">Des contes magiques pour les petits</p>
          </div>
          <Link
            href="/generate"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-200"
          >
            <PlusCircle className="w-5 h-5" />
            Nouvelle Histoire
          </Link>
        </div>

        {stories.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Pas encore d'histoires</h2>
            <p className="text-gray-500 mb-6">Crée ton premier conte magique !</p>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              Créer une Histoire
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 group"
              >
                <div className="flex items-start justify-between">
                  <Link href={`/stories/${story.id}`} className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {story.title}
                    </h2>
                    <p className="text-gray-500 mt-1">{story.topic}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {story.pages?.length || 0} pages
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(story.createdAt)}
                      </span>
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
                        {story.ageGroup}
                      </span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                      {story.title.charAt(0)}
                    </div>
                    <button
                      onClick={() => story.id && handleDelete(story.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

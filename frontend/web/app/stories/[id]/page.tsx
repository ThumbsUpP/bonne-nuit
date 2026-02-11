"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Calendar, Download, User } from 'lucide-react';
import { Story } from '@/types/story';
import { getStoryById } from '@/lib/storage';

export default function StoryDetail() {
  const params = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (params.id) {
      const loaded = getStoryById(params.id as string);
      setStory(loaded || null);
      setLoading(false);
    }
  }, [params.id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const exportStory = () => {
    if (!story) return;
    const data = JSON.stringify(story, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
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

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/stories" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-red-600">Histoire non trouvée</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <Link href="/stories" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour aux histoires
          </Link>
          <button
            onClick={exportStory}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <Download className="w-4 h-4" />
            Exporter JSON
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
            <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm opacity-90">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {story.pages?.length || 0} pages
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(story.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {story.ageGroup}
              </span>
            </div>
          </div>

          {/* Story Content */}
          <div className="p-8">
            {story.pages && story.pages.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Page {currentPage + 1} sur {story.pages.length}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(story.pages.length - 1, currentPage + 1))}
                      disabled={currentPage === story.pages.length - 1}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                    >
                      Suivant
                    </button>
                  </div>
                </div>

                {/* Page Content */}
                <div className="bg-gray-50 rounded-xl p-8 min-h-[200px]">
                  <p className="text-lg text-gray-800 leading-relaxed">
                    {story.pages[currentPage].textContent}
                  </p>
                </div>

                {/* Image Description */}
                <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
                  <p className="text-sm text-indigo-800">
                    <span className="font-semibold">🎨 Illustration :</span>{' '}
                    {story.pages[currentPage].imageDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Story Details */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Thème</p>
                  <p className="font-medium text-gray-900">{story.topic}</p>
                </div>
                {story.protagonistName && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Personnage principal</p>
                    <p className="font-medium text-gray-900">{story.protagonistName}</p>
                  </div>
                )}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Style artistique</p>
                  <p className="font-medium text-gray-900">{story.artStyle}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Description du personnage</p>
                  <p className="font-medium text-gray-900 text-sm">{story.characterDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

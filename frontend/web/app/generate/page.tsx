"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { StoryRequest, Story, Page } from '@/types/story';
import { saveStory } from '@/lib/storage';

// Mock story generation - in real version, this would call your backend
async function generateMockStory(request: StoryRequest): Promise<Story> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const protagonist = request.protagonistName || 'Léo';
  const childName = request.childName;
  
  const pages: Page[] = [
    {
      textContent: `Il était une fois ${protagonist}, un petit héros qui adorait ${request.topic}. ${childName ? `Un jour, ${childName} découvrit une porte magique dans son jardin.` : 'Un jour, il découvrit une porte magique dans son jardin.'}`,
      imageDescription: `A cute illustration of ${protagonist}, a friendly character, discovering a shimmering magical door in a beautiful garden. Children's book style, soft colors, whimsical.`
    },
    {
      textContent: `${protagonist} ouvrit la porte et découvrit un monde merveilleux rempli de couleurs et de magie. « Waouh ! » s'exclama-t-${childName ? `il en voyant ${childName} sourire` : 'il'}.",
      imageDescription: `${protagonist} stepping through the magical door into a vibrant fantasy world with floating islands and rainbow skies. Wonder and amazement on the character's face.`
    },
    {
      textContent: `Dans ce monde magique, ${protagonist} apprit que ${request.topic} était encore plus merveilleux qu'il ne l'imaginait. Il fit de nouveaux amis et vécut des aventures incroyables.`,
      imageDescription: `${protagonist} surrounded by new magical friends in the fantasy world, all engaged in ${request.topic}. Joyful scene, bright colors, friendship theme.`
    },
    {
      textContent: `Quand vint le soir, ${protagonist} sut qu'il était temps de rentrer. Mais il promettit de revenir bientôt. ${childName ? `${childName} et ` : ''}${protagonist} savaient que la magie existe pour ceux qui y croient.`,
      imageDescription: `A heartwarming scene of ${protagonist} waving goodbye to magical friends at sunset, with the magical door glowing softly. Bittersweet but happy ending, warm golden light.`
    }
  ];
  
  return {
    title: `L'aventure magique de ${protagonist}`,
    ageGroup: `${request.age} ans`,
    characterDescription: `A friendly ${request.age <= 5 ? 'cartoon' : 'adventurous'} character named ${protagonist}, with bright eyes and a warm smile. Wearing colorful clothes suitable for adventure.`,
    artStyle: `Children's book illustration, ${request.age <= 5 ? 'soft watercolor style with gentle colors' : 'vibrant digital art with rich details'}, whimsical and heartwarming.`,
    pages,
    topic: request.topic,
    protagonistName: request.protagonistName,
    childName: request.childName,
  };
}

export default function GenerateStory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<StoryRequest>({
    topic: '',
    age: 5,
    childName: '',
    protagonistName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For now, use mock generation
      // Later you can connect to your backend API
      const story = await generateMockStory(formData);
      const saved = saveStory(story);
      router.push(`/stories/${saved.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const generateRandom = () => {
    const topics = [
      'un dragon qui a peur du noir',
      'une licorne qui veut apprendre à voler',
      'un robot qui découvre les émotions',
      'un chat qui parle et fait des blagues',
      'un pirate gentil qui partage son trésor',
      'une fée qui perd ses pouvoires magiques',
    ];
    const names = ['Luna', 'Nico', 'Zoe', 'Tom', 'Mia', 'Lucas'];
    
    setFormData({
      ...formData,
      topic: topics[Math.floor(Math.random() * topics.length)],
      protagonistName: names[Math.floor(Math.random() * names.length)],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Créer une Histoire</h1>
              <p className="text-gray-500">Génère un conte magique personnalisé</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thème de l'histoire
              </label>
              <input
                type="text"
                required
                placeholder="ex: un dragon qui aime les cookies"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Âge de l'enfant
              </label>
              <input
                type="number"
                min="2"
                max="12"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom de l'enfant (optionnel)
              </label>
              <input
                type="text"
                placeholder="ex: Emma"
                value={formData.childName}
                onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du personnage principal (optionnel)
              </label>
              <input
                type="text"
                placeholder="ex: Étoile la Licorne"
                value={formData.protagonistName}
                onChange={(e) => setFormData({ ...formData, protagonistName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={generateRandom}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Wand2 className="w-5 h-5" />
                Aléatoire
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5" />
                    Générer l'Histoire
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-amber-50 rounded-xl text-sm text-amber-800">
            <p className="font-medium mb-1">💡 Note :</p>
            <p>Mode démo actif - les histoires sont générées localement. Pour connecter à l'API backend avec Gemini, modifiez <code>generateMockStory()</code> dans ce fichier.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

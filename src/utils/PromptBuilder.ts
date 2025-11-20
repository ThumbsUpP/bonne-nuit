import { StoryRequest } from '../models/Story';

export class PromptBuilder {
  static build(request: StoryRequest): string {
    const { topic, age, childName } = request;
    const namePart = childName ? `The main character should be named ${childName}.` : '';
    
    let styleInstruction = '';
    let structureInstruction = '';

    if (age <= 3) {
      styleInstruction = 'Utilise des mots très simples et des phrases courtes. Un langage répétitif et rythmé est bon.';
      structureInstruction = 'Crée 5-7 pages. Chaque page doit avoir exactement 1 courte phrase et une description détaillée de l\'image.';
    } else if (age <= 6) {
      styleInstruction = 'Utilise un vocabulaire simple mais des phrases complètes. Ton engageant et amusant.';
      structureInstruction = 'Crée 7-10 pages. Chaque page doit avoir 2-3 phrases et une description détaillée de l\'image.';
    } else {
      styleInstruction = 'Utilise un vocabulaire et des structures de phrases plus complexes. Un ton aventureux ou mystérieux est approprié.';
      structureInstruction = 'Crée 10-12 pages. Chaque page doit avoir un court paragraphe (4-6 phrases) et une description détaillée de l\'image.';
    }

    return `
      Écris une courte histoire pour un enfant de ${age} ans sur le sujet : "${topic}".
      ${namePart ? `Le personnage principal doit s'appeler ${childName}.` : ''}
      
      Guide de style : ${styleInstruction}
      Guide de structure : ${structureInstruction}

      INSTRUCTIONS POUR LES IMAGES (CRUCIAL) :
      1. D'abord, définis une description visuelle précise du personnage principal (couleur des cheveux, vêtements, accessoires).
      2. Définis un style artistique cohérent (ex: "illustration vectorielle colorée et plate", "aquarelle douce").
      3. Pour CHAQUE "imageDescription" dans les pages, utilise ces éléments mais adapte-les à l'action de la page.

      Retourne le résultat strictement sous forme d'objet JSON avec le format suivant :
      {
        "title": "Titre de l'histoire",
        "ageGroup": "${age} ans",
        "characterDescription": "Description visuelle complète du personnage (en anglais)",
        "artStyle": "Description du style artistique (en anglais)",
        "pages": [
          {
            "textContent": "Texte de la page 1...",
            "imageDescription": "Description de l'image pour la page 1 (en anglais)..."
          },
          ...
        ]
      }
      N'inclus aucun formatage markdown (comme \`\`\`json), juste la chaîne JSON brute.
      IMPORTANT: Le 'textContent' et le 'title' doivent être en FRANÇAIS. Les champs 'characterDescription', 'artStyle' et 'imageDescription' doivent être en ANGLAIS.
    `;
  }
}

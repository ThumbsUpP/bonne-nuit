import { StoryRequest } from '../models/Story';

export class PromptBuilder {
  static build(request: StoryRequest): string {
    const { topic, age, protagonistName, childName } = request;
    
    return `
${this.getContextSection(age, topic, childName, protagonistName)}

${this.getNarrativeSection()}

${this.getStyleSection(age)}

${this.getStructureSection(age)}

${this.getImageInstructions()}

${this.getFormattingInstructions(age)}
    `.trim();
  }

  private static getContextSection(age: number, topic: string, childName?: string, protagonistName?: string): string {
    return `Écris une courte histoire pour un enfant de ${age} ans ${childName ? `prénommé ${childName} ` : ''}sur le sujet : "${topic}". 
L'histoire doit contenir des éléments surprenants et amusants. 
Le personnage principal doit apprendre quelque chose à la fin de l'histoire.
${protagonistName ? `Le personnage principal doit s'appeler ${protagonistName}.` : ''}`;
  }

  private static getNarrativeSection(): string {
    return `STRUCTURE NARRATIVE :
L'histoire doit impérativement suivre une trame narrative classique et engageante :
1. Situation initiale : Présentation du personnage et de son environnement.
2. Élément perturbateur : Un problème ou un événement inattendu survient.
3. Péripéties : Le personnage cherche une solution.
4. Résolution heureuse : Le problème est résolu et le personnage a appris quelque chose.`;
  }

  private static getStyleSection(age: number): string {
    let instruction = '';
    if (age <= 3) {
      instruction = 'Utilise des mots très simples et des phrases courtes.';
    } else if (age <= 6) {
      instruction = 'Utilise un vocabulaire simple mais des phrases complètes. Ton engageant et amusant.';
    } else {
      instruction = 'Utilise un vocabulaire et des structures de phrases plus complexes. Un ton aventureux ou mystérieux est approprié.';
    }
    return `GUIDE DE STYLE : ${instruction}`;
  }

  private static getStructureSection(age: number): string {
    let instruction = '';
    if (age <= 3) {
      instruction = 'Crée 5-7 pages. Chaque page doit avoir exactement 3 ou 4 courtes phrases et une description détaillée de l\'image.';
    } else if (age <= 6) {
      instruction = 'Crée 7-10 pages. Chaque page doit avoir 6 ou 7 phrases et une description détaillée de l\'image.';
    } else {
      instruction = 'Crée 10-12 pages. Chaque page doit avoir un court paragraphe de 8 ou 9 phrases et une description détaillée de l\'image.';
    }
    return `GUIDE DE STRUCTURE : ${instruction}`;
  }

  private static getImageInstructions(): string {
    return `INSTRUCTIONS POUR LES IMAGES (CRUCIAL) :
1. D'abord, définis une description visuelle précise du personnage principal (couleur des cheveux, vêtements, accessoires).
2. Définis un style artistique cohérent (ex: "illustration vectorielle colorée et plate", "aquarelle douce").
3. IMPORTANT : Pas de fond blanc. Utilise des scènes complètes, colorées et détaillées (ex: forêt, chambre, espace).
4. Le texte de l'histoire DOIT être intégré dans l'image de manière artistique et lisible.`;
  }

  private static getFormattingInstructions(age: number): string {
    return `Retourne le résultat strictement sous forme d'objet JSON avec le format suivant :
{
  "title": "Titre de l'histoire",
  "ageGroup": "${age} ans",
  "characterDescription": "Description visuelle complète du personnage (en anglais)",
  "artStyle": "Description du style artistique (en anglais)",
  "pages": [
    {
      "textContent": "Texte de la page 1...",
      "imageDescription": "Description de l'image (en anglais). Inclure : 'Full scene, no white background. Text to render: [Texte de la page 1]'"
    }
  ]
}
N'inclus aucun formatage markdown (comme \`\`\`json), juste la chaîne JSON brute.
IMPORTANT: Le 'textContent' et le 'title' doivent être en FRANÇAIS. Les champs 'characterDescription', 'artStyle' et 'imageDescription' doivent être en ANGLAIS.`;
  }
}

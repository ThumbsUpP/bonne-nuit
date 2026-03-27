export interface StoryRequest {
    topic: string;
    age: number;
    protagonistName?: string;
    childName?: string;
}

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

    static buildSuggestionPrompt(field: string): string {
        switch (field) {
            case 'topic':
                return "Suggère un sujet court et amusant pour une histoire courte pour enfant (ex: un lapin courageux, une course d'escargots). Réponds uniquement avec le sujet, sans aucune ponctuation.";
            case 'protagonist':
                return "Suggère un prénom mignon et inventif pour un personnage principal d'histoire pour enfant (ex: Pompon, Zébulon). Réponds uniquement avec le prénom.";
            case 'childName':
                return "Suggère un prénom classique ou commun d'enfant. Réponds uniquement avec le prénom.";
            default:
                throw new Error(`Unsupported field for suggestion: ${field}`);
        }
    }

    private static getContextSection(age: number, topic: string, childName?: string, protagonistName?: string): string {
        return `Écris une courte histoire pour un enfant de ${age} ans ${childName ? `prénommé ${childName} ` : ''}sur le sujet : "${topic}". 
L'histoire doit contenir des éléments surprenants et amusants. 
Le personnage principal doit apprendre quelque chose à la fin de l'histoire.
${protagonistName ? `Le personnage principal doit s'appeler ${protagonistName}.` : ''}`;
    }

    private static getNarrativeSection(): string {
        return `STRUCTURE NARRATIVE (À RÉFLÉCHIR DANS LE SYNOPSIS) :
L'histoire doit impérativement suivre une trame narrative classique, cohérente et engageante, sans conclusion abrupte :
1. Situation initiale : Présentation du personnage et de son environnement.
2. Élément perturbateur : Un problème ou un événement inattendu survient.
3. Péripéties : Le personnage cherche une solution de manière logique.
4. Résolution heureuse : Le problème est résolu de manière satisfaisante et le personnage a appris quelque chose.`;
    }

    private static getStyleSection(age: number): string {
        let instruction = '';
        if (age <= 6) {
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
2. Définis un style artistique cohérent, clair et équilibré (ex: "illustration vectorielle lumineuse", "aquarelle douce et claire").
3. IMPORTANT : Garde un arrière-plan joliment dessiné mais qui n'est pas trop surchargé. Le personnage principal et l'action doivent rester bien en évidence.
4. Le texte de l'histoire DOIT être intégré dans l'image dans une zone dégagée de manière lisible.`;
    }

    private static getFormattingInstructions(age: number): string {
        return `RÈGLES IMPORTANTES :
1. Crée un "synopsisAndPlanning" en premier pour réfléchir au scénario global avant d'écrire les pages.
2. L'histoire doit être bien rythmée, ne termine pas brusquement.
3. Le 'textContent' et le 'title' doivent impérativement être en FRANÇAIS. 
4. Les champs 'characterDescription', 'artStyle' et 'imageDescription' doivent être descriptifs et en ANGLAIS.
5. Pour 'imageDescription', inclus TOUJOURS : 'Clear composition, balanced background, not too cluttered. Text to render: [Texte de la page exacte en français]'`;
    }
}

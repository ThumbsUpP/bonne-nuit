export interface StoryPage {
    textContent: string;
    imageDescription: string;
    imageId?: string;
    imageUrl?: string | null;
}

export interface Story {
    _id: string;
    _creationTime: number;
    title: string;
    ageGroup: string;
    artStyle: string;
    characterDescription: string;
    userId: string;
    pages: StoryPage[];
}

export interface Page {
  textContent: string;
  imageDescription: string;
}

export interface Story {
  title: string;
  ageGroup: string;
  characterDescription: string; // New field for consistent character generation
  artStyle: string;            // New field for consistent style
  pages: Page[];
}

export interface StoryRequest {
  topic: string;
  age: number;
  childName?: string;
}

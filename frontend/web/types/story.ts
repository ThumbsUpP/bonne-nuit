export interface Page {
  textContent: string;
  imageDescription: string;
}

export interface Story {
  id?: string;
  title: string;
  ageGroup: string;
  characterDescription: string;
  artStyle: string;
  pages: Page[];
  topic: string;
  protagonistName?: string;
  childName?: string;
  userId?: string;
  createdAt?: string;
}

export interface StoryRequest {
  topic: string;
  age: number;
  protagonistName?: string;
  childName?: string;
}

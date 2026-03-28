import { useState } from 'react';
import { useAction } from "convex/react";

export const useStoryForm = () => {
  const [topic, setTopic] = useState("");
  const [protagonist, setProtagonist] = useState("");
  const [childName, setChildName] = useState("");
  const [isSuggesting, setIsSuggesting] = useState({ topic: false, protagonist: false, childName: false });

  const suggestProposition = useAction("gemini:suggestProposition" as any);

  const handleSuggest = async (field: 'topic' | 'protagonist' | 'childName') => {
    setIsSuggesting(prev => ({ ...prev, [field]: true }));
    try {
      const suggestion = await suggestProposition({ field });
      if (field === 'topic') setTopic(suggestion);
      else if (field === 'protagonist') setProtagonist(suggestion);
      else if (field === 'childName') setChildName(suggestion);
    } catch (e) {
      console.error("Error generating suggestion:", e);
    } finally {
      setIsSuggesting(prev => ({ ...prev, [field]: false }));
    }
  };

  const resetForm = () => {
    setTopic("");
    setProtagonist("");
    setChildName("");
  };

  return {
    topic,
    setTopic,
    protagonist,
    setProtagonist,
    childName,
    setChildName,
    isSuggesting,
    handleSuggest,
    resetForm
  };
};

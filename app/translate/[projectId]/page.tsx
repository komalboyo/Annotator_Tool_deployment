'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';

interface Text {
  _id: string;
  sentence: string;
  language: string;
}

export default function TranslatePage() {
  const { projectId } = useParams();
  const [texts, setTexts] = useState<Text[]>([]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        setIsLoading(true);
        if (projectId) {
          const res = await fetch(`/api/translate/${projectId}`);
          if (res.ok) {
            const data = await res.json();
            const apiTexts = data.annotations.map((a: any) => ({
              _id: a.textId._id,
              sentence: a.textId.sentence,
              language: a.textId.language,
            }));
            setTexts(apiTexts);
            const initialTranslations: Record<string, string> = {};
            apiTexts.forEach((text: Text) => {
              initialTranslations[text._id] = '';
            });
            setTranslations(initialTranslations);
          }
        }
      } catch (err) {
        console.error('Error fetching texts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTexts();
  }, [projectId]);

  const handleTranslationChange = (id: string, value: string) => {
    setTranslations((prev) => ({ ...prev, [id]: value }));
  };

  const handleSingleSubmit = async (textId: string) => {
    const translatedText = translations[textId];
    if (!translatedText.trim()) return;

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textId, translatedText }),
      });

      if (res.ok) {
        setSubmittedIds((prev) => new Set(prev).add(textId));
        console.log(`Translation for ${textId} submitted.`);
      } else {
        const error = await res.json();
        alert(error.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#0a1522] text-white">
        <Sidebar role="annotator" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#1d9aaa]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a1522] text-white">
      <Sidebar role="annotator" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex flex-col h-full">
          <div className="grid grid-cols-2 gap-8 mb-4">
            <h3 className="text-center text-[#1d9aaa]">Input Text</h3>
            <h3 className="text-center text-[#1d9aaa]">Annotated Text</h3>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              {texts.map((text) => (
                <p key={text._id} className="text-gray-300">
                  {text.sentence}
                </p>
              ))}
            </div>

            <div className="space-y-4">
              {texts.map((text) => (
                <div key={`input-${text._id}`} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={translations[text._id] || ''}
                    onChange={(e) => handleTranslationChange(text._id, e.target.value)}
                    className="flex-1 bg-transparent border-b border-gray-600 focus:border-[#1d9aaa] outline-none px-2 py-1 text-white disabled:opacity-60"
                    placeholder="Enter translation..."
                    disabled={submittedIds.has(text._id)}
                  />
                  <button
                    onClick={() => handleSingleSubmit(text._id)}
                    disabled={submittedIds.has(text._id)}
                    className="bg-[#1d9aaa] hover:bg-[#168696] text-white px-4 py-1 rounded-md text-sm disabled:opacity-50"
                  >
                    {submittedIds.has(text._id) ? '✓' : 'Submit'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
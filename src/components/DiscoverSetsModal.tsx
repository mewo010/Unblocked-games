import React, { useState } from 'react';
import { QuestionSet } from '../types/blooket';
import { INITIAL_QUESTION_SETS } from '../data/blooketData';
import { playClickSound } from '../utils/audio';

interface DiscoverSetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaySet: (set: QuestionSet) => void;
  onHostSet: (set: QuestionSet) => void;
}

export const DiscoverSetsModal: React.FC<DiscoverSetsModalProps> = ({
  isOpen,
  onClose,
  onPlaySet,
  onHostSet,
}) => {
  const [sets, setSets] = useState<QuestionSet[]>(INITIAL_QUESTION_SETS);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedSetPreview, setSelectedSetPreview] = useState<QuestionSet | null>(null);

  // Create set state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('General Knowledge');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrect, setNewCorrect] = useState(0);
  const [tempQuestions, setTempQuestions] = useState<QuestionSet['questions']>([]);

  if (!isOpen) return null;

  const categories = ['All', 'Geography', 'Science', 'Math', 'Nature'];

  const filteredSets = sets.filter((s) => {
    const matchCat = activeCategory === 'All' || s.category === activeCategory;
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddQuestionToNewSet = () => {
    if (!newQuestionText.trim() || newOptions.some((o) => !o.trim())) return;
    setTempQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        text: newQuestionText.trim(),
        options: [...newOptions],
        correctAnswer: newCorrect,
      },
    ]);
    setNewQuestionText('');
    setNewOptions(['', '', '', '']);
    setNewCorrect(0);
  };

  const handleSaveSet = () => {
    if (!newTitle.trim() || tempQuestions.length === 0) return;
    const newCreatedSet: QuestionSet = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom set created by teacher',
      category: newCategory,
      author: 'You',
      plays: 1,
      questions: tempQuestions,
    };
    setSets((prev) => [newCreatedSet, ...prev]);
    setIsCreating(false);
    setNewTitle('');
    setNewDesc('');
    setTempQuestions([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-nunito">
      <div className="bg-white rounded-3xl max-w-[800px] w-full max-h-[90vh] flex flex-col p-6 shadow-2xl relative border-4 border-[#0bc2cf]">
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold flex items-center justify-center transition"
        >
          ✕
        </button>

        {isCreating ? (
          /* Create Question Set Flow */
          <div className="overflow-y-auto flex-1 pr-1">
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <h3 className="font-titan text-2xl text-[#0bc2cf]">Create New Question Set</h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-800"
              >
                Back to Library
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">Set Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Ancient Egypt Review"
                    className="w-full py-2 px-3 rounded-xl border border-gray-300 font-bold text-sm focus:border-[#0bc2cf] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-gray-300 font-bold text-sm focus:border-[#0bc2cf] outline-none"
                  />
                </div>
              </div>

              {/* Questions Added list */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="text-xs font-black uppercase text-gray-500 block mb-2">
                  Questions in Set ({tempQuestions.length})
                </span>
                {tempQuestions.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No questions added yet. Add at least 1 question below.</p>
                ) : (
                  <ul className="space-y-1.5 max-h-[100px] overflow-y-auto text-xs">
                    {tempQuestions.map((q, idx) => (
                      <li key={q.id} className="bg-white p-2 rounded-lg border flex items-center justify-between font-bold">
                        <span>{idx + 1}. {q.text}</span>
                        <span className="text-emerald-600 font-black">✓ {q.options[q.correctAnswer]}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Add Question Card */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-cyan-200">
                <h4 className="text-xs font-black uppercase text-[#0bc2cf] mb-2">+ Add Question</h4>
                <input
                  type="text"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Enter question text..."
                  className="w-full py-2 px-3 rounded-xl border border-gray-300 font-bold text-sm mb-3 bg-white focus:border-[#0bc2cf] outline-none"
                />

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {newOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-white p-1 rounded-xl border">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={newCorrect === i}
                        onChange={() => setNewCorrect(i)}
                        className="ml-2 accent-[#0bc2cf]"
                        title="Mark as correct answer"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...newOptions];
                          updated[i] = e.target.value;
                          setNewOptions(updated);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        className="w-full text-xs font-bold py-1 px-1 outline-none"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddQuestionToNewSet}
                  className="px-4 py-1.5 bg-[#0bc2cf] hover:bg-[#09a1ad] text-white font-extrabold text-xs rounded-lg transition"
                >
                  Add Question to Set
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveSet}
                disabled={!newTitle.trim() || tempQuestions.length === 0}
                className="button w-full"
              >
                <div className="buttonBack"></div>
                <div className="buttonFront text-lg py-2">
                  Save Set to Library
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Normal Library Browser */
          <>
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <div>
                <h3 className="font-titan text-3xl text-[#0bc2cf]">Discover Sets</h3>
                <p className="text-xs text-gray-500 font-bold">Search millions of user and teacher created question sets</p>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  setIsCreating(true);
                }}
                className="button"
              >
                <div className="buttonBack"></div>
                <div className="buttonFront text-xs sm:text-sm py-1 px-3">
                  + Create Set
                </div>
              </button>
            </div>

            {/* Search & Categories */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subjects, topics, standards..."
                className="flex-1 py-2 px-3 rounded-xl border-2 border-gray-200 text-sm font-bold focus:border-[#0bc2cf] outline-none"
              />

              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-extrabold transition whitespace-nowrap ${
                      activeCategory === cat
                        ? 'bg-[#0bc2cf] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto flex-1 pr-1">
              {filteredSets.map((set) => (
                <div
                  key={set.id}
                  className="bg-white border-2 border-gray-200 hover:border-[#0bc2cf] rounded-2xl p-4 transition-all hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#32999f] bg-sky-50 px-2 py-0.5 rounded-md">
                        {set.category}
                      </span>
                      <span className="text-xs text-gray-400 font-bold">
                        {set.questions.length} Qs • {set.plays.toLocaleString()} plays
                      </span>
                    </div>

                    <h4 className="font-titan text-lg text-gray-800 mb-1">{set.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{set.description}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        playClickSound();
                        setSelectedSetPreview(set);
                      }}
                      className="px-2.5 py-1 text-xs font-extrabold text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100"
                    >
                      Preview Qs
                    </button>
                    <button
                      onClick={() => {
                        playClickSound();
                        onPlaySet(set);
                      }}
                      className="flex-1 py-1 px-3 bg-[#0bc2cf] hover:bg-[#09a1ad] text-white rounded-lg text-xs font-black transition text-center"
                    >
                      Solo Play
                    </button>
                    <button
                      onClick={() => {
                        playClickSound();
                        onHostSet(set);
                      }}
                      className="py-1 px-3 bg-[#9a49aa] hover:bg-[#823a91] text-white rounded-lg text-xs font-black transition text-center"
                    >
                      Host
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Question preview modal */}
            {selectedSetPreview && (
              <div className="absolute inset-0 bg-white/95 rounded-3xl p-6 z-20 flex flex-col">
                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                  <div>
                    <h4 className="font-titan text-2xl text-gray-800">{selectedSetPreview.title}</h4>
                    <span className="text-xs text-gray-500 font-bold">
                      {selectedSetPreview.questions.length} Questions
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedSetPreview(null)}
                    className="text-gray-500 font-bold text-sm hover:underline"
                  >
                    Close Preview
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 space-y-3 pr-2">
                  {selectedSetPreview.questions.map((q, i) => (
                    <div key={q.id} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <div className="font-extrabold text-sm text-gray-800 mb-2">
                        {i + 1}. {q.text}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-1.5 rounded-lg font-bold ${
                              oIdx === q.correctAnswer
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-white text-gray-600'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';

export interface ArticleItem {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  category: string;
  readingTime?: string;
  heroImage?: string;
}

interface Props {
  initialArticles: ArticleItem[];
}

export default function ArticleSearchFilter({ initialArticles }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  const categories = ['Semua', 'Mindset', 'Produktivitas', 'Kebiasaan', 'Komunikasi'];

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'Semua' ||
        article.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [initialArticles, searchQuery, selectedCategory]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'mindset':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'produktivitas':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'kebiasaan':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'komunikasi':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full">
      {/* Search & Category Filter Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Live Search Input */}
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik, kebiasaan, mindset..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Interactive Category Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
              Topik:
            </span>
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200 scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Ditemukan <strong>{filteredArticles.length}</strong> dari {initialArticles.length} artikel
          </span>
          <span className="hidden sm:inline-block text-slate-400 italic">
            Fitur pencarian instan bertenaga React
          </span>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-3xl mb-2">🔍</p>
          <h4 className="text-lg font-bold text-slate-700">Tidak ada artikel yang cocok</h4>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Coba gunakan kata kunci lain atau pilih kategori "Semua" untuk melihat seluruh wawasan.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Semua');
            }}
            className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-100 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const isBookmarked = !!bookmarkedIds[article.id];
            return (
              <article
                key={article.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  {article.heroImage ? (
                    <img
                      src={article.heroImage}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-slate-400">
                      🌱
                    </div>
                  )}

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => toggleBookmark(article.id, e)}
                    title={isBookmarked ? 'Hapus bookmark' : 'Simpan untuk nanti'}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                      isBookmarked
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    <svg
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={isBookmarked ? '0' : '2'}
                    >
                      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>

                  {/* Category Pill on Image */}
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border backdrop-blur-md ${getCategoryColor(
                        article.category
                      )}`}
                    >
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <span>{article.pubDate}</span>
                    <span>•</span>
                    <span>{article.readingTime || '5 menit baca'}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mb-2">
                    <a href={`/blog/${article.id}/`} className="focus:outline-none">
                      {article.title}
                    </a>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 flex-1 leading-relaxed">
                    {article.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <a
                      href={`/blog/${article.id}/`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 group-hover:text-emerald-700 group-hover:gap-2 transition-all"
                    >
                      Baca Tulisan
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                    {isBookmarked && (
                      <span className="text-[11px] text-amber-600 font-medium">Tersimpan</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}


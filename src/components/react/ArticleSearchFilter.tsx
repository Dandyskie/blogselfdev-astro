import React, { useState, useMemo } from 'react';

export interface ArticleItem {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  category: string;
  readingTime?: string;
  heroImage?: string;
  author?: string;
}

interface Props {
  initialArticles: ArticleItem[];
}

export default function ArticleSearchFilter({ initialArticles }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  const categories = [
    'Semua',
    'Mindset',
    'Produktivitas',
    'Kesehatan Mental',
    'Finansial',
    'Karir & Relasi',
  ];

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

  return (
    <div className="w-full">
      {/* Search & Category Filter Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Live Search Input */}
          <div className="relative w-full md:w-80">
            <label htmlFor="article-filter-search" className="sr-only">
              Cari arsip tulisan
            </label>
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              id="article-filter-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik atau kata kunci..."
              className="w-full min-h-[44px] pl-10 pr-12 bg-stone-50 border border-stone-200 rounded-md text-stone-900 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:border-stone-900 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 min-w-[44px] flex items-center justify-center text-xs text-stone-400 hover:text-stone-700"
                aria-label="Hapus kata kunci pencarian"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Kategori Tulisan">
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-stone-900 text-stone-50'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter Summary */}
        <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>
            Menampilkan <strong>{filteredArticles.length}</strong> tulisan
            {selectedCategory !== 'Semua' && ` dalam kategori ${selectedCategory}`}
          </span>
          <span className="text-[11px] text-stone-400 hidden sm:inline-block">
            Pencarian instan bertenaga React Island
          </span>
        </div>
      </div>

      {/* Grid of Articles */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
            Indeks Kosong
          </p>
          <h4 className="text-base font-bold text-stone-800">
            Tidak ditemukan tulisan yang cocok
          </h4>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Gunakan kata kunci pencarian yang lebih umum atau kembalikan pilihan ke kategori Semua.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Semua');
            }}
            className="mt-4 min-h-[44px] px-4 py-2 bg-stone-100 text-stone-800 font-medium text-xs rounded-md hover:bg-stone-200 transition-colors"
          >
            Tampilkan Semua Artikel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => {
            const isBookmarked = !!bookmarkedIds[article.id];
            return (
              <article
                key={article.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col hover:border-stone-300 transition-colors"
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-video bg-stone-100 overflow-hidden">
                  {article.heroImage ? (
                    <img
                      src={article.heroImage}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
                      wakeup editorial
                    </div>
                  )}

                  {/* Bookmark Button (44px min tap target) */}
                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(article.id, e)}
                    title={isBookmarked ? 'Batalkan simpan' : 'Simpan bacaan'}
                    aria-label={isBookmarked ? 'Hapus dari daftar simpanan' : 'Simpan artikel ini'}
                    className={`min-w-[44px] min-h-[44px] absolute top-2 right-2 flex items-center justify-center rounded-md transition-colors ${
                      isBookmarked
                        ? 'bg-stone-900 text-stone-50'
                        : 'bg-white/90 text-stone-600 hover:bg-white hover:text-stone-950'
                    }`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isBookmarked ? 0 : 2}>
                      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>

                {/* Article Card Body */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-2.5">
                    <span className="font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                      {article.category}
                    </span>
                    <span>•</span>
                    <span>{article.readingTime || '5 menit baca'}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug mb-2 hover:text-stone-700 transition-colors">
                    <a href={`/blog/${article.id}/`} className="focus:outline-none">
                      {article.title}
                    </a>
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 mb-5 flex-1 leading-relaxed">
                    {article.description}
                  </p>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 mt-auto">
                    <span>{article.author || 'Tim Redaksi'}</span>
                    <a
                      href={`/blog/${article.id}/`}
                      className="font-semibold text-stone-900 hover:text-stone-700 inline-flex items-center gap-1 min-h-[44px] py-2"
                    >
                      <span>Baca Lengkap</span>
                      <span>→</span>
                    </a>
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

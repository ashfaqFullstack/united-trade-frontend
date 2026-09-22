'use client';

import { useState } from 'react';
import {
    FiSearch,
    FiSliders,
    FiGrid,
    FiList,
    FiChevronDown,
    FiX,
} from 'react-icons/fi';

import { useListings } from '@/hooks/useListing';
import ListingCard from './ListingCard';
import Loading from '@/components/ui/Loading';
import MarketplaceFilters from './MarketFilters';
import Pagination from '@/components/layout/Pagination';
import MarketplaceHero from './Hero';
import { BUSINESS_CATEGORIES } from '@/const/const';


const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'priceAsc' },
    { label: 'Price: High to Low', value: 'priceDesc' },
];

export default function MarketplaceGrid() {
    const [filters, setFilters] = useState({});
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    const { data, isLoading } = useListings({
        ...filters,
        search: search || undefined,
        sort,
        page,
        limit: 12,
    });

    const categories = [
        { label: 'All', value: '' },
        ...BUSINESS_CATEGORIES.map((c) => ({ label: c, value: c })),
    ];

    const activeCategory = filters.category || '';

    const handleCategoryChange = (category) => {
        setPage(1);

        setFilters((prev) => ({
            ...prev,
            category: category || undefined,
        }));
    };

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleSort = (value) => {
        setSort(value);
        setPage(1);
    };

    const handleApplyFilters = (newFilters) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
        }));

        setPage(1);
        setMobileFiltersOpen(false);
    };

    const clearAllFilters = () => {
        setFilters({});
        setSearch('');
        setPage(1);
    };

    const resultCount = data?.total ?? data?.totalResults ?? 0;

    return (
        <div className="min-h-screen bg-[#fafcff]">
            {/* Hero */}
            <MarketplaceHero />

            <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">

                {/* =====================================================
                    SEARCH + TOP CONTROLS
                ====================================================== */}
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    {/* Search */}
                    <div className="relative w-full lg:max-w-[520px]">
                        <FiSearch
                            className="absolute left-4 top-1/2 h-[18px] w-[18px]
                            -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search for anything..."
                            className="
                                h-12 w-full rounded-2xl
                                border border-slate-200
                                bg-white
                                pl-11 pr-11
                                text-sm text-slate-800
                                shadow-[0_4px_20px_rgba(15,23,42,0.04)]
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-blue-500
                                focus:ring-4 focus:ring-blue-500/10
                            "
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => handleSearch('')}
                                className="
                                    absolute cursor-pointer right-3 top-1/2
                                    -translate-y-1/2
                                    rounded-full p-1.5
                                    text-slate-400
                                    transition hover:bg-slate-100
                                    hover:text-slate-700
                                "
                            >
                                <FiX size={16} />
                            </button>
                        )}
                    </div>

                    {/* Mobile Filter */}
                    <button
                        type="button"
                        onClick={() => setMobileFiltersOpen(true)}
                        className="
                            flex h-11 cursor-pointer items-center justify-center
                            gap-2 rounded-xl border border-slate-200
                            bg-white px-4 text-sm font-medium
                            text-slate-700 shadow-sm
                            lg:hidden
                        "
                    >
                        <FiSliders size={17} />
                        Filters
                    </button>
                </div>

                {/* =====================================================
                    CATEGORY CHIPS
                ====================================================== */}
                <div className="mb-7 overflow-x-auto pb-1 scrollbar-hide">
                    <div className="flex min-w-max gap-2">
                        {categories.map((category) => {
                            const active =
                                activeCategory === category.value;

                            return (
                                <button
                                    key={category.value || 'all'}
                                    type="button"
                                    onClick={() =>
                                        handleCategoryChange(category.value)
                                    }
                                    className={`
                                        whitespace-nowrap rounded-xl
                                        px-5 py-2.5 text-sm cursor-pointer font-medium
                                        transition-all duration-200
                                        ${active
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'
                                        }
                                    `}
                                >
                                    {category.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* =====================================================
                    MAIN MARKETPLACE AREA
                ====================================================== */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">

                    {/* =================================================
                        DESKTOP FILTER SIDEBAR
                    ================================================== */}
                    <aside className="hidden lg:block">
                        <div className="
                            sticky top-6 overflow-hidden
                            rounded-2xl border border-slate-200
                            bg-white
                            shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                        ">
                            <div className="
                                flex items-center justify-between
                                border-b border-slate-100
                                px-5 py-4
                            ">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">
                                        Filters
                                    </h2>

                                    <p className="mt-0.5 text-xs text-slate-400">
                                        Refine your search
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={clearAllFilters}
                                    className="
                                        text-xs cursor-pointer font-medium
                                        text-blue-600
                                        transition hover:text-blue-700
                                    "
                                >
                                    Clear All
                                </button>
                            </div>

                            <div className="p-4">
                                <MarketplaceFilters
                                    onApply={handleApplyFilters}
                                />
                            </div>

                            {/* Sell CTA */}
                            <div className="m-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white">
                                <div className="
                                    mb-3 flex h-10 w-10
                                    items-center justify-center
                                    rounded-xl bg-white/15
                                ">
                                    <FiGrid size={19} />
                                </div>

                                <h3 className="text-sm font-bold">
                                    Start Your Own Listing
                                </h3>

                                <p className="mt-1 text-xs leading-5 text-blue-100">
                                    Turn your unused items into something valuable.<br />
                                    Trade with your skillset.
                                </p>

                                <button
                                    type="button"
                                    className="
                                        mt-4 w-full cursor-pointer rounded-xl
                                        bg-white py-2.5
                                        text-xs font-bold
                                        text-blue-600
                                        transition hover:bg-blue-50
                                    "
                                >
                                    + Add Listing
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* =================================================
                        RESULTS
                    ================================================== */}
                    <section className="min-w-0">

                        {/* Results toolbar */}
                        <div className="
                            mb-5 flex flex-col gap-3
                            sm:flex-row sm:items-center
                            sm:justify-between
                        ">
                            <div>
                                {/* <h1 className="
                                    text-xl font-bold
                                    tracking-tight text-slate-900
                                ">
                                    Marketplace
                                </h1> */}

                                <p className="mt-1 text-sm text-slate-500">
                                    {isLoading
                                        ? 'Finding the best listings...'
                                        : resultCount
                                            ? `Showing ${data?.results?.length || 0} of ${resultCount} results`
                                            : 'Discover items from our community'}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">

                                {/* Sort */}
                                <div className="relative">
                                    <select
                                        value={sort}
                                        onChange={(e) =>
                                            handleSort(e.target.value)
                                        }
                                        className="
                                            h-10 appearance-none
                                            rounded-xl border
                                            border-slate-200
                                            bg-white
                                            py-2 pl-3 pr-9
                                            text-xs font-medium
                                            text-slate-600
                                            outline-none
                                            transition
                                            focus:border-blue-500
                                        "
                                    >
                                        {sortOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>

                                    <FiChevronDown
                                        className="
                                            pointer-events-none
                                            absolute right-3 top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                        "
                                        size={14}
                                    />
                                </div>

                                {/* View switcher */}
                                {/* <div className="
                                    hidden h-10 items-center
                                    rounded-xl border border-slate-200
                                    bg-white p-1 sm:flex
                                ">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('grid')}
                                        className={`
                                            flex h-8 w-8 items-center
                                            justify-center rounded-lg
                                            transition
                                            ${viewMode === 'grid'
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-slate-400 hover:text-slate-700'
                                            }
                                        `}
                                    >
                                        <FiGrid size={16} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setViewMode('list')}
                                        className={`
                                            flex h-8 w-8 items-center
                                            justify-center rounded-lg
                                            transition
                                            ${viewMode === 'list'
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-slate-400 hover:text-slate-700'
                                            }
                                        `}
                                    >
                                        <FiList size={16} />
                                    </button>
                                </div> */}
                            </div>
                        </div>

                        {/* =================================================
                            LISTINGS
                        ================================================== */}
                        {isLoading ? (
                            <div className="
                                flex min-h-[400px]
                                items-center justify-center
                                rounded-2xl border border-slate-200
                                bg-white
                            ">
                                <Loading />
                            </div>
                        ) : !data?.results?.length ? (
                            <EmptyState
                                search={search}
                                onClear={clearAllFilters}
                            />
                        ) : (
                            <>
                                <div
                                    className={
                                        viewMode === 'grid'
                                            ? `
                                                grid grid-cols-2 gap-3
                                                sm:grid-cols-2
                                                xl:grid-cols-4
                                            `
                                            : `
                                                grid grid-cols-1 gap-4
                                            `
                                    }
                                >
                                    {data.results.map((listing) => (
                                        <ListingCard
                                            key={listing.id}
                                            listing={listing}
                                            mode="public"
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {data.totalPages > 1 && (
                                    <div className="
                                        mt-8 flex justify-center
                                        rounded-2xl border
                                        border-slate-100
                                        bg-white px-3 py-2
                                    ">
                                        <Pagination
                                            page={data.page}
                                            totalPages={data.totalPages}
                                            onPageChange={setPage}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </div>
            </main>

            {/* =========================================================
                MOBILE FILTER DRAWER
            ========================================================== */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">

                    {/* Overlay */}
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={() => setMobileFiltersOpen(false)}
                        className="
                            absolute cursor-pointer inset-0
                            bg-slate-950/40
                            backdrop-blur-sm
                        "
                    />

                    {/* Drawer */}
                    <div className="
                        absolute bottom-0 left-0 right-0
                        max-h-[88vh] overflow-y-auto
                        rounded-t-3xl bg-white
                        shadow-2xl
                    ">
                        <div className="
                            sticky top-0 z-10
                            flex items-center justify-between
                            border-b border-slate-100
                            bg-white px-5 py-4
                        ">
                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Filters
                                </h2>

                                <p className="text-xs text-slate-400">
                                    Refine marketplace results
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setMobileFiltersOpen(false)
                                }
                                className="
                                    flex h-9 w-9 items-center
                                    justify-center cursor-pointer rounded-full
                                    bg-slate-100 text-slate-600
                                "
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <div className="p-5">
                            <MarketplaceFilters
                                onApply={handleApplyFilters}
                            />

                            <button
                                type="button"
                                onClick={clearAllFilters}
                                className="
                                    mt-5 w-full cursor-pointer rounded-xl
                                    border border-slate-200
                                    py-3 text-sm font-semibold
                                    text-slate-600
                                "
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* =============================================================
   EMPTY STATE
============================================================= */

function EmptyState({
    search,
    onClear,
}) {
    return (
        <div className="
            flex min-h-[420px]
            flex-col items-center justify-center
            rounded-2xl border border-slate-200
            bg-white px-6 text-center
        ">
            <div className="
                flex h-16 w-16 items-center
                justify-center rounded-2xl
                bg-blue-50 text-blue-600
            ">
                <FiSearch size={25} />
            </div>

            <h3 className="
                mt-5 text-lg font-bold
                text-slate-900
            ">
                No listings found
            </h3>

            <p className="
                mt-2 max-w-sm
                text-sm leading-6
                text-slate-500
            ">
                {search
                    ? `We couldn't find anything matching "${search}".`
                    : 'Try adjusting your filters to discover more listings.'}
            </p>

            <button
                type="button"
                onClick={onClear}
                className="
                    mt-5 rounded-xl
                    bg-blue-600 px-5 py-2.5
                    text-sm font-semibold text-white
                    shadow-lg shadow-blue-600/20
                    transition cursor-pointer hover:bg-blue-700
                "
            >
                Clear Filters
            </button>
        </div>
    );
}
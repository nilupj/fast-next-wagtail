import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center">
        <div className="relative w-full">
          <input
            type="text"
            className="bg-white/10 text-white placeholder-white/70 text-sm rounded-md pl-10 pr-4 py-1.5 w-full md:w-40 lg:w-48 focus:outline-none focus:ring-1 focus:ring-white/50"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg 
              className="w-4 h-4 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
        </div>
        <button 
          type="submit" 
          className="sr-only"
        >
          Search
        </button>
      </div>
    </form>
  );
}

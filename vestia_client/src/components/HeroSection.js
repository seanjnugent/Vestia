import { Search
} from 'lucide-react';

const HeroSection = ({ searchTerm, setSearchTerm }) => (
    <div className="relative h-96 rounded-lg overflow-hidden mb-12">
      <div className="relative z-20 h-full flex flex-col justify-center p-12">
        <h1 className="text-6xl font-bold mb-4" style={{ color: '#1e90a7' }}>
          Research Dashboard
        </h1>
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search stocks, ETFs, news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-full bg-black/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" />
        </div>
      </div>
    </div>
  );

export default HeroSection
const NewsCard = ({ news }) => (
    <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
      <h3 className="font-bold text-xl mb-4 text-white">{news.title}</h3>
      <div className="flex justify-between text-sm text-gray-400">
        <span>{news.source.name}</span>
        <span>{new Date(news.publishedAt).toLocaleTimeString()}</span>
      </div>
    </div>
  );
  
  export default NewsCard
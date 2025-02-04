// Components/MarketMoverCard.jsx
const MarketMoverCard = ({ stock }) => (
    <div className="min-w-[280px] bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-xl mb-1 text-white">{stock.name}</h4>
          <p className="text-gray-400">{stock.symbol}</p>
        </div>
        <div className="text-right">
          <p className={`font-bold text-lg ${stock.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {stock.change}
          </p>
          <p className="text-gray-300">{stock.price}</p>
        </div>
      </div>
    </div>
  );
  
  export default MarketMoverCard
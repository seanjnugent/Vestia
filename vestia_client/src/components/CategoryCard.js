import { Link } from 'react-router-dom';

const CategoryCard = ({ category, isHovered, onHover, onLeave }) => (
    <Link 
      to={category.link}
      className="relative group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className={`relative h-48 rounded-lg overflow-hidden transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${category.bgColor} opacity-75`} />
        <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
          <div className="text-white">{category.icon}</div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-white">{category.title}</h3>
            <p className="text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {category.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );

  
export default CategoryCard
const ActionButton = ({ icon: Icon, title, description, onClick }) => (
    <motion.button
        whileHover={{ scale: 1.05, backgroundColor: '#c2f2ea' }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="flex items-center p-5 rounded-2xl bg-white shadow-md border border-gray-100 w-full max-w-full transition-all duration-300"
        style={{ border: '1px solid #38d6b7' }}
    >
        <Icon className="text-[#38d6b7] w-7 h-7 mr-4 transition-transform" />
        <div className="flex-grow text-left">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <ArrowUpRight className="text-gray-400 w-5 h-5" />
    </motion.button>
);

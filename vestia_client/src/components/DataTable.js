const DataTable = ({ data, columns }) => (
    <table className="w-full rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-100">
            <tr>
                {columns.map((col) => (
                    <th key={col.key} className="p-4 text-left font-medium text-gray-600">
                        {col.label}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {data.map((row, index) => (
                <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border-b hover:bg-gray-50 transition-all"
                >
                    {columns.map((col) => (
                        <td key={col.key} className="p-4 text-gray-700">
                            {row[col.key]}
                        </td>
                    ))}
                </motion.tr>
            ))}
        </tbody>
    </table>
);

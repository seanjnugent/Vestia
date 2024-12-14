import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { useNavigate } from "react-router-dom";

// Mock trade data
const trades = [
  {
    date: '2024-12-12',
    type: 'Buy',
    account: 'Investment Account',
    status: 'Completed',
    instrumentCode: 'GOOGL',
    units: 10,
    sum: '£1,500',
  },
  {
    date: '2024-12-11',
    type: 'Sell',
    account: 'Savings Account',
    status: 'Pending',
    instrumentCode: 'BABA',
    units: 5,
    sum: '£800',
  },
  {
    date: '2024-12-10',
    type: 'Buy',
    account: 'Investment Account',
    status: 'Completed',
    instrumentCode: 'AAPL',
    units: 15,
    sum: '£2,200',
  },
];

const Trades = () => {
  const data = useMemo(() => trades, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Account',
        accessor: 'account',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Instrument Code',
        accessor: 'instrumentCode',
      },
      {
        Header: 'Units',
        accessor: 'units',
      },
      {
        Header: 'Sum',
        accessor: 'sum',
      },
    ],
    []
  );

  // Define default column properties for any column that might need them
  const defaultColumn = useMemo(() => ({
    // Default filter method: a simple filter that checks if the value includes the query string
    Filter: ({ column }) => {
      return (
        <input
          type="text"
          value={column.filterValue || ''}
          onChange={(e) => column.setFilter(e.target.value)}
          placeholder={`Search ${column.id}`}
          className="p-2 border rounded-md"
        />
      );
    },
  }), []);

  const tableInstance = useTable(
    { columns, data, defaultColumn },
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Trades</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          onClick={() => navigate("/new-trade")}
        >
          New Trade
        </button>
      </div>

      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="min-w-full bg-white shadow-md rounded-lg"
        >
          <thead className="bg-gray-100">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="p-4 text-left font-medium text-gray-600 cursor-pointer"
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                    {/* Display the filter if it's available */}
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="hover:bg-blue-50 border-b last:border-0"
                >
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="p-4 text-gray-700">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trades;

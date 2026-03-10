const Table = ({ headers, children }) => {
    return (
        <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
            <table className="w-full text-left whitespace-nowrap">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="py-4 px-6 text-xs font-semibold tracking-wide text-gray-500 uppercase"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {children}
                </tbody>
            </table>
        </div>
    );
};

export default Table;

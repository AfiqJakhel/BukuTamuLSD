const InputField = ({ label, type = 'text', placeholder, value, onChange, required = false }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-gray-400"
            />
        </div>
    );
};

export default InputField;

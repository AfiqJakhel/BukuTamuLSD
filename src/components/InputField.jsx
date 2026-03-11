import { forwardRef } from 'react';

const InputField = forwardRef(({ label, type = 'text', placeholder, value, onChange, required = false, icon: Icon, ...props }, ref) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="text-sm font-semibold text-gray-700 ml-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none">
                        <Icon size={20} />
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white placeholder-gray-400 shadow-sm`}
                    {...props}
                />
            </div>
        </div>
    );
});

InputField.displayName = 'InputField';

export default InputField;

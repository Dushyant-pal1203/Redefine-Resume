// ui/button.jsx
export function Button({
    children,
    variant = "default",
    size = "md",
    className = "",
    ...props
}) {
    const base = "font-semibold rounded-lg transition-all duration-200";

    const variants = {
        default: "bg-gray-700 hover:bg-gray-600 text-white",
        primary: "bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white",
        secondary: "border border-cyan-500 text-cyan-300 hover:bg-cyan-500/10",
        ghost: "text-gray-300 hover:text-white hover:bg-gray-800"
    };

    const sizes = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg"
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
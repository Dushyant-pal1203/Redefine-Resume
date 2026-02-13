"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";

const Card = forwardRef(({
    children,
    className = "",
    variant = "default", // default, elevated, outlined, gradient
    padding = "md", // none, sm, md, lg
    hover = false,
    animate = false,
    onClick,
    ...props
}, ref) => {
    // Base classes
    const baseClasses = "relative rounded-2xl bg-gradient-to-br from-gray-900 to-black border transition-all duration-300";

    // Variant classes
    const variantClasses = {
        default: "border-gray-800",
        elevated: "border-gray-800 shadow-lg shadow-purple-500/5",
        outlined: "border-2 border-purple-500/30 bg-transparent",
        gradient: "border-transparent bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm",
    };

    // Padding classes
    const paddingClasses = {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
    };

    // Hover classes
    const hoverClasses = hover
        ? "hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer"
        : "";

    // Combine all classes
    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`;

    // Animation variants
    const animationVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9 },
        hover: hover ? { y: -5 } : {},
    };

    const Component = animate ? motion.div : 'div';

    const animationProps = animate ? {
        initial: "initial",
        animate: "animate",
        exit: "exit",
        whileHover: hover ? "hover" : undefined,
        variants: animationVariants,
        transition: { duration: 0.3 },
    } : {};

    return (
        <Component
            ref={ref}
            className={combinedClasses}
            onClick={onClick}
            {...animationProps}
            {...props}
        >
            {/* Glow effect for hover */}
            {hover && (
                <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500 -z-10" />
            )}

            {children}
        </Component>
    );
});

Card.displayName = "Card";

// Card Header Component
const CardHeader = forwardRef(({
    children,
    className = "",
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={`flex items-center justify-between mb-4 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
});

CardHeader.displayName = "CardHeader";

// Card Title Component
const CardTitle = forwardRef(({
    children,
    className = "",
    as: Component = "h3",
    gradient = false,
    ...props
}, ref) => {
    const baseClasses = "font-semibold text-white";
    const gradientClasses = gradient
        ? "group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400"
        : "";

    return (
        <Component
            ref={ref}
            className={`${baseClasses} ${gradientClasses} ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
});

CardTitle.displayName = "CardTitle";

// Card Description Component
const CardDescription = forwardRef(({
    children,
    className = "",
    ...props
}, ref) => {
    return (
        <p
            ref={ref}
            className={`text-sm text-gray-400 ${className}`}
            {...props}
        >
            {children}
        </p>
    );
});

CardDescription.displayName = "CardDescription";

// Card Content Component
const CardContent = forwardRef(({
    children,
    className = "",
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={`space-y-3 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
});

CardContent.displayName = "CardContent";

// Card Footer Component
const CardFooter = forwardRef(({
    children,
    className = "",
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={`flex items-center justify-between mt-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
});

CardFooter.displayName = "CardFooter";

// Card Icon Component
const CardIcon = forwardRef(({
    children,
    className = "",
    variant = "default", // default, gradient, outline
    size = "md", // sm, md, lg
    ...props
}, ref) => {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
    };

    const variantClasses = {
        default: "bg-gray-800/50",
        gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30",
        outline: "border border-purple-500/30 bg-transparent",
    };

    return (
        <div
            ref={ref}
            className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-xl flex items-center justify-center ${className}`}
            {...props}
        >
            {children}
        </div>
    );
});

CardIcon.displayName = "CardIcon";

// Card Badge Component
const CardBadge = forwardRef(({
    children,
    className = "",
    color = "purple", // purple, pink, blue, green, yellow, red, gray
    ...props
}, ref) => {
    const colorClasses = {
        purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        pink: "bg-pink-500/20 text-pink-400 border-pink-500/30",
        blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        green: "bg-green-500/20 text-green-400 border-green-500/30",
        yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        red: "bg-red-500/20 text-red-400 border-red-500/30",
        gray: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };

    return (
        <span
            ref={ref}
            className={`px-2.5 py-1 text-xs font-medium rounded-full border ${colorClasses[color]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
});

CardBadge.displayName = "CardBadge";

// Card Grid Component
const CardGrid = forwardRef(({
    children,
    className = "",
    columns = {
        default: 1,
        sm: 2,
        md: 3,
        lg: 4
    },
    gap = "md",
    ...props
}, ref) => {
    const gapClasses = {
        none: "gap-0",
        sm: "gap-4",
        md: "gap-6",
        lg: "gap-8",
    };

    const gridClasses = `
    grid 
    grid-cols-${columns.default || 1}
    sm:grid-cols-${columns.sm || 2}
    md:grid-cols-${columns.md || 3}
    lg:grid-cols-${columns.lg || 4}
    ${gapClasses[gap]}
  `;

    return (
        <div
            ref={ref}
            className={`${gridClasses} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
});

CardGrid.displayName = "CardGrid";

// Card Group Component
const CardGroup = forwardRef(({
    children,
    className = "",
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={`space-y-4 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
});

CardGroup.displayName = "CardGroup";

// Export all card components
export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    CardIcon,
    CardBadge,
    CardGrid,
    CardGroup,
};
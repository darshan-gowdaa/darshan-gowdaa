// src/components/atoms/NeonButton.jsx
import React from 'react';

const variants = {
    default: "bg-white/5 hover:bg-white/10 border-white/20 text-white hover:border-white/40",
    solid: "bg-white hover:bg-gray-200 text-black border-transparent hover:border-white/50",
    ghost: "border-transparent bg-transparent hover:border-zinc-600 hover:bg-white/10 text-white",
};

const sizes = {
    default: "px-7 py-2",
    sm: "px-4 py-1",
    lg: "px-10 py-3",
};

const NeonButton = React.forwardRef(
    ({ className = '', neon = true, size = 'default', variant = 'default', children, href, ...props }, ref) => {
        const Comp = href ? 'a' : 'button';
        
        const baseClasses = "relative group border text-foreground mx-auto text-center rounded-full cursor-pointer inline-flex items-center justify-center transition-all duration-300 ease-out transform active:scale-95";
        const variantClass = variants[variant] || variants.default;
        const sizeClass = sizes[size] || sizes.default;
        const finalClasses = `${baseClasses} ${variantClass} ${sizeClass} ${className}`.trim();
        
        const neonTopClasses = "absolute pointer-events-none h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white to-transparent " + (neon ? "block" : "hidden");
        const neonBottomClasses = "absolute pointer-events-none group-hover:opacity-30 opacity-0 transition-opacity duration-500 ease-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-white to-transparent " + (neon ? "block" : "hidden");

        return (
            <Comp
                className={finalClasses}
                ref={ref}
                href={href}
                {...props}
            >
                <span className={neonTopClasses} />
                {children}
                <span className={neonBottomClasses} />
            </Comp>
        );
    }
);

NeonButton.displayName = 'NeonButton';

export { NeonButton };

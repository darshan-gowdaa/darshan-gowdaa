import React from 'react';
import { cn } from '../../lib/utils';
import { cva } from "class-variance-authority";

const buttonVariants = cva(
    "relative group border text-foreground mx-auto text-center rounded-full cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-white/5 hover:bg-white/10 border-white/20 text-white",
                solid: "bg-white hover:bg-gray-200 text-black border-transparent hover:border-white/50 transition-all duration-200",
                ghost: "border-transparent bg-transparent hover:border-zinc-600 hover:bg-white/10 text-white",
            },
            size: {
                default: "px-7 py-2",
                sm: "px-4 py-1",
                lg: "px-10 py-3",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const NeonButton = React.forwardRef(
    ({ className, neon = true, size, variant, children, href, ...props }, ref) => {
        const Comp = href ? 'a' : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size }), "inline-flex items-center justify-center", className)}
                ref={ref}
                href={href}
                {...props}
            >
                <span className={cn("absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 inset-y-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white to-transparent hidden", neon && "block")} />
                {children}
                <span className={cn("absolute group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-white to-transparent hidden", neon && "block")} />
            </Comp>
        );
    }
);

NeonButton.displayName = 'NeonButton';

export { NeonButton, buttonVariants };

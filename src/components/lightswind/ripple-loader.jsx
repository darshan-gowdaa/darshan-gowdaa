import React from "react";
import { motion } from "framer-motion";

const RippleLoader = ({
    icon,
    size = 250,
    duration = 2.5,
    logoColor = "grey",
}) => {
    const baseInset = 40;
    const rippleBoxes = Array.from({ length: 5 }, (_, i) => ({
        inset: `${baseInset - i * 10}%`,
        zIndex: 99 - i,
        delay: i * 0.2,
        opacity: 1 - i * 0.2,
    }));

    return (
        <div
            className="relative"
            style={{ width: size, height: size }}
        >
            {rippleBoxes.map((box, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full border-t backdrop-blur-[5px]"
                    style={{
                        inset: box.inset,
                        zIndex: box.zIndex,
                        borderColor: `rgba(100,100,100,${box.opacity})`,
                        background:
                            "linear-gradient(0deg, rgba(50, 50, 50, 0.2), rgba(100, 100, 100, 0.2))",
                    }}
                    animate={{
                        scale: [1, 1.3, 1],
                        boxShadow: [
                            "rgba(0, 0, 0, 0.3) 0px 10px 10px 0px",
                            "rgba(0, 0, 0, 0.3) 0px 30px 20px 0px",
                            "rgba(0, 0, 0, 0.3) 0px 10px 10px 0px",
                        ],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration,
                        delay: box.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}

            <div className="absolute inset-0 grid place-content-center p-[30%]">
                <motion.div
                    className="w-full h-full flex items-center justify-center rounded-full overflow-hidden"
                    animate={{
                        boxShadow: [
                            "0 0 0px rgba(255,255,255,0)",
                            "0 0 20px rgba(255,255,255,0.2)",
                            "0 0 0px rgba(255,255,255,0)"
                        ]
                    }}
                    transition={{
                        repeat: Infinity,
                        duration,
                        ease: "easeInOut",
                    }}
                >
                    {icon ? (
                        <div className="w-full h-full relative">
                            {/* Ensure image fits circle */}
                            {React.cloneElement(icon, {
                                className: "w-full h-full object-cover rounded-full"
                            })}
                        </div>
                    ) : (
                        <span
                            className="w-full h-full"
                            style={{ display: "inline-block", width: "100%", height: "100%", backgroundColor: logoColor }}
                        />
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default RippleLoader;

"use client";
import React from "react";
import { motion } from "motion/react";



const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div 
      onMouseEnter={() => setActive(item)} 
      onClick={() => setActive(active === item ? null : item)}
      className="relative"
    >
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-[#2b2b2b] hover:text-[#4A90E2] text-sm md:text-base font-medium"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="fixed md:absolute top-[70px] md:top-[calc(100%_+_1.2rem)] left-0 md:left-1/2 right-0 md:right-auto md:-translate-x-1/2 pt-4 z-[100] px-4 md:px-0">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white backdrop-blur-sm rounded-2xl overflow-hidden border border-[#c8e6c9] shadow-xl max-h-[60vh] md:max-h-[70vh] overflow-y-auto"
              >
                <motion.div
                  layout
                  className="w-full md:w-max md:max-w-none h-full p-3 md:p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className="relative rounded-full border border-transparent bg-white shadow-input flex items-center justify-center space-x-3 md:space-x-6 px-4 md:px-6 py-3 "
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <a href={href} className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3 group">
      <img
        src={src}
        width={120}
        height={80}
        alt={title}
        className="w-full md:w-[120px] h-[120px] md:h-[80px] object-cover shrink-0 rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
      />
      <div className="flex-1">
        <h4 className="text-base md:text-lg font-bold mb-1 text-[#2b2b2b] line-clamp-1">
          {title}
        </h4>
        <p className="text-[#5f5f5f] text-xs md:text-sm line-clamp-2">
          {description}
        </p>
      </div>
    </a>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <a
      {...rest}
      className="text-[#5f5f5f] hover:text-[#4A90E2] transition-colors"
    >
      {children}
    </a>
  );
};

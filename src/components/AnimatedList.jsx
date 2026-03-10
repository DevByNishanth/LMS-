import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const AnimatedList = ({
    items = [],
    children,
    onItemSelect,
    showGradients = false,
    enableArrowNavigation = true,
    displayScrollbar = true,
    className = ""
}) => {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const listRef = useRef(null);

    useEffect(() => {
        if (!enableArrowNavigation) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev < items.length - 1 ? prev + 1 : prev));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === 'Enter' && selectedIndex >= 0) {
                e.preventDefault();
                if (onItemSelect) onItemSelect(items[selectedIndex], selectedIndex);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enableArrowNavigation, items, selectedIndex, onItemSelect]);

    return (
        <div className={`relative ${className}`}>
            {showGradients && (
                <>
                    <div className="absolute top-0 left-0 right-0 h-8 bg-linear-to-b from-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-white to-transparent z-10 pointer-events-none" />
                </>
            )}
            <div
                ref={listRef}
                className={`max-h-[calc(100vh-140px)] overflow-y-auto pr-2 ${!displayScrollbar ? 'scrollbar-hide' : ''}`}
                style={{ scrollbarWidth: displayScrollbar ? 'auto' : 'none' }}
            >
                <AnimatePresence>
                    {items.map((item, index) => (
                        <motion.div
                            key={`${item.id || item}-${index}`}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05, duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                            onClick={() => {
                                setSelectedIndex(index);
                                if (onItemSelect) onItemSelect(item, index);
                            }}
                            className={`${selectedIndex === index ? 'border-blue-500! shadow-md!' : ''} cursor-pointer`}
                        >
                            {typeof children === 'function' ? children(item, index) : (
                                <div className="p-4 border-b border-gray-200">
                                    {typeof item === 'string' ? item : JSON.stringify(item)}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AnimatedList;

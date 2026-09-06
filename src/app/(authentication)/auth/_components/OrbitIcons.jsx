'use client';

import { motion } from 'framer-motion';
import { LuCamera, LuHeadphones, LuLeaf, LuBookOpen, LuMusic, LuArrowLeftRight } from 'react-icons/lu';

const icons = [
    { Icon: LuCamera, className: 'left-2 bottom-6' },
    { Icon: LuHeadphones, className: 'right-4 top-2' },
    { Icon: LuLeaf, className: 'left-6 top-0' },
    { Icon: LuBookOpen, className: 'right-2 bottom-2' },
];

const float = {
    animate: (i) => ({
        y: [0, -8, 0],
        transition: { duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' },
    }),
};

export default function OrbitIcons() {
    return (
        <div className="relative h-56 w-56 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/30" />

            <motion.div
                className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
                <LuArrowLeftRight className="h-6 w-6 text-indigo-600" />
            </motion.div>

            {icons.map(({ Icon, className }, i) => (
                <motion.div
                    key={i}
                    custom={i}
                    variants={float}
                    animate="animate"
                    className={`absolute flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md ${className}`}
                >
                    <Icon className="h-5 w-5 text-indigo-600" />
                </motion.div>
            ))}
        </div>
    );
}
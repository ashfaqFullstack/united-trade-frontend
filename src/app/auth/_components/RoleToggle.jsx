'use client';

import { motion } from 'framer-motion';
import {
    LuUser,
    LuStore,
    LuCheck,
    LuArrowLeftRight,
    LuUsers,
    LuPackage,
} from 'react-icons/lu';

const roles = [
    {
        id: 'CUSTOMER',
        title: 'Customer',
        description: 'Trade & discover',
        icon: LuUser,
        features: [
            {
                icon: LuArrowLeftRight,
                text: 'Trade',
            },
            {
                icon: LuUsers,
                text: 'Connect',
            },
        ],
    },
    {
        id: 'BUSINESS',
        title: 'Business',
        description: 'Grow through barter',
        icon: LuStore,
        features: [
            {
                icon: LuPackage,
                text: 'Offer',
            },
            {
                icon: LuUsers,
                text: 'Reach',
            },
        ],
    },
];

export default function RoleToggle({ role, setRole }) {
    return (
        <div className="pt-2">

            <div className="grid grid-cols-1 md:grid-cols-2 mb-4 md:mb-0 gap-3">
                {roles.map((item) => {
                    const isActive = role === item.id;
                    const Icon = item.icon;

                    return (
                        <motion.button
                            key={item.id}
                            type="button"
                            onClick={() => setRole(item.id)}
                            whileTap={{ scale: 0.98 }}
                            className={`relative cursor-pointer overflow-hidden rounded-2xl border p-3.5 text-left transition-all duration-200 ${isActive
                                ? 'border-indigo-500 bg-indigo-50/60 shadow-sm'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${isActive
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-500'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                </div>

                                <div
                                    className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all ${isActive
                                        ? 'border-indigo-600 bg-indigo-600 text-white'
                                        : 'border-slate-300'
                                        }`}
                                >
                                    {isActive && (
                                        <LuCheck className="h-2.5 w-2.5" />
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mt-3">
                                <h4
                                    className={`text-sm font-bold ${isActive
                                        ? 'text-indigo-700'
                                        : 'text-slate-800'
                                        }`}
                                >
                                    {item.title}
                                </h4>

                                <p className="mt-0.5 text-[10px] text-slate-400">
                                    {item.description}
                                </p>
                            </div>

                            {/* Features */}
                            <div className="mt-3 flex gap-1.5">
                                {item.features.map((feature) => {
                                    const FeatureIcon = feature.icon;

                                    return (
                                        <span
                                            key={feature.text}
                                            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[9px] font-medium ${isActive
                                                ? 'bg-white text-indigo-500'
                                                : 'bg-slate-100 text-slate-400'
                                                }`}
                                        >
                                            <FeatureIcon className="h-2.5 w-2.5" />
                                            {feature.text}
                                        </span>
                                    );
                                })}
                            </div>

                            {/* Active line */}
                            {isActive && (
                                <motion.div
                                    layoutId="active-role"
                                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-indigo-600"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 450,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
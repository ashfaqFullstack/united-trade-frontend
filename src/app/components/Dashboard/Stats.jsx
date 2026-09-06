'use client';

import { motion } from 'framer-motion';

export default function DashboardStats({ stats = [] }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                    <motion.div
                        key={stat.label}
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.4,
                            delay: index * 0.08,
                        }}
                        whileHover={{
                            y: -3,
                        }}
                        className="
                            group rounded-2xl
                            border border-slate-100
                            bg-white p-5
                            shadow-sm
                            transition-shadow
                            hover:shadow-lg
                            hover:shadow-slate-200/50
                        "
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    {stat.label}
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                                    {stat.value}
                                </h3>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
                                <Icon className="h-5 w-5" />
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
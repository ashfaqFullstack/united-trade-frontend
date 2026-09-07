import { Work_steps } from "@/const/const";
import { FaArrowRight } from "react-icons/fa";



export default function HowItWorks() {
    return (
        <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-5xl px-6 text-center">
                <span className="inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-medium text-indigo-600">
                    Simple Steps
                </span>

                <h2 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
                    How It Works
                </h2>

                <div className="mt-14 flex flex-col items-start gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    {Work_steps.map((step, index) => (
                        <div key={step.number} className="flex w-full items-center justify-center">
                            <div
                                className="group flex-1 cursor-pointer rounded-2xl border border-transparent p-5 transition-all duration-300 ease-out hover:border-slate-200 hover:bg-slate-50/60"
                            >
                                <div className="flex flex-col items-center md:items-start text-left sm:items-center sm:text-center">
                                    <div className="flex items-center gap-3 sm:flex-col sm:gap-3">
                                        <span className={`text-xs font-bold ${step.numberColor} sm:order-1`}>
                                            {step.number}
                                        </span>
                                        <div
                                            className={`flex h-14 w-14 items-center justify-center rounded-full ${step.iconBg} transition-transform duration-300 ease-out group-hover:scale-105 sm:order-2`}
                                        >
                                            {step.icon}
                                        </div>
                                    </div>

                                    <h3 className="mt-4 text-base font-semibold text-slate-900">
                                        {step.title}
                                    </h3>
                                    <p className="text-center md:text-start  mt-2 max-w-[220px] text-sm leading-relaxed text-slate-500">
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {/* Connector arrow — desktop only, not after last step */}
                            {index < Work_steps.length - 1 && (
                                <div className="mt-6 hidden shrink-0 items-center px-2 sm:flex">
                                    <FaArrowRight className="h-4 w-4 text-slate-300" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}



import { features } from "@/const/const";
import Image from "next/image";



export default function WhySection() {
    return (
        <section className="bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20">
            <div className="mx-auto max-w-5xl px-6 text-center">
                <span className="inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-medium text-indigo-600">
                    The Smarter Way
                </span>

                <h2 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
                    Why buy when you can <span className="text-indigo-600">trade</span>?
                </h2>

                <p className="mx-auto mt-4 max-w-lg text-sm text-slate-500 sm:text-base">
                    You have things you don&apos;t need anymore. Someone else might have
                    exactly what you&apos;re looking for.
                </p>

                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/50"
                        >
                            <div
                                className={`flex p-2 h-12 w-12 items-center justify-center rounded-full ${feature.iconBg} transition-transform duration-300 ease-out group-hover:scale-110`}
                            >
                                <Image
                                    src={feature.icon}
                                    alt={feature.title}
                                    width={44}
                                    height={44}
                                    className="object-contain"
                                />
                            </div>

                            <h3 className="mt-4 text-base font-semibold text-slate-900">
                                {feature.title}
                            </h3>

                            <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
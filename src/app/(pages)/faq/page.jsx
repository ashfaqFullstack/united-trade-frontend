"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    FiArrowRight,
    FiCheck,
    FiChevronDown,
    FiClock,
    FiMail,
    FiMessageCircle,
    FiShield,
} from "react-icons/fi";

/* =========================================================
   FAQ DATA
========================================================= */

const faqs = [
    {
        question: "How do I create an account?",
        answer:
            "Creating an account is quick and simple. Click the Sign Up button, enter your details and verify your email address. Once completed, you can immediately start using the platform.",
    },
    {
        question: "What are the trading fees?",
        answer:
            "Our fees depend on the service and transaction type you choose. You can review the applicable pricing before completing a transaction, with no unexpected charges.",
    },
    {
        question: "Which payment methods do you accept?",
        answer:
            "We support several commonly used payment methods. Available options may vary depending on your location and the service you are using.",
    },
    {
        question: "Is my money safe and secure?",
        answer:
            "Security is a core part of our platform. We use modern security practices and protective measures to help keep your account and information secure.",
    },
    {
        question: "Can I use the platform on my mobile device?",
        answer:
            "Yes. The platform is designed to work smoothly across desktop, tablet and mobile devices, allowing you to access your account wherever you are.",
    },
    {
        question: "How long does it take to get started?",
        answer:
            "Getting started is quick and easy. Once you complete the registration process and verify your information, you can begin using the platform within just a few minutes.",
    },
];

/* =========================================================
   HERO SVG
========================================================= */

function HeroIllustration() {
    return (
        <svg
            viewBox="0 0 620 380"
            className="h-auto w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {/* Background blob */}
            <path
                d="M102 166C103 97 177 48 249 72C309 92 348 38 416 62C494 89 543 150 511 222C481 290 410 307 339 285C279 266 232 307 169 281C113 258 101 216 102 166Z"
                fill="#E7EFFF"
            />

            {/* Decorative lines */}
            <motion.path
                d="M177 83L165 61"
                stroke="#3567F5"
                strokeWidth="8"
                strokeLinecap="round"
                animate={{ y: [0, -5, 0] }}
                transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.path
                d="M153 105L128 92"
                stroke="#3567F5"
                strokeWidth="8"
                strokeLinecap="round"
                animate={{ x: [0, -5, 0] }}
                transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.path
                d="M499 78L511 55"
                stroke="#3567F5"
                strokeWidth="8"
                strokeLinecap="round"
                animate={{ y: [0, -5, 0] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Question bubble shadow */}
            <path
                d="M221 105C221 84 238 67 259 67H378C399 67 416 84 416 105V191C416 212 399 229 378 229H355L341 253C338 258 330 258 327 253L312 229H259C238 229 221 212 221 191V105Z"
                fill="#B7C9F8"
                opacity=".45"
            />

            {/* Question bubble */}
            <path
                d="M207 93C207 70 226 51 249 51H369C392 51 411 70 411 93V179C411 202 392 221 369 221H348L333 247C330 252 323 252 320 247L305 221H249C226 221 207 202 207 179V93Z"
                fill="url(#questionGradient)"
            />

            {/* Question mark */}
            <path
                d="M286 113C286 98 298 87 315 87C333 87 345 98 345 114C345 128 337 136 326 142C316 148 312 154 312 164"
                stroke="white"
                strokeWidth="18"
                strokeLinecap="round"
            />

            <circle cx="312" cy="190" r="9" fill="white" />

            {/* Small chat bubble */}
            <path
                d="M127 204C127 181 146 163 169 163H250C273 163 292 181 292 204V248C292 271 273 289 250 289H190L172 308C168 312 161 309 161 303V289H169C146 289 127 271 127 248V204Z"
                fill="white"
                stroke="#E0E8FA"
                strokeWidth="3"
            />

            <circle cx="177" cy="225" r="7" fill="#3567F5" />
            <circle cx="209" cy="225" r="7" fill="#3567F5" />
            <circle cx="241" cy="225" r="7" fill="#3567F5" />

            {/* Plant */}
            <path
                d="M475 264C472 227 475 194 485 160"
                stroke="#5B9959"
                strokeWidth="8"
                strokeLinecap="round"
            />

            <path
                d="M481 191C454 177 439 154 446 132C474 133 492 155 481 191Z"
                fill="#75AE70"
            />

            <path
                d="M484 171C490 137 509 115 535 110C540 137 519 163 484 171Z"
                fill="#87BD7B"
            />

            <path
                d="M480 214C453 209 435 192 433 169C459 167 479 184 480 214Z"
                fill="#659F62"
            />

            <path
                d="M485 226C500 193 522 181 545 185C539 209 517 224 485 226Z"
                fill="#75AE70"
            />

            {/* Pot */}
            <path
                d="M450 257H529L518 318C516 328 508 334 498 334H481C471 334 463 328 461 318L450 257Z"
                fill="#F4F5F8"
            />

            <ellipse cx="489.5" cy="257" rx="40" ry="9" fill="#DCE0E8" />

            <defs>
                <linearGradient
                    id="questionGradient"
                    x1="207"
                    y1="51"
                    x2="411"
                    y2="247"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#5894FF" />
                    <stop offset="1" stopColor="#234FEA" />
                </linearGradient>
            </defs>
        </svg>
    );
}

/* =========================================================
   FAQ CARD SVG
========================================================= */

function FAQCardIllustration() {
    return (
        <svg
            viewBox="0 0 480 360"
            className="w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {/* Background */}
            <path
                d="M31 246C5 189 33 124 95 111C146 101 162 49 227 49C288 49 303 89 348 96C407 105 445 151 438 207C431 262 387 306 327 302C274 298 245 331 183 326C119 321 57 302 31 246Z"
                fill="#DCE9FF"
            />

            {/* Laptop shadow */}
            <ellipse
                cx="228"
                cy="299"
                rx="132"
                ry="22"
                fill="#B7CBEC"
                opacity=".55"
            />

            {/* Laptop */}
            <path
                d="M105 145C105 136 112 129 121 129H315C324 129 331 136 331 145V257H105V145Z"
                fill="#203F87"
            />

            <path
                d="M117 143H319V244H117V143Z"
                fill="#142F6E"
            />

            {/* Chart */}
            <path
                d="M132 221L154 202L174 210L197 183L217 194L242 157L265 171L288 148L308 158"
                stroke="#56A1FF"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                d="M132 221L154 202L174 210L197 183L217 194L242 157L265 171L288 148L308 158V228H132V221Z"
                fill="#3567F5"
                opacity=".14"
            />

            {/* Chart candles */}
            <rect x="138" y="185" width="8" height="33" rx="2" fill="#51C68B" />
            <rect x="158" y="169" width="8" height="30" rx="2" fill="#F36C7A" />
            <rect x="181" y="178" width="8" height="26" rx="2" fill="#51C68B" />
            <rect x="202" y="159" width="8" height="38" rx="2" fill="#51C68B" />
            <rect x="225" y="168" width="8" height="29" rx="2" fill="#F36C7A" />
            <rect x="248" y="139" width="8" height="43" rx="2" fill="#51C68B" />
            <rect x="272" y="153" width="8" height="31" rx="2" fill="#51C68B" />
            <rect x="294" y="130" width="8" height="46" rx="2" fill="#51C68B" />

            {/* Laptop base */}
            <path
                d="M82 257H354L379 280C384 285 380 292 373 292H63C56 292 52 285 57 280L82 257Z"
                fill="#E7ECF5"
            />

            <path
                d="M190 269H245"
                stroke="#AAB7CD"
                strokeWidth="5"
                strokeLinecap="round"
            />

            {/* Floating checklist card */}
            <rect
                x="326"
                y="111"
                width="95"
                height="81"
                rx="13"
                fill="white"
                stroke="#DDE6F7"
                strokeWidth="2"
            />

            <circle cx="346" cy="135" r="11" fill="#3567F5" />
            <path
                d="M341 135L345 139L352 131"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                d="M364 132H403"
                stroke="#C7D2E7"
                strokeWidth="5"
                strokeLinecap="round"
            />

            <path
                d="M364 143H391"
                stroke="#E0E6F0"
                strokeWidth="5"
                strokeLinecap="round"
            />

            <circle cx="346" cy="166" r="8" fill="#E7EDFA" />
            <path
                d="M364 164H403"
                stroke="#D8E0EF"
                strokeWidth="5"
                strokeLinecap="round"
            />

            {/* Coffee cup */}
            <path
                d="M350 268H407L399 304C397 313 390 319 381 319H376C367 319 360 313 358 304L350 268Z"
                fill="#FAFAFA"
            />

            <ellipse cx="378.5" cy="268" rx="29" ry="7" fill="#D5D9E1" />

            <path
                d="M407 276C425 273 431 284 426 296C423 304 415 307 401 306"
                stroke="#D2D7E1"
                strokeWidth="6"
                strokeLinecap="round"
            />
        </svg>
    );
}

/* =========================================================
   SUPPORT SVG
========================================================= */

function SupportIllustration() {
    return (
        <svg
            viewBox="0 0 580 340"
            className="h-auto w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {/* Background blob */}
            <path
                d="M76 184C72 126 122 78 182 85C228 90 257 50 309 59C369 69 383 116 428 122C492 130 529 174 514 229C500 282 451 302 397 293C351 285 324 313 273 306C208 297 159 315 113 282C84 261 79 221 76 184Z"
                fill="#DCE8FF"
            />

            {/* Floating chat icon */}
            <motion.g
                animate={{ y: [0, -8, 0] }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <rect
                    x="102"
                    y="104"
                    width="67"
                    height="62"
                    rx="19"
                    fill="#3767F4"
                />

                <path
                    d="M123 134C123 126 130 120 138 120H146C154 120 161 126 161 134C161 142 154 148 146 148H137L130 154V148C126 146 123 141 123 134Z"
                    fill="white"
                />

                <circle cx="134" cy="134" r="2.8" fill="#3767F4" />
                <circle cx="142" cy="134" r="2.8" fill="#3767F4" />
                <circle cx="150" cy="134" r="2.8" fill="#3767F4" />
            </motion.g>

            {/* Person body */}
            <path
                d="M275 302C281 253 307 226 352 220C397 214 429 239 439 302H275Z"
                fill="#5D8CEB"
            />

            {/* Shirt */}
            <path
                d="M301 239L332 217L360 235L390 216L418 239L403 302H313L301 239Z"
                fill="#74A1F3"
            />

            {/* Neck */}
            <path
                d="M343 194H380V226C380 236 372 243 362 243C351 243 343 236 343 226V194Z"
                fill="#D99A7C"
            />

            {/* Face */}
            <path
                d="M323 128C323 97 347 77 376 82C406 87 420 110 416 143L410 178C406 200 390 215 368 215C344 215 327 195 324 171L323 128Z"
                fill="#E8AE8E"
            />

            {/* Hair */}
            <path
                d="M322 143C306 119 316 84 344 70C370 57 403 68 415 91C424 109 420 134 412 149L400 128C391 139 379 145 363 143C347 141 336 134 327 126L322 143Z"
                fill="#38251F"
            />

            <path
                d="M323 126C322 104 330 84 350 74C334 97 338 117 348 131C339 132 331 130 323 126Z"
                fill="#2A1B17"
            />

            {/* Face details */}
            <path
                d="M345 153C349 150 354 150 358 153"
                stroke="#6C4338"
                strokeWidth="3"
                strokeLinecap="round"
            />

            <path
                d="M382 153C386 150 391 150 395 153"
                stroke="#6C4338"
                strokeWidth="3"
                strokeLinecap="round"
            />

            <circle cx="354" cy="160" r="2.5" fill="#3B2A27" />
            <circle cx="389" cy="160" r="2.5" fill="#3B2A27" />

            <path
                d="M360 180C367 185 375 185 382 180"
                stroke="#B45E58"
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Headset */}
            <path
                d="M323 141C319 106 339 80 371 78C403 76 422 101 418 136"
                stroke="#29364F"
                strokeWidth="7"
                strokeLinecap="round"
            />

            <path
                d="M319 132V155"
                stroke="#29364F"
                strokeWidth="8"
                strokeLinecap="round"
            />

            <path
                d="M419 132V155"
                stroke="#29364F"
                strokeWidth="8"
                strokeLinecap="round"
            />

            <path
                d="M417 161C417 177 407 185 394 185"
                stroke="#29364F"
                strokeWidth="5"
                strokeLinecap="round"
            />

            <path
                d="M395 185H382"
                stroke="#29364F"
                strokeWidth="5"
                strokeLinecap="round"
            />

            {/* Laptop */}
            <path
                d="M220 237C220 229 227 223 235 223H366C374 223 381 229 381 237V300H220V237Z"
                fill="#DCE3ED"
            />

            <rect
                x="231"
                y="234"
                width="139"
                height="54"
                rx="5"
                fill="#7894BC"
            />

            <path
                d="M236 294H369L388 308H218L236 294Z"
                fill="#EDF1F6"
            />

            {/* Clock card */}
            <motion.g
                animate={{ y: [0, 5, 0] }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <rect
                    x="415"
                    y="128"
                    width="111"
                    height="59"
                    rx="18"
                    fill="white"
                />

                <circle
                    cx="443"
                    cy="157"
                    r="13"
                    stroke="#3567F5"
                    strokeWidth="4"
                />

                <path
                    d="M443 150V158L448 161"
                    stroke="#3567F5"
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                <text
                    x="463"
                    y="163"
                    fill="#35517F"
                    fontSize="17"
                    fontWeight="700"
                    fontFamily="Arial, sans-serif"
                >
                    24/7
                </text>
            </motion.g>
        </svg>
    );
}

/* =========================================================
   FAQ ACCORDION ITEM
========================================================= */

function FAQAccordionItem({
    item,
    index,
    isOpen,
    onClick,
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                duration: 0.45,
                delay: index * 0.06,
            }}
            className={[
                "overflow-hidden rounded-2xl border bg-white transition-all duration-300",
                isOpen
                    ? "border-blue-200 shadow-[0_12px_35px_rgba(44,91,190,0.08)]"
                    : "border-[#E3EAF6] hover:border-blue-200 hover:shadow-[0_8px_25px_rgba(44,91,190,0.06)]",
            ].join(" ")}
        >
            <button
                type="button"
                onClick={onClick}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5 sm:py-5"
            >
                {/* Number */}
                <span
                    className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                        isOpen
                            ? "bg-[#3867F5] text-white"
                            : "bg-[#EAF0FF] text-[#3867F5]",
                    ].join(" ")}
                >
                    {String(index + 1).padStart(2, "0")}
                </span>

                {/* Question */}
                <span className="flex-1 pr-2 text-sm font-bold leading-6 text-[#142B5B] sm:text-[15px]">
                    {item.question}
                </span>

                {/* Icon */}
                <span
                    className={[
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                        isOpen
                            ? "bg-[#EEF3FF] text-[#3867F5]"
                            : "text-[#30466E]",
                    ].join(" ")}
                >
                    <FiChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                            }`}
                    />
                </span>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: {
                                duration: 0.3,
                                ease: "easeInOut",
                            },
                            opacity: {
                                duration: 0.2,
                            },
                        }}
                    >
                        <div className="px-4 pb-5 pl-[4.25rem] pr-6 text-sm leading-6 text-[#637494] sm:pl-[4.5rem]">
                            {item.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <main className="overflow-hidden bg-white text-[#142B5B]">
            {/* =====================================================
          HERO SECTION
      ===================================================== */}
            <section className="relative overflow-hidden bg-[#F4F8FF]">
                {/* Decorative background */}
                <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />
                <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl" />

                <div className="relative mx-auto grid max-w-[1240px] items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_1fr] lg:px-10 lg:py-[58px]">
                    {/* Hero Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -35 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                        className="max-w-[570px]"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="mb-4 inline-flex rounded-full bg-[#DFE9FF] px-3 py-1 text-xs font-bold tracking-wide text-[#3767F4]"
                        >
                            FAQ
                        </motion.div>

                        <h1 className="text-[42px] font-extrabold leading-[1.03] tracking-[-1.8px] text-[#142B5B] sm:text-[52px] lg:text-[58px]">
                            Frequently Asked
                            <br />
                            <span className="text-[#3D48EF]">Questions</span>
                        </h1>

                        <p className="mt-6 max-w-[510px] text-[15px] leading-7 text-[#607292] sm:text-base">
                            Find quick answers to the most common questions about our
                            platform, services, and more.
                        </p>
                    </motion.div>

                    {/* Hero Illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, x: 25 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{
                            duration: 0.7,
                            delay: 0.15,
                            ease: "easeOut",
                        }}
                        className="mx-auto w-full max-w-[570px]"
                    >
                        <HeroIllustration />
                    </motion.div>
                </div>
            </section>

            {/* =====================================================
          FAQ SECTION
      ===================================================== */}
            <section className="bg-white">
                <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-[72px]">
                    <div className="grid gap-8 lg:grid-cols-[325px_1fr] lg:gap-12">
                        {/* Left Information Card */}
                        <motion.aside
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6 }}
                            className="relative overflow-hidden rounded-[18px] bg-[#F1F6FF]"
                        >
                            <div className="relative z-10 p-7 sm:p-8">
                                <span className="inline-flex rounded-full bg-[#DFE9FF] px-3 py-1 text-[11px] font-bold text-[#3867F5]">
                                    Quick Answers
                                </span>

                                <h2 className="mt-5 text-[29px] font-extrabold leading-[1.12] tracking-[-1px] text-[#142B5B]">
                                    Everything You Need
                                    <br />
                                    <span className="text-[#3949EE]">to Know</span>
                                </h2>

                                <p className="mt-4 text-sm leading-6 text-[#687A99]">
                                    Browse through our most frequently asked questions to get
                                    the information you need, fast.
                                </p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.15 }}
                                className="relative mt-2 px-3 pb-2"
                            >
                                <FAQCardIllustration />
                            </motion.div>
                        </motion.aside>

                        {/* FAQ List */}
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <FAQAccordionItem
                                    key={faq.question}
                                    item={faq}
                                    index={index}
                                    isOpen={openIndex === index}
                                    onClick={() =>
                                        setOpenIndex(openIndex === index ? -1 : index)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
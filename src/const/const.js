import {
    BsFacebook,
    BsInstagram,
    BsLinkedin,
    BsTwitterX,
    BsYoutube,
} from 'react-icons/bs';
import { FaHandshake, FaSearch, FaSuitcaseRolling } from 'react-icons/fa';

import {
    FiShield,
    FiStar,
    FiMessageCircle,
    FiLock,
    FiClock,
} from 'react-icons/fi';


export const bubbles = [
    {
        icon: '/assets/laptop.png',
        position:
            'left-[14%] top-[8%] sm:left-[12%] md:left-[8%] lg:left-[13%]',
        size: 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20',
        iconSize: 'h-6 w-6 md:h-8 md:w-8',
        bg: 'bg-blue-100/80',
        delay: 0,
    },
    {
        icon: '/assets/book.png',
        position:
            'left-[42%] top-[-2%] sm:left-[42%] md:left-[39%] lg:left-[42%]',
        size: 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20',
        iconSize: 'h-6 w-6 md:h-8 md:w-8',
        bg: 'bg-emerald-100/80',
        delay: 0.4,
    },
    {
        icon: '/assets/camera.png',
        position:
            'left-[4%] top-[40%] sm:left-[4%] md:left-[2%] lg:left-[5%]',
        size: 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20',
        iconSize: 'h-6 w-6 md:h-8 md:w-8',
        bg: 'bg-indigo-100/80',
        delay: 0.8,
    },
    {
        icon: '/assets/headphone.png',
        position:
            'left-[22%] top-[50%] sm:left-[22%] md:left-[20%] lg:left-[23%]',
        size: 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20',
        iconSize: 'h-6 w-6 md:h-8 md:w-8',
        bg: 'bg-violet-100/80',
        delay: 1.2,
    },
    {
        icon: '/assets/plant.png',
        position:
            'right-[3%] top-[27%] sm:right-[3%] md:right-[2%] lg:right-[5%]',
        size: 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20',
        iconSize: 'h-6 w-6 md:h-8 md:w-8',
        bg: 'bg-orange-100/80',
        delay: 0.6,
    },
    {
        icon: '/assets/iphone.png',
        position:
            'right-[14%] top-[56%] sm:right-[14%] md:right-[13%] lg:right-[16%]',
        size: 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20',
        iconSize: 'h-6 w-6 md:h-8 md:w-8',
        bg: 'bg-purple-100/80',
        delay: 1,
    },
    {
        icon: '/assets/bike.png',
        position:
            'left-[30%] bottom-[7%] sm:left-[30%] md:left-[28%] lg:left-[31%]',
        size: 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20',
        iconSize: 'h-6 w-6 md:h-8 md:w-8',
        bg: 'bg-green-100/80',
        delay: 1.4,
    },
    {
        icon: '/assets/piano.png',
        position:
            'left-[52%] bottom-[-2%] sm:left-[52%] md:left-[51%] lg:left-[53%]',
        size: 'h-12 w-12 sm:h-14 sm:w-14 md:h-[68px] md:w-[68px]',
        iconSize: 'h-5 w-5 md:h-7 md:w-7',
        bg: 'bg-violet-100/80',
        delay: 1.8,
    },
];

export const footerLinks = [
    { label: 'About', href: '/' },
    { label: 'How It Works', href: '/' },
    { label: 'Safety', href: '/' },
    { label: 'FAQ', href: '/' },
    { label: 'Privacy', href: '/' },
    { label: 'Terms', href: '/' },
];

export const socialLinks = [
    {
        icon: BsFacebook,
        href: '#',
        label: 'Facebook',
    },
    {
        icon: BsTwitterX,
        href: '#',
        label: 'X',
    },
    {
        icon: BsInstagram,
        href: '#',
        label: 'Instagram',
    },
    {
        icon: BsLinkedin,
        href: '#',
        label: 'LinkedIn',
    },
    {
        icon: BsYoutube,
        href: '#',
        label: 'YouTube',
    },
];

export const Work_steps = [
    {
        number: "01",
        numberColor: "text-blue-600",
        iconBg: "bg-blue-100",
        icon: <FaSuitcaseRolling className="h-6 w-6 text-blue-600" />,
        title: "Tell Us What You Have",
        description: "Add the item, skill, or service you're willing to trade.",
    },
    {
        number: "02",
        numberColor: "text-emerald-600",
        iconBg: "bg-emerald-100",
        icon: <FaSearch className="h-6 w-6 text-emerald-600" />,
        title: "Tell Us What You Want",
        description: "Let people know what you're looking for.",
    },
    {
        number: "03",
        numberColor: "text-purple-600",
        iconBg: "bg-purple-100",
        icon: <FaHandshake className="h-6 w-6 text-purple-600" />,
        title: "Connect & Trade",
        description: "Find a suitable match, make an offer and complete your trade.",
    },
];


export
    const trustCards = [
        {
            icon: FiShield,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-500',
            title: 'Verified Profiles',
            description: 'Real people, real identities.',
        },
        {
            icon: FiStar,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-500',
            title: 'Ratings & Reviews',
            description: 'Build trust through community feedback.',
        },
        {
            icon: FiLock,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-500',
            title: 'Trade Protection',
            description: 'Trade with confidence through a safer platform.',
        },
        {
            icon: FiClock,
            iconBg: 'bg-cyan-100',
            iconColor: 'text-cyan-500',
            title: 'Trade History',
            description: 'See past trades and build your reputation.',
        },
    ];

export const people = [
    {
        src: '/assets/person-1.png',
        position: 'left-[2%] top-[8%]',
    },
    {
        src: '/assets/person-2.png',
        position: 'right-[7%] top-[10%]',
    },
    {
        src: '/assets/person-3.png',
        position: 'left-[9%] bottom-[8%]',
    },
    {
        src: '/assets/person-4.png',
        position: 'right-[7%] bottom-[9%]',
    },
];

export const features = [
    {
        icon: '/assets/icons/wallet-icon.png',
        iconBg: "bg-blue-100/70",
        title: "Spend Less",
        description: "Get what you need without always reaching for your wallet.",
    },
    {
        icon: '/assets/icons/leaf-icon.png',
        iconBg: "bg-emerald-100/50",
        title: "Give More Value",
        description: "Turn unused things into something useful.",
    },
    {
        icon: '/assets/icons/users-icon.png',
        iconBg: "bg-purple-100/50",
        title: "Trade Directly",
        description: "Connect with people and exchange value directly.",
    },
];


export const productPairs = [
    {
        have: {
            name: "Laptop",
            image: "/assets/laptop.png",
        },
        want: {
            name: "Camera",
            image: "/assets/camera.png",
        },
    },
    {
        have: {
            name: "Piano",
            image: "/assets/piano.png",
        },
        want: {
            name: "Bike",
            image: "/assets/bike.png",
        },
    },
    {
        have: {
            name: "Iphone",
            image: "/assets/iphone.png",
        },
        want: {
            name: "Camera",
            image: "/assets/camera.png",
        },
    },
    {
        have: {
            name: "Bike",
            image: "/assets/bike.png",
        },
        want: {
            name: "Piano",
            image: "/assets/piano.png",
        },
    },
];

export const BUSINESS_CATEGORIES = [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Food & Grocery',
    'Health & Beauty',
    'Automotive',
    'Services',
    'Other',
];
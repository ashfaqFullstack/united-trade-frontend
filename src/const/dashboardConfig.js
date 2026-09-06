import {
    FiHome,
    FiRepeat,
    FiMessageSquare,
    FiUser,
    FiSettings,
    FiShield,
    FiTrendingUp,
    FiUsers,
    FiCheckCircle,
    FiArrowRight,
} from 'react-icons/fi';

export const sidebarItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: FiHome,
    },
    {
        label: 'My Trades',
        href: '/dashboard/trades',
        icon: FiRepeat,
    },
    {
        label: 'Messages',
        href: '/dashboard/messages',
        icon: FiMessageSquare,
        badge: 3,
    },
    {
        label: 'Profile',
        href: '/dashboard/profile',
        icon: FiUser,
    },
    {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: FiSettings,
    },
];

export const getDashboardRoutes = ({ userName, isProfileComplete, isAdmin, pendingCount }) => ({
    '/dashboard': {
        eyebrow: isAdmin ? 'Admin overview' : 'Your barter overview',
        title: `Welcome back, ${userName || 'there'}`,
        description: isAdmin
            ? 'Review pending user approvals and manage the platform.'
            : 'Discover new opportunities, manage your trades and grow your barter network.',
        icon: FiTrendingUp,
        iconBg: 'from-blue-500 to-indigo-600',
        badge: isAdmin ? `${pendingCount} Pending Approvals` : 'Dashboard',
        badgeIcon: FiTrendingUp,

        stats: isAdmin
            ? [{ label: 'Pending Approvals', value: String(pendingCount), icon: FiUsers }]
            : [
                { label: 'Active Trades', value: '12', icon: FiRepeat },
                { label: 'Trade Partners', value: '28', icon: FiUsers },
                { label: 'Profile Strength', value: isProfileComplete ? '100%' : '50%', icon: FiUser },
            ],

        action: isAdmin ? null : { label: 'Explore Trades', href: '/dashboard/trades', icon: FiArrowRight },
    },

    '/dashboard/trades': {
        eyebrow: 'Trade marketplace',
        title: 'Find Your Next Trade',
        description:
            'Browse relevant barter opportunities and connect with people who have what you need.',
        icon: FiRepeat,
        iconBg: 'from-cyan-500 to-blue-600',
        badge: '12 Active Trades',
        badgeIcon: FiRepeat,

        stats: [
            { label: 'Available Matches', value: '24', icon: FiTrendingUp },
            { label: 'Pending Trades', value: '5', icon: FiRepeat },
            { label: 'Completed', value: '18', icon: FiCheckCircle },
        ],

        action: {
            label: 'Browse Trades',
            href: '/dashboard/trades',
            icon: FiArrowRight,
        },
    },

    '/dashboard/messages': {
        eyebrow: 'Stay connected',
        title: 'Your Conversations',
        description:
            'Keep your trade discussions organized and communicate securely with your partners.',
        icon: FiMessageSquare,
        iconBg: 'from-violet-500 to-purple-600',
        badge: '3 New Messages',
        badgeIcon: FiMessageSquare,

        stats: [
            { label: 'Unread', value: '3', icon: FiMessageSquare },
            { label: 'Active Chats', value: '8', icon: FiUsers },
            { label: 'Trade Discussions', value: '6', icon: FiRepeat },
        ],

        action: {
            label: 'View Messages',
            href: '/dashboard/messages',
            icon: FiArrowRight,
        },
    },

    '/dashboard/profile': {
        eyebrow: 'Build trust',
        title: isProfileComplete ? 'Your Profile' : 'Complete Your Profile',
        description: isProfileComplete
            ? 'Your profile is complete — this builds trust and helps you find better trade matches.'
            : 'A complete profile builds trust and helps you find better trade matches.',
        icon: FiUser,
        iconBg: 'from-blue-500 to-indigo-600',
        badge: isProfileComplete ? 'Profile Complete' : 'Incomplete',
        badgeIcon: FiCheckCircle,

        progress: isProfileComplete ? 100 : 50,

        stats: [
            { label: 'Trust Score', value: isProfileComplete ? '82%' : '—', icon: FiShield },
        ],

        action: isProfileComplete
            ? null
            : { label: 'Complete Profile', href: '/onboarding', icon: FiArrowRight },
    },

    '/dashboard/settings': {
        eyebrow: 'Account preferences',
        title: 'Manage Your Settings',
        description:
            'Control your account preferences, notifications and privacy settings from one place.',
        icon: FiSettings,
        iconBg: 'from-slate-600 to-slate-800',
        badge: 'Account Settings',
        badgeIcon: FiSettings,

        stats: [
            { label: 'Account Status', value: 'Active', icon: FiCheckCircle },
            { label: 'Security', value: 'Strong', icon: FiShield },
            { label: 'Notifications', value: 'On', icon: FiSettings },
        ],

        action: {
            label: 'Manage Settings',
            href: '/dashboard/settings',
            icon: FiArrowRight,
        },
    },
});
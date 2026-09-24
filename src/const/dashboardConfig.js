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
    FiCreditCard,
    FiSend,
    FiCamera,
    FiClock,
    FiTag,
    FiPackage,
    FiFileText,
    FiEdit3,
} from 'react-icons/fi';

export const sidebarItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: FiHome,
    },
    { label: 'Currency Rates', href: '/dashboard/admin/currency', icon: FiPackage },
    { label: 'Users', href: '/dashboard/admin/users', icon: FiUsers },
    { label: 'Reports', href: '/dashboard/admin/reports', icon: FiFileText },
    { label: 'My Profile', href: '/dashboard/profile', icon: FiUser },
    { label: 'Profile Updates', href: '/dashboard/admin/profile-updates', icon: FiEdit3 },
    {
        label: 'My Wallet',
        href: '/dashboard/wallet',
        icon: FiRepeat,
    },
    {
        label: 'My Listings',
        href: '/dashboard/listings',
        icon: FiTag,
    },
    { label: 'My Orders', href: '/dashboard/orders', icon: FiPackage },
    { label: 'Received Orders', href: '/dashboard/orders/received', icon: FiPackage },
    { label: 'My Barter Offers', href: '/dashboard/barter-offers', icon: FiRepeat },
    { label: 'Received Offers', href: '/dashboard/barter-offers/received', icon: FiRepeat },
];

const adminSidebarHrefs = new Set([
    '/dashboard',
    '/dashboard/admin/users',
    '/dashboard/wallet',
    '/dashboard/admin/reports',
    '/dashboard/admin/currency',
    '/dashboard/orders',
    '/dashboard/admin/profile-updates'
]);

const adminOnlySidebarHrefs = new Set([
    '/dashboard/admin/users',
    '/dashboard/admin/reports',
    '/dashboard/admin/currency',
    '/dashboard/admin/profile-updates'
]);

export const getSidebarItems = (isAdmin = false) => (
    isAdmin
        ? sidebarItems.filter((item) => adminSidebarHrefs.has(item.href))
        : sidebarItems.filter((item) => !adminOnlySidebarHrefs.has(item.href))
);

export const getDashboardRoutes = ({
    userName,
    isProfileComplete,
    isAdmin,
    pendingCount,
    walletBalance = 0,
    creditLimit = 0,
}) => {
    const availableBalance = Number(walletBalance) + Number(creditLimit);

    return {
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
                    { label: 'Wallet Balance', value: `$${Number(walletBalance).toLocaleString()}`, icon: FiCreditCard },
                    { label: 'Available Credit', value: `$${availableBalance.toLocaleString()}`, icon: FiTrendingUp },
                    { label: 'Profile Strength', value: isProfileComplete ? '100%' : '50%', icon: FiUser },
                ],

            action: isAdmin ? null : { label: 'Go to Wallet', href: '/dashboard/wallet', icon: FiArrowRight },
        },

        '/dashboard/wallet': {
            eyebrow: 'Manage your trade dollars',
            title: 'My Wallet',
            description: 'View your balance, send money, and track every transaction in one place.',
            icon: FiCreditCard,
            iconBg: 'from-blue-500 to-blue-700',
            badge: `$${Number(walletBalance).toLocaleString()} Balance`,
            badgeIcon: FiCreditCard,

            stats: [
                { label: 'Wallet Balance', value: `$${Number(walletBalance).toLocaleString()}`, icon: FiCreditCard },
                { label: 'Credit Limit', value: `$${Number(creditLimit).toLocaleString()}`, icon: FiTrendingUp },
                { label: 'Available Balance', value: `$${availableBalance.toLocaleString()}`, icon: FiCheckCircle },
            ],

        },

        '/dashboard/wallet/send': {
            eyebrow: 'Trade dollars, instantly',
            title: 'Send Money',
            description: 'Scan a QR code or enter recipient details to transfer trade dollars securely.',
            icon: FiSend,
            iconBg: 'from-indigo-500 to-purple-600',
            badge: 'Send',
            badgeIcon: FiSend,
            stats: [],
            action: null,
        },

        '/dashboard/wallet/qr': {
            eyebrow: 'Receive trade dollars',
            title: 'Your QR Code',
            description: "Share your QR code so others can scan it and send you money directly.",
            icon: FiCamera,
            iconBg: 'from-cyan-500 to-blue-600',
            badge: 'Receive',
            badgeIcon: FiCamera,
            stats: [],
            action: null,
        },

        '/dashboard/wallet/history': {
            eyebrow: 'Your activity',
            title: 'Transaction History',
            description: 'Track every trade dollar you\'ve sent and received on the platform.',
            icon: FiClock,
            iconBg: 'from-slate-600 to-slate-800',
            badge: 'History',
            badgeIcon: FiClock,
            stats: [],
            action: null,
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
    };
};
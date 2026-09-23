export const formatAddress = (person) => {
    const profile = person?.role === 'BUSINESS' ? person?.businessProfile : person?.customerProfile;
    return [profile?.city, profile?.address].filter(Boolean).join(', ');
};
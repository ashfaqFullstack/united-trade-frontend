
// "12 Main Street, Sydney, NSW, 2000"
export const formatBusinessAddress = (profile) =>
    [
        [profile?.streetNumber, profile?.streetName].filter(Boolean).join(' '),
        profile?.city,
        profile?.state,
        profile?.postcode,
    ]
        .filter(Boolean)
        .join(', ');

export const formatAddress = (person) => {
    if (person?.role === 'BUSINESS') return formatBusinessAddress(person?.businessProfile);
    const profile = person?.customerProfile;
    return [profile?.city, profile?.address].filter(Boolean).join(', ');
};
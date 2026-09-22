import ListingDetail from "@/components/listings/ListingDetail";
import RouteGuard from "@/route/guard/RouteGuard";

export default function ListingDetailPage() {
    return (
        <RouteGuard type="protected">
            <ListingDetail />
        </RouteGuard>
    )
}
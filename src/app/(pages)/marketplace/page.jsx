import MarketplaceGrid from "@/components/listings/MarketPlaceGrid";
import RouteGuard from "@/route/guard/RouteGuard";

export default function ListingsPage() {
    return (
        <RouteGuard type="protected">
            <MarketplaceGrid />
        </RouteGuard>
    )
}
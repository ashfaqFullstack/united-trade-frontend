import RouteGuard from "@/route/guard/RouteGuard";
import PendingApprovalCard from "../components/onboarding/PendingApproval";

export default function PendingApprovalPage() {
    return (
        <RouteGuard type="pendingApproval">
            <PendingApprovalCard />
        </RouteGuard>
    )
}
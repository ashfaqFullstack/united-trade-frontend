import DashboardLayout from "@/app/components/Dashboard/Layout";
import RouteGuard from "@/route/guard/RouteGuard";

export default function Layout({ children }) {
    return (
        <RouteGuard type="protected">
            <DashboardLayout>{children}</DashboardLayout>
        </RouteGuard>
    )
}
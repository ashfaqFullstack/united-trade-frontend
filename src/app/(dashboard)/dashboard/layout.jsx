import DashboardLayout from "@/app/components/layout/DashboardLayout";
import RouteGuard from "@/route/guard/RouteGuard";

export default function Layout({ children }) {
    return (
        <RouteGuard type="protected">
            <DashboardLayout>{children}</DashboardLayout>
        </RouteGuard>
    )
}
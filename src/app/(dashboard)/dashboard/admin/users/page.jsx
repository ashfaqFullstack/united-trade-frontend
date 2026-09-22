import UsersManagementTable from "@/components/Dashboard/Admin/users/UserManagementTable";
import RouteGuard from "@/route/guard/RouteGuard";

export default function AdminUsersPage() {
    return (
        <RouteGuard type="admin">
            <UsersManagementTable />
        </RouteGuard>
    );
}

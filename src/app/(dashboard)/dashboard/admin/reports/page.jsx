import AllTransactionsTable from "@/components/Dashboard/Admin/reports/AllTransactionsTable";
import CompanyAccountCard from "@/components/Dashboard/Admin/reports/CompanyAccountCard";
import FeeLogsTable from "@/components/Dashboard/Admin/reports/FeeLogsTable";
import RouteGuard from "@/route/guard/RouteGuard";

export default function AdminReportsPage() {
    return (
        <RouteGuard type="admin" >
            <div className="space-y-5">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Company Account & Transactions</h2>
                    <p className="text-sm text-slate-500">Track platform revenue and all trade activity.</p>
                </div>

                <CompanyAccountCard />
                <AllTransactionsTable />
                <FeeLogsTable />
            </div>
        </RouteGuard>
    );
}
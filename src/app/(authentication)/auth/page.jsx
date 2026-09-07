import RouteGuard from "@/route/guard/RouteGuard";
import AuthCard from "./_components/AuthCard";

export default function AuthPage() {
    return (
        <RouteGuard type="guest">
            <main className="flex min-h-screen items-center justify-center bg-[#F4F6FF] p-6">
                <AuthCard />
            </main>
        </RouteGuard>
    );
}
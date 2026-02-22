import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/dashboard/AdminDashboardClient";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // 1. Check Auth & Verification
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // 2. Check Admin Role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, admin_verified, trust_score, intel_credits")
        .eq("id", user.id)
        .single();

    const isSuperAdmin = user.email === "cateyes0090@gmail.com";
    const isVerifiedAdmin = profile?.role === "admin" && profile?.admin_verified;

    if (!isSuperAdmin && !isVerifiedAdmin) {
        return redirect("/dashboard");
    }

    // 3. Fetch Pending Landmarks
    const { data: pendingLandmarks } = await supabase
        .from("landmarks")
        .select("*")
        .eq("is_verified", false)
        .order("created_at", { ascending: false });

    return (
        <AdminDashboardClient
            pendingLandmarks={pendingLandmarks || []}
            userEmail={user.email!}
            trustScore={profile?.trust_score || 0}
            intelCredits={profile?.intel_credits || 0}
        />
    );
}

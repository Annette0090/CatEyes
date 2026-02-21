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
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return redirect("/dashboard");
    }

    // 3. Fetch Pending Landmarks
    const { data: pendingLandmarks } = await supabase
        .from("landmarks")
        .select("*")
        .eq("is_verified", false)
        .order("created_at", { ascending: false });

    return <AdminDashboardClient pendingLandmarks={pendingLandmarks || []} />;
}

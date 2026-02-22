import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function Dashboard() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, role, trust_score, intel_credits, preferences")
        .eq("id", user.id)
        .single();

    // Fetch verified landmarks for the map
    const { data: landmarks } = await supabase
        .from("landmarks")
        .select("*")
        .eq("is_verified", true);

    // Fetch active incidents for the map
    const { data: incidents } = await supabase
        .from("incidents")
        .select("*")
        .eq("status", "ACTIVE")
        .gt("expires_at", new Date().toISOString());

    // Fetch user's own submissions for history
    const { data: userSubmissions } = await supabase
        .from("landmarks")
        .select("*")
        .eq("submitted_by", user.id)
        .order('created_at', { ascending: false });

    return (
        <DashboardClient
            userId={user.id}
            userEmail={user.email!}
            fullName={profile?.full_name || user.email!.split('@')[0]}
            role={profile?.role || 'user'}
            trustScore={profile?.trust_score || 0}
            intelCredits={profile?.intel_credits || 0}
            preferences={profile?.preferences || {}}
            initialLandmarks={landmarks || []}
            initialIncidents={incidents || []}
            userSubmissions={userSubmissions || []}
        />
    );
}

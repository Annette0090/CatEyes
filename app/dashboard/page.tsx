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
        .select("full_name")
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
        .gt("expires_at", new Date().toISOString());

    return (
        <DashboardClient
            userEmail={user.email!}
            fullName={profile?.full_name || user.email!.split('@')[0]}
            initialLandmarks={landmarks || []}
            initialIncidents={incidents || []}
        />
    );
}

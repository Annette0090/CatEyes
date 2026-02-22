"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function verifyLandmark(id: string) {
    const supabase = await createClient();

    // Security: Verify user is an admin
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, admin_verified")
        .eq("id", user?.id)
        .single();

    const isSuperAdmin = user?.email === "cateyes0090@gmail.com";
    const isVerifiedAdmin = profile?.role === "admin" && profile?.admin_verified;

    if (!isSuperAdmin && !isVerifiedAdmin) {
        throw new Error("Unauthorized: Administrative clearance required.");
    }

    // 1. Fetch the landmark to find the submitter
    const { data: landmark } = await supabase
        .from("landmarks")
        .select("submitted_by")
        .eq("id", id)
        .single();

    if (!landmark) return { error: "Landmark not found" };

    // 2. Mark as verified
    const { error: verifyError } = await supabase
        .from("landmarks")
        .update({ is_verified: true })
        .eq("id", id);

    if (verifyError) {
        console.error("Error verifying landmark:", verifyError);
        return { error: verifyError.message };
    }

    // 3. Reward the user (Citizen XP System)
    if (landmark.submitted_by) {
        const { error: rewardError } = await supabase.rpc('increment_user_xp', {
            user_id: landmark.submitted_by,
            trust_inc: 10,
            credits_inc: 50
        });

        // If RPC doesn't exist yet, we'll implement it or use a simple update
        if (rewardError) {
            // Fallback to manual update if RPC is missing
            const { data: currentProfile } = await supabase
                .from("profiles")
                .select("trust_score, intel_credits")
                .eq("id", landmark.submitted_by)
                .single();

            if (currentProfile) {
                await supabase
                    .from("profiles")
                    .update({
                        trust_score: (currentProfile.trust_score || 0) + 10,
                        intel_credits: (currentProfile.intel_credits || 0) + 50
                    })
                    .eq("id", landmark.submitted_by);
            }
        }
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteLandmark(id: string) {
    const supabase = await createClient();

    // Security: Verify user is an admin
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, admin_verified")
        .eq("id", user?.id)
        .single();

    const isSuperAdmin = user?.email === "cateyes0090@gmail.com";
    const isVerifiedAdmin = profile?.role === "admin" && profile?.admin_verified;

    if (!isSuperAdmin && !isVerifiedAdmin) {
        throw new Error("Unauthorized");
    }

    const { error } = await supabase
        .from("landmarks")
        .delete()
        .eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/admin/dashboard");
    return { success: true };
}

export async function authorizeAdmin(profileId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    // Only Super Admin can authorize other admins
    if (user?.email !== "cateyes0090@gmail.com") {
        throw new Error("Unauthorized: Super Admin clearance level required.");
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            role: 'admin',
            admin_verified: true
        })
        .eq("id", profileId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/admin/dashboard");
    return { success: true };
}

export async function searchProfiles(query: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user?.email !== "cateyes0090@gmail.com") {
        throw new Error("Unauthorized");
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, admin_verified")
        .ilike("full_name", `%${query}%`)
        .limit(10);

    if (error) return { error: error.message };
    return { data };
}

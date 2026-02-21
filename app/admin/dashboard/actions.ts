"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function verifyLandmark(id: string) {
    const supabase = await createClient();

    // Security: Verify user is an admin
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id)
        .single();

    if (profile?.role !== "admin") {
        throw new Error("Unauthorized: Only admins can verify landmarks.");
    }

    const { error } = await supabase
        .from("landmarks")
        .update({ is_verified: true })
        .eq("id", id);

    if (error) {
        console.error("Error verifying landmark:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/dashboard");
    return { success: true };
}

export async function deleteLandmark(id: string) {
    const supabase = await createClient();

    // Security: Verify user is an admin
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id)
        .single();

    if (profile?.role !== "admin") {
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

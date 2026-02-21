"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitLandmark(formData: FormData) {
    const supabase = await createClient();

    // Get user session to associate the landmark
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized: You must be logged in to submit landmarks.");
    }

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const latitude = parseFloat(formData.get("latitude") as string);
    const longitude = parseFloat(formData.get("longitude") as string);

    const { error } = await supabase.from("landmarks").insert({
        name,
        category,
        description,
        latitude,
        longitude,
        submitted_by: user.id,
        is_verified: false, // Needs admin approval
    });

    if (error) {
        console.error("Error submitting landmark:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

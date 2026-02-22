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
    const photo = formData.get("photo") as File;

    let imageUrl = null;

    if (photo && photo.size > 0) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('landmark-photos')
            .upload(filePath, photo);

        if (uploadError) {
            console.error("Upload error:", uploadError);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('landmark-photos')
                .getPublicUrl(filePath);
            imageUrl = publicUrl;
        }
    }

    const { error } = await supabase.from("landmarks").insert({
        name,
        category,
        description,
        latitude,
        longitude,
        submitted_by: user.id,
        is_verified: false, // Needs admin approval
        image_url: imageUrl
    });

    if (error) {
        console.error("Error submitting landmark:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

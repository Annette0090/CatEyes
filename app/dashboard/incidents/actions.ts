"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function reportIncident(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const severity = formData.get("severity") as string;
    const latitude = parseFloat(formData.get("latitude") as string);
    const longitude = parseFloat(formData.get("longitude") as string);
    const photo = formData.get("photo") as File;

    let imageUrl = null;

    if (photo && photo.size > 0) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('incident-photos')
            .upload(filePath, photo);

        if (uploadError) {
            console.error("Upload error:", uploadError);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('incident-photos')
                .getPublicUrl(filePath);
            imageUrl = publicUrl;
        }
    }

    const { error } = await supabase.from("incidents").insert({
        type,
        description,
        severity,
        latitude,
        longitude,
        reported_by: user.id,
        image_url: imageUrl,
        expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function resolveIncident(id: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("incidents")
        .update({
            status: 'RESOLVED',
            resolved_at: new Date().toISOString(),
            resolved_by: user.id
        })
        .eq('id', id);

    if (error) {
        return { error: error.message };
    }

    // Reward the citizen who cleared the path
    const { data: currentProfile } = await supabase
        .from("profiles")
        .select("trust_score, intel_credits")
        .eq("id", user.id)
        .single();

    if (currentProfile) {
        await supabase
            .from("profiles")
            .update({
                trust_score: (currentProfile.trust_score || 0) + 5,
                intel_credits: (currentProfile.intel_credits || 0) + 20
            })
            .eq("id", user.id);
    }

    revalidatePath("/dashboard");
    return { success: true };
}

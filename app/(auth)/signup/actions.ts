"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signup(formData: FormData) {
    const origin = (await headers()).get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    const fullName = formData.get("full_name") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
                role: role,
                full_name: fullName
            }
        },
    });

    if (error) {
        return redirect(`/signup?message=${encodeURIComponent(error.message)}`);
    }

    return redirect("/signup?message=Check email to continue sign in process");
}

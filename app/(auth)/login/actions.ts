"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return redirect(`/login?message=${encodeURIComponent(error.message)}`);
    }

    const role = data.user?.user_metadata?.role;

    if (role === "admin") {
        return redirect("/admin/dashboard");
    }

    return redirect("/dashboard");
}

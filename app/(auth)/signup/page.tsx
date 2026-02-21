import Link from "next/link";
import { signup } from "./actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Signup({
    searchParams,
}: {
    searchParams: { message: string };
}) {
    const message = await searchParams?.message;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const role = user.user_metadata?.role;
        return redirect(role === "admin" ? "/admin/dashboard" : "/dashboard");
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 w-full">
            {/* Left Side: Visual */}
            <div className="hidden lg:block relative overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/50 z-10" />
                <img
                    src="/auth-visual.png"
                    alt="CityEyes Urban Intelligence"
                    className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000"
                />
                <div className="absolute bottom-12 left-12 z-20 max-w-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-accent glow-border" />
                        <span className="text-lg font-bold tracking-tighter glow-text">CITYEYES</span>
                    </div>
                    <h2 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter mb-4">
                        Join the <span className="text-accent">Intelligence Grid</span>
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Create your account to start navigating the future of urban environments with community-verified landmark intelligence.
                    </p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex flex-col items-center justify-center relative p-8">
                <Link
                    href="/"
                    className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-white/5 hover:bg-white/10 border border-white/5 flex items-center group text-sm transition-all"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>{" "}
                    Back
                </Link>

                <form className="animate-in flex flex-col w-full max-w-md justify-center gap-4 text-foreground">
                    <div className="flex flex-col gap-2 mb-8">
                        <h1 className="text-4xl font-black glow-text tracking-tight uppercase">Join CityEyes</h1>
                        <p className="text-slate-400">Create your account to start navigating the future.</p>
                    </div>

                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400" htmlFor="full_name">
                        Full Name
                    </label>
                    <input
                        className="rounded-xl px-4 py-3 bg-white/5 border border-white/10 focus:border-accent transition-colors outline-none"
                        name="full_name"
                        placeholder="John Doe"
                        required
                    />

                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="rounded-xl px-4 py-3 bg-white/5 border border-white/10 focus:border-accent transition-colors outline-none"
                        name="email"
                        placeholder="you@example.com"
                        required
                    />
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="rounded-xl px-4 py-3 bg-white/5 border border-white/10 focus:border-accent transition-colors outline-none"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                    />

                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400" htmlFor="role">
                        Account Type
                    </label>
                    <select
                        name="role"
                        className="rounded-xl px-4 py-3 bg-white/5 border border-white/10 focus:border-accent transition-colors outline-none appearance-none cursor-pointer"
                    >
                        <option value="user" className="bg-slate-900 text-white">Normal User</option>
                        <option value="admin" className="bg-slate-900 text-white">Admin</option>
                    </select>

                    <button
                        formAction={signup}
                        className="bg-accent rounded-xl px-4 py-4 text-black font-bold text-lg mt-4 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
                    >
                        Initialize Account
                    </button>

                    {message && (
                        <p className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-center rounded-xl">
                            {message}
                        </p>
                    )}

                    <p className="text-sm text-slate-500 text-center mt-4">
                        Already have an account? <Link href="/login" className="text-accent hover:underline">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

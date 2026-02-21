import React from 'react';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden scanline">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent opacity-5 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 opacity-5 blur-[120px] rounded-full" />

            <div className="relative z-10 text-center px-4 max-w-4xl">
                <div className="inline-block px-3 py-1 mb-6 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-bold tracking-widest uppercase">
                    Next-Gen Urban Intelligence
                </div>

                <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight glow-text">
                    EYES ON THE <span className="text-accent">FUTURE</span> OF CITIES
                </h1>

                <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                    The ultimate AI-powered ecosystem for real-time surveillance, traffic optimization, and infrastructure monitoring.
                    Smarter data for safer communities.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/signup" className="px-8 py-4 rounded-xl bg-accent text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all">
                        Connect to the Grid
                    </a>
                    <a href="/demo/dashboard" className="px-8 py-4 rounded-xl border border-white/10 glass font-bold text-lg hover:bg-white/5 transition-all">
                        View Analytics Demo
                    </a>
                </div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
        </section>
    );
};

export default Hero;

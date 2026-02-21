import React from 'react';

const Step = ({ number, title, description }: { number: string; title: string; description: string }) => (
    <div className="flex gap-8 items-start">
        <div className="flex-shrink-0 w-12 h-12 rounded-full border border-accent/30 bg-accent/5 flex items-center justify-center text-accent font-black text-xl glow-border">
            {number}
        </div>
        <div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-slate-400 leading-relaxed">
                {description}
            </p>
        </div>
    </div>
);

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-32 px-8 bg-black/40">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                    <div className="inline-block px-3 py-1 mb-6 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-bold tracking-widest uppercase">
                        The Protocol
                    </div>
                    <h2 className="text-5xl font-black mb-10 glow-text tracking-tight">ENGINEERED FOR PRECISION</h2>

                    <div className="space-y-12">
                        <Step
                            number="01"
                            title="Autonomous Capture"
                            description="Deploy a mesh network of high-resolution SAR sensors and intelligent cameras across the urban landscape."
                        />
                        <Step
                            number="02"
                            title="Neural Processing"
                            description="Data is streamed to our secure cloud framework where proprietary ML models analyze patterns in milliseconds."
                        />
                        <Step
                            number="03"
                            title="Actionable Intelligence"
                            description="Real-time insights are delivered to centralized command centers, enabling immediate optimization and response."
                        />
                    </div>
                </div>

                <div className="relative">
                    <div className="aspect-square rounded-3xl glass overflow-hidden relative border-accent/20 border">
                        {/* Decorative "Scanning" Visual */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-accent/5 animate-pulse" />
                        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-accent/50 scanline" />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 border-2 border-accent/10 rounded-full animate-[spin_10s_linear_infinite]" />
                            <div className="absolute w-48 h-48 border-2 border-accent/20 rounded-full animate-[spin_7s_linear_infinite_reverse]" />
                            <div className="absolute w-32 h-32 border-2 border-accent/30 rounded-full animate-pulse" />
                            <span className="text-accent text-xs font-mono glow-text">ANALYZING_CORE...</span>
                        </div>
                    </div>

                    {/* Floating Data Tags */}
                    <div className="absolute -top-6 -right-6 p-4 glass rounded-xl border-accent/30 animate-bounce">
                        <div className="text-[10px] text-accent font-mono mb-1">LATENCY</div>
                        <div className="text-lg font-bold">12ms</div>
                    </div>
                    <div className="absolute -bottom-6 -left-6 p-4 glass rounded-xl border-accent/30">
                        <div className="text-[10px] text-accent font-mono mb-1">TRAFFIC_FLOW</div>
                        <div className="text-lg font-bold">+24%</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;

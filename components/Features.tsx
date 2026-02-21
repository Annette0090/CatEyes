import React from 'react';

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
    <div className="p-8 rounded-2xl glass hover:border-accent/50 transition-all group">
        <div className="w-12 h-12 mb-6 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-colors">
            <span className="text-2xl">{icon}</span>
        </div>
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm">
            {description}
        </p>
    </div>
);

const Features = () => {
    const features = [
        {
            title: "Real-time Surveillance",
            description: "Cloud-based intelligent video analytics with low-latency offloading for instantaneous incident detection and alerting.",
            icon: "👁️"
        },
        {
            title: "Traffic Flow Optimization",
            description: "Advanced ML models analyzing high-resolution data to reduce congestion and optimize signal patterns in real-time.",
            icon: "🚦"
        },
        {
            title: "Infrastructure Health",
            description: "Millimetric SAR sensor integration to monitor movements in critical buildings and bridges, ensuring urban safety.",
            icon: "🏗️"
        },
        {
            title: "Unified Command",
            description: "A centralized dashboard for cross-departmental coordination and data-driven urban management strategies.",
            icon: "🛰️"
        },
        {
            title: "Smart Resource Allocation",
            description: "Predictive analytics to deploy emergency services and maintenance crews where they are needed most.",
            icon: "📊"
        },
        {
            title: "Public Safety Network",
            description: "Interconnected camera systems with privacy-first facial analytics and behavior recognition algorithms.",
            icon: "🛡️"
        }
    ];

    return (
        <section id="features" className="py-32 px-8 max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-black mb-6 glow-text tracking-tight">POWERED BY CORE INTELLIGENCE</h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    The CityEyes ecosystem integrates diverse data streams to provide a comprehensive 360° view of urban dynamics.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((f, i) => (
                    <FeatureCard key={i} {...f} />
                ))}
            </div>
        </section>
    );
};

export default Features;

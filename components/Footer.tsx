import React from 'react';

const Footer = () => {
    return (
        <footer className="py-20 px-8 border-t border-white/5 bg-slate-950/50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="max-w-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-6 h-6 rounded-full bg-accent glow-border" />
                        <span className="text-lg font-bold tracking-tighter glow-text">CITYEYES</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        The world's most advanced urban intelligence platform. Building the infrastructure for the cities of tomorrow, today.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm">Platform</h4>
                        <ul className="space-y-4 text-slate-500 text-sm">
                            <li><a href="#" className="hover:text-accent transition-colors">Surveillance</a></li>
                            <li><a href="#" className="hover:text-accent transition-colors">Traffic ML</a></li>
                            <li><a href="#" className="hover:text-accent transition-colors">SAR Analysis</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm">Company</h4>
                        <ul className="space-y-4 text-slate-500 text-sm">
                            <li><a href="#" className="hover:text-accent transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-accent transition-colors">Safety</a></li>
                            <li><a href="#" className="hover:text-accent transition-colors">Privacy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm">Legal</h4>
                        <ul className="space-y-4 text-slate-500 text-sm">
                            <li><a href="#" className="hover:text-accent transition-colors">Terms</a></li>
                            <li><a href="#" className="hover:text-accent transition-colors">Security</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-slate-600 text-xs">© 2026 CityEyes Intelligent Systems. All rights reserved.</p>
                <div className="flex gap-6 text-slate-600 text-xs font-mono">
                    <span>SYSTEM_STATUS: <span className="text-green-500">OPTIMAL</span></span>
                    <span>LOCATION: <span className="text-accent underline cursor-pointer">GLOBAL_MESH</span></span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

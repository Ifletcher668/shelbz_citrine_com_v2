import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection({ onJoinWaitlist }) {
    const scrollToWaitlist = () => {
        document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background with subtle texture/gradient */}
            <div className="absolute inset-0 bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                />
                {/* Subtle radial glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#4a0e4e]/10 via-transparent to-transparent rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                {/* Decorative element */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="mb-8"
                >
                    <div className="inline-block">
                        <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#8b0000] to-transparent mx-auto mb-4" />
                        <span className="text-[#8b0000] tracking-[0.4em] text-xs uppercase font-light">
                            Est. 2026
                        </span>
                    </div>
                </motion.div>

                {/* Main headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="font-serif text-4xl md:text-6xl lg:text-7xl text-[#f5f5f5] leading-[1.1] tracking-tight mb-8"
                >
                    Artifacts for the
                    <br />
                    <span className="italic text-[#d4d4d4]">Modern Dark Romantic</span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-lg md:text-xl text-[#a3a3a3] max-w-2xl mx-auto mb-12 leading-relaxed font-light"
                >
                    Heirloom jewelry forged from artisanal minds.
                    <br className="hidden md:block" />
                    For those who refuse to settle for ordinary.
                </motion.p>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                >
                    <Button
                        onClick={scrollToWaitlist}
                        className="bg-transparent border border-[#8b0000] text-[#f5f5f5] hover:bg-[#8b0000]/20 px-10 py-6 text-sm tracking-[0.2em] uppercase font-light transition-all duration-500"
                    >
                        Join the Waitlist
                    </Button>
                </motion.div>

                {/* Decorative diamond */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="mt-16"
                >
                    <div className="w-2 h-2 bg-[#4a0e4e] rotate-45 mx-auto" />
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-6 h-6 text-[#525252]" />
                </motion.div>
            </motion.div>
        </section>
    );
}
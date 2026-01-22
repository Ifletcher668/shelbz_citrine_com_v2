import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, X, Minus } from 'lucide-react';

export default function SpinelSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const comparisonData = [
        {
            property: "Hardness (Mohs)",
            onyx: "6.5-7",
            glass: "5.5",
            spinel: "8",
            spinelBest: true
        },
        {
            property: "Brilliance",
            onyx: "Dull",
            glass: "Artificial",
            spinel: "Diamond-like",
            spinelBest: true
        },
        {
            property: "Clarity",
            onyx: "Opaque",
            glass: "Transparent",
            spinel: "Deep & Lustrous",
            spinelBest: true
        },
        {
            property: "Durability",
            onyx: "Moderate",
            glass: "Fragile",
            spinel: "Exceptional",
            spinelBest: true
        },
        {
            property: "Value Retention",
            onyx: "Low",
            glass: "None",
            spinel: "High",
            spinelBest: true
        }
    ];

    return (
        <section ref={ref} className="relative py-32 bg-[#0d0d0d]">
            {/* Subtle gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#262626] to-transparent" />

            <div className="max-w-6xl mx-auto px-6">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="text-[#8b0000] tracking-[0.3em] text-xs uppercase font-light mb-4 block">
                        The Secret Weapon
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl text-[#f5f5f5] mb-8">
                        Black Spinel: The Superior Stone
                    </h2>
                    <p className="text-[#a3a3a3] max-w-2xl mx-auto text-lg leading-relaxed font-light">
                        While others sell dull onyx or cheap glass, we offer Black Spinel—harder, rarer,
                        with the brilliance of a black diamond. Stop wearing plastic. <span className="text-[#f5f5f5] italic">Wear armor.</span>
                    </p>
                </motion.div>

                {/* Comparison table */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="overflow-hidden rounded-sm border border-[#1a1a1a]"
                >
                    {/* Table header */}
                    <div className="grid grid-cols-4 bg-[#111111]">
                        <div className="p-6 border-r border-[#1a1a1a]">
                            <span className="text-[#525252] text-sm tracking-wider uppercase">Property</span>
                        </div>
                        <div className="p-6 border-r border-[#1a1a1a] text-center">
                            <span className="text-[#737373] text-sm tracking-wider uppercase">Onyx</span>
                        </div>
                        <div className="p-6 border-r border-[#1a1a1a] text-center">
                            <span className="text-[#737373] text-sm tracking-wider uppercase">Glass</span>
                        </div>
                        <div className="p-6 text-center bg-gradient-to-r from-[#4a0e4e]/10 to-[#8b0000]/10">
                            <span className="text-[#f5f5f5] text-sm tracking-wider uppercase">Black Spinel</span>
                        </div>
                    </div>

                    {/* Table rows */}
                    {comparisonData.map((row, index) => (
                        <motion.div
                            key={row.property}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            className="grid grid-cols-4 border-t border-[#1a1a1a]"
                        >
                            <div className="p-6 border-r border-[#1a1a1a]">
                                <span className="text-[#a3a3a3] text-sm">{row.property}</span>
                            </div>
                            <div className="p-6 border-r border-[#1a1a1a] text-center flex items-center justify-center">
                                <span className="text-[#525252] text-sm">{row.onyx}</span>
                            </div>
                            <div className="p-6 border-r border-[#1a1a1a] text-center flex items-center justify-center">
                                <span className="text-[#525252] text-sm">{row.glass}</span>
                            </div>
                            <div className="p-6 text-center flex items-center justify-center bg-gradient-to-r from-[#4a0e4e]/5 to-[#8b0000]/5">
                                <span className="text-[#f5f5f5] text-sm font-medium">{row.spinel}</span>
                                {row.spinelBest && (
                                    <Check className="w-4 h-4 text-[#8b0000] ml-2" />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom accent */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="flex justify-center mt-16"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#4a0e4e]" />
                        <div className="w-1.5 h-1.5 bg-[#8b0000] rotate-45" />
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#4a0e4e]" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
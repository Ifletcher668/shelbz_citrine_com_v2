import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Heart, Dice6, Skull } from 'lucide-react';

export default function AudienceSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const audiences = [
        {
            icon: Code2,
            title: "The Tech Executive",
            description: "Stealth wealth for those who code empires",
            accent: "#4a0e4e"
        },
        {
            icon: Heart,
            title: "The Alternative Bride",
            description: "For couples who see beauty in darkness",
            accent: "#8b0000"
        },
        {
            icon: Dice6,
            title: "The TTRPG Collector",
            description: "Loot worthy of your character sheet",
            accent: "#1e3a29"
        },
        {
            icon: Skull,
            title: "The Goth/Metalhead",
            description: "Heavy silver. Mourning aesthetics. No compromise.",
            accent: "#2d2d2d"
        }
    ];

    return (
        <section ref={ref} className="relative py-32 bg-[#0a0a0a]">
            <div className="max-w-6xl mx-auto px-6">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="text-[#4a0e4e] tracking-[0.3em] text-xs uppercase font-light mb-4 block">
                        For Whom
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl text-[#f5f5f5]">
                        Those Who Understand
                    </h2>
                </motion.div>

                {/* Audience grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {audiences.map((audience, index) => (
                        <motion.div
                            key={audience.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                            className="group relative"
                        >
                            <div className="relative border border-[#1a1a1a] p-8 transition-all duration-500 hover:border-[#262626] overflow-hidden bg-[#0d0d0d]">
                                {/* Hover gradient */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                    style={{
                                        background: `linear-gradient(135deg, ${audience.accent}08 0%, transparent 50%)`
                                    }}
                                />

                                <div className="relative flex items-start gap-6">
                                    {/* Icon */}
                                    <div
                                        className="flex-shrink-0 w-12 h-12 flex items-center justify-center border transition-colors duration-500"
                                        style={{ borderColor: `${audience.accent}40` }}
                                    >
                                        <audience.icon
                                            className="w-5 h-5 transition-colors duration-500"
                                            style={{ color: audience.accent }}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <h3 className="font-serif text-lg text-[#f5f5f5] mb-2">
                                            {audience.title}
                                        </h3>
                                        <p className="text-[#737373] text-sm font-light italic">
                                            &ldquo;{audience.description}&rdquo;
                                        </p>
                                    </div>
                                </div>

                                {/* Corner accent */}
                                <div
                                    className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background: `linear-gradient(135deg, transparent 50%, ${audience.accent}20 50%)`
                                    }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
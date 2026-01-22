import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Gem, Crown, Sparkles } from 'lucide-react';

export default function CollectionsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const collections = [
        {
            icon: Gem,
            name: "The Noble Collection",
            price: "$500 – $2,000",
            description: "Heavy sterling silver. Rajasthani craftsmanship. For the well-equipped.",
            accent: "#4a0e4e"
        },
        {
            icon: Crown,
            name: "The Bridal Collection",
            price: "$3,000 – $10,000",
            description: "Your engagement ring shouldn't look like everyone else's. Platinum. Gold. Spinel. Heritage.",
            accent: "#8b0000"
        },
        {
            icon: Sparkles,
            name: "Royal Commissions",
            price: "$15,000+",
            description: "One-of-a-kind pieces. Private consultation only.",
            accent: "#1e3a29"
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
                        Collections
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl text-[#f5f5f5]">
                        Choose Your Arsenal
                    </h2>
                </motion.div>

                {/* Collection cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {collections.map((collection, index) => (
                        <motion.div
                            key={collection.name}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
                            className="group relative"
                        >
                            <div
                                className="relative bg-[#111111] border border-[#1a1a1a] p-10 h-full transition-all duration-700 hover:border-[#262626] overflow-hidden"
                                style={{
                                    boxShadow: `0 0 0 0 ${collection.accent}`,
                                }}
                            >
                                {/* Hover glow effect */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                    style={{
                                        background: `radial-gradient(circle at 50% 0%, ${collection.accent}15 0%, transparent 60%)`
                                    }}
                                />

                                {/* Icon */}
                                <div className="relative mb-8">
                                    <div
                                        className="w-14 h-14 flex items-center justify-center border transition-all duration-500 group-hover:border-opacity-50"
                                        style={{ borderColor: collection.accent }}
                                    >
                                        <collection.icon
                                            className="w-6 h-6 transition-all duration-500"
                                            style={{ color: collection.accent }}
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative">
                                    <h3 className="font-serif text-xl text-[#f5f5f5] mb-2">
                                        {collection.name}
                                    </h3>
                                    <p
                                        className="text-sm tracking-wider mb-6 font-light"
                                        style={{ color: collection.accent }}
                                    >
                                        {collection.price}
                                    </p>
                                    <p className="text-[#737373] text-sm leading-relaxed font-light">
                                        {collection.description}
                                    </p>
                                </div>

                                {/* Bottom line accent */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-px transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
                                    style={{ backgroundColor: collection.accent }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
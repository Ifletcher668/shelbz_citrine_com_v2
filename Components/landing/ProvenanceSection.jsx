import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Mountain, Hammer, User, ArrowRight, Building2, Factory, Store } from 'lucide-react';

export default function ProvenanceSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const ourJourney = [
        { icon: Mountain, label: "Mine" },
        { icon: Hammer, label: "Artisan" },
        { icon: User, label: "You" }
    ];

    const typicalJourney = [
        { icon: Building2, label: "Broker" },
        { icon: Factory, label: "Manufacturer" },
        { icon: Store, label: "Retailer" },
        { icon: User, label: "You" }
    ];

    return (
        <section id="provenance" ref={ref} className="relative py-32 bg-[#0d0d0d]">
            {/* Top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#262626] to-transparent" />

            <div className="max-w-5xl mx-auto px-6">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="text-[#8b0000] tracking-[0.3em] text-xs uppercase font-light mb-4 block">
                        Provenance
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl text-[#f5f5f5] mb-8">
                        Mine to Hand
                    </h2>
                    <p className="text-[#a3a3a3] max-w-2xl mx-auto text-lg leading-relaxed font-light">
                        We don&apos;t buy from brokers. Our partner owns the mines and carries aristocratic lineage.
                        This is <span className="text-[#f5f5f5] italic">heritage meeting modern fantasy.</span>
                    </p>
                </motion.div>

                {/* Journey diagrams */}
                <div className="space-y-16">
                    {/* Our journey */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-gradient-to-r from-[#4a0e4e]/5 via-[#111111] to-[#8b0000]/5 border border-[#1a1a1a] p-10"
                    >
                        <p className="text-[#4a0e4e] tracking-[0.2em] text-xs uppercase mb-8 text-center font-light">
                            Our Supply Chain
                        </p>
                        <div className="flex items-center justify-center gap-4 md:gap-8">
                            {ourJourney.map((step, index) => (
                                <React.Fragment key={step.label}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="w-16 h-16 md:w-20 md:h-20 border border-[#8b0000]/30 flex items-center justify-center mb-3 bg-[#0a0a0a]/50">
                                            <step.icon className="w-6 h-6 md:w-8 md:h-8 text-[#8b0000]" />
                                        </div>
                                        <span className="text-[#f5f5f5] text-sm font-light">{step.label}</span>
                                    </motion.div>
                                    {index < ourJourney.length - 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, scaleX: 0 }}
                                            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
                                            transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                                        >
                                            <ArrowRight className="w-5 h-5 text-[#4a0e4e]" />
                                        </motion.div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </motion.div>

                    {/* Typical journey */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="bg-[#111111]/50 border border-[#1a1a1a]/50 p-10 opacity-60"
                    >
                        <p className="text-[#525252] tracking-[0.2em] text-xs uppercase mb-8 text-center font-light">
                            Typical Industry Supply Chain
                        </p>
                        <div className="flex items-center justify-center gap-3 md:gap-6 flex-wrap">
                            {typicalJourney.map((step, index) => (
                                <React.Fragment key={step.label}>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 md:w-14 md:h-14 border border-[#262626] flex items-center justify-center mb-3">
                                            <step.icon className="w-5 h-5 md:w-6 md:h-6 text-[#525252]" />
                                        </div>
                                        <span className="text-[#525252] text-xs font-light">{step.label}</span>
                                    </div>
                                    {index < typicalJourney.length - 1 && (
                                        <ArrowRight className="w-4 h-4 text-[#333333]" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
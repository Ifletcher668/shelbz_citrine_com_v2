import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative py-20 bg-[#0a0a0a]">
            {/* Top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1a1a1a] to-transparent" />

            <div className="max-w-5xl mx-auto px-6">
                <div className="flex flex-col items-center text-center">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <h3 className="font-serif text-2xl text-[#f5f5f5] tracking-wide">
                            Heritage
                        </h3>
                        <p className="text-[#4a0e4e] tracking-[0.3em] text-xs uppercase mt-1">
                            Dark Luxury
                        </p>
                    </motion.div>

                    {/* Social links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="flex items-center gap-6 mb-8"
                    >
                        <a
                            href="#"
                            className="w-10 h-10 border border-[#1a1a1a] flex items-center justify-center text-[#737373] hover:text-[#f5f5f5] hover:border-[#8b0000]/50 transition-all duration-300"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a
                            href="mailto:contact@heritagedark.com"
                            className="w-10 h-10 border border-[#1a1a1a] flex items-center justify-center text-[#737373] hover:text-[#f5f5f5] hover:border-[#8b0000]/50 transition-all duration-300"
                            aria-label="Email"
                        >
                            <Mail className="w-4 h-4" />
                        </a>
                    </motion.div>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-[#525252] text-sm font-light italic mb-8"
                    >
                        &ldquo;Handcrafted in Rajasthan. Designed for those who dare.&rdquo;
                    </motion.p>

                    {/* Decorative element */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="flex items-center gap-3 mb-8"
                    >
                        <div className="w-8 h-px bg-[#1a1a1a]" />
                        <div className="w-1 h-1 bg-[#8b0000] rotate-45" />
                        <div className="w-8 h-px bg-[#1a1a1a]" />
                    </motion.div>

                    {/* Copyright */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-[#333333] text-xs tracking-wider"
                    >
                        © 2026 HERITAGE DARK LUXURY. ALL RIGHTS RESERVED.
                    </motion.p>
                </div>
            </div>
        </footer>
    );
}
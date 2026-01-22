import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle } from 'lucide-react';

export default function WaitlistSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        interest: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.interest) return;

        setIsSubmitting(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Store in localStorage for prototype purposes
        const existingSignups = JSON.parse(localStorage.getItem('waitlistSignups') || '[]');
        existingSignups.push({
            ...formData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('waitlistSignups', JSON.stringify(existingSignups));

        console.log('Waitlist signup:', formData);

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const interests = [
        { value: 'engagement_rings', label: 'Engagement Rings' },
        { value: 'statement_pieces', label: 'Statement Pieces' },
        { value: 'gaming_artifacts', label: 'Gaming Artifacts' },
        { value: 'custom_commission', label: 'Custom Commission' }
    ];

    return (
        <section id="waitlist" ref={ref} className="relative py-32 bg-[#0d0d0d]">
            {/* Top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#262626] to-transparent" />

            {/* Background accent */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#8b0000]/5 via-transparent to-transparent rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-xl mx-auto px-6">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <span className="text-[#8b0000] tracking-[0.3em] text-xs uppercase font-light mb-4 block">
                        Opening Spring 2026
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl text-[#f5f5f5] mb-4">
                        Reserve Your Place
                    </h2>
                    <p className="text-[#737373] font-light">
                        Early access to collections and private commissions
                    </p>
                </motion.div>

                {/* Form */}
                {!isSubmitted ? (
                    <motion.form
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        <div>
                            <Input
                                type="text"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-[#111111] border-[#1a1a1a] text-[#f5f5f5] placeholder:text-[#525252] focus:border-[#8b0000]/50 h-14 px-5 rounded-none transition-colors duration-300"
                                required
                            />
                        </div>

                        <div>
                            <Input
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="bg-[#111111] border-[#1a1a1a] text-[#f5f5f5] placeholder:text-[#525252] focus:border-[#8b0000]/50 h-14 px-5 rounded-none transition-colors duration-300"
                                required
                            />
                        </div>

                        <div>
                            <Select
                                value={formData.interest}
                                onValueChange={(value) => setFormData({ ...formData, interest: value })}
                                required
                            >
                                <SelectTrigger className="bg-[#111111] border-[#1a1a1a] text-[#f5f5f5] h-14 px-5 rounded-none focus:ring-[#8b0000]/50 [&>span]:text-[#525252] data-[state=open]:border-[#8b0000]/50">
                                    <SelectValue placeholder="What calls to you?" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#111111] border-[#1a1a1a] rounded-none">
                                    {interests.map((interest) => (
                                        <SelectItem
                                            key={interest.value}
                                            value={interest.value}
                                            className="text-[#a3a3a3] focus:bg-[#1a1a1a] focus:text-[#f5f5f5] cursor-pointer"
                                        >
                                            {interest.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting || !formData.name || !formData.email || !formData.interest}
                            className="w-full bg-[#8b0000] hover:bg-[#6b0000] text-[#f5f5f5] h-14 rounded-none text-sm tracking-[0.2em] uppercase font-light transition-all duration-500 disabled:opacity-30"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Reserve Your Place"
                            )}
                        </Button>
                    </motion.form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12 border border-[#1a1a1a] bg-[#111111]"
                    >
                        <CheckCircle className="w-12 h-12 text-[#8b0000] mx-auto mb-4" />
                        <h3 className="font-serif text-xl text-[#f5f5f5] mb-2">Welcome to the Circle</h3>
                        <p className="text-[#737373] font-light">We&apos;ll be in touch when the doors open.</p>
                    </motion.div>
                )}

                {/* Trust indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <p className="text-[#525252] text-xs tracking-wider">
                        NO SPAM • UNSUBSCRIBE ANYTIME • EARLY ACCESS ONLY
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
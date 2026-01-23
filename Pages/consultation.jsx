import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Header from "@/Components/layout/Header";
import Footer from "@/Components/layout/Footer";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

/**
 * Consultation Booking Page
 * Multi-step form with heavy metal aesthetic
 */
export default function Consultation() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    consultationType: "zoom",
    budgetRange: "",
    metalPreference: "",
    fingerSize: "",
    whichFinger: "ring",
    stoneType: "black-spinel",
    vision: "",
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email";
      }
    }
    if (step === 2) {
      if (!formData.budgetRange)
        newErrors.budgetRange = "Budget range required";
      if (!formData.metalPreference)
        newErrors.metalPreference = "Metal preference required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "consultation",
          ...formData,
        }).toString(),
      });

      if (response.ok) {
        router.push("/consultation/success");
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressWidth = `${(currentStep / totalSteps) * 100}%`;

  return (
    <>
      <Head>
        <title>Book Consultation | Heritage Jewelry</title>
        <meta
          name="description"
          content="Book your free consultation for a custom black spinel engagement ring. In-person in Olympia or nationwide via Zoom."
        />
        <link rel="canonical" href="https://heritagejewelry.com/consultation" />
      </Head>

      <div className="min-h-screen bg-ink-black">
        <Header />

        <main className="pb-space-10">
          <div className="section-narrow">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <h1 className="font-cinzel text-5xl text-bone-white mb-space-4">
                Book Your Consultation
              </h1>
              <p className="font-crimson text-lg text-ash-grey max-w-2xl mx-auto">
                No obligation. Just a conversation about your vision.
              </p>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-space-8">
              <div className="flex justify-between font-spectral text-sm text-charcoal-mist mb-space-3 uppercase tracking-wide">
                <span>
                  Step {currentStep} of {totalSteps}
                </span>
                <span>
                  {currentStep === 1 && "Contact Info"}
                  {currentStep === 2 && "Ring Details"}
                  {currentStep === 3 && "Your Vision"}
                </span>
              </div>
              <div className="h-1 bg-obsidian overflow-hidden metallic-border">
                <motion.div
                  className="h-full bg-aged-gold"
                  initial={{ width: 0 }}
                  animate={{ width: progressWidth }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            {/* Hidden Netlify form */}
            <form name="consultation" method="POST" data-netlify="true" hidden>
              <input type="text" name="fullName" />
              <input type="email" name="email" />
              <input type="tel" name="phone" />
              <input type="text" name="consultationType" />
              <input type="text" name="budgetRange" />
              <input type="text" name="metalPreference" />
              <input type="text" name="fingerSize" />
              <input type="text" name="whichFinger" />
              <input type="text" name="stoneType" />
              <textarea name="vision" />
            </form>

            {/* Actual Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-parchment-dark metallic-border heavy-shadow p-space-8"
            >
              {/* Step 1: Contact */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-space-5"
                >
                  <div>
                    <label htmlFor="fullName" className="form-label">
                      Full Name <span className="text-aged-gold">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className={`form-input ${errors.fullName ? "border-rust" : ""}`}
                      placeholder="Your full name"
                    />
                    {errors.fullName && (
                      <p className="text-rust text-sm mt-space-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-aged-gold">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={`form-input ${errors.email ? "border-rust" : ""}`}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="text-rust text-sm mt-space-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="form-label">
                      Phone{" "}
                      <span className="text-sepia-shadow">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="form-input"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Consultation Type{" "}
                      <span className="text-aged-gold">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-space-4">
                      {[
                        {
                          value: "in-person",
                          label: "In-Person",
                          sublabel: "Olympia, WA",
                        },
                        {
                          value: "zoom",
                          label: "Zoom",
                          sublabel: "Nationwide",
                        },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            updateField("consultationType", option.value)
                          }
                          className={`p-space-4 border text-left transition-all duration-700 ${
                            formData.consultationType === option.value
                              ? "border-aged-gold bg-aged-gold/10"
                              : "border-obsidian hover:border-charcoal-mist"
                          }`}
                        >
                          <span className="block font-spectral text-base text-bone-white uppercase tracking-wide">
                            {option.label}
                          </span>
                          <span className="font-crimson text-sm text-charcoal-mist">
                            {option.sublabel}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Ring Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-space-5"
                >
                  <div>
                    <label htmlFor="budgetRange" className="form-label">
                      Budget Range <span className="text-aged-gold">*</span>
                    </label>
                    <select
                      id="budgetRange"
                      value={formData.budgetRange}
                      onChange={(e) =>
                        updateField("budgetRange", e.target.value)
                      }
                      className={`form-select ${errors.budgetRange ? "border-rust" : ""}`}
                    >
                      <option value="">Select a range</option>
                      <option value="2k-4k">$2,000 - $4,000</option>
                      <option value="4k-7k">$4,000 - $7,000</option>
                      <option value="7k+">$7,000+</option>
                      <option value="flexible">Flexible / Discuss</option>
                    </select>
                    {errors.budgetRange && (
                      <p className="text-rust text-sm mt-space-1">
                        {errors.budgetRange}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">
                      Metal Preference <span className="text-aged-gold">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-space-3">
                      {[
                        "14kt Gold",
                        "18kt Gold",
                        "Platinum",
                        "Palladium",
                        "Unsure",
                      ].map((metal) => (
                        <button
                          key={metal}
                          type="button"
                          onClick={() => updateField("metalPreference", metal)}
                          className={`p-space-3 border font-spectral text-sm uppercase transition-all duration-700 ${
                            formData.metalPreference === metal
                              ? "border-aged-gold bg-aged-gold/10 text-bone-white"
                              : "border-obsidian text-charcoal-mist hover:border-charcoal-mist"
                          }`}
                        >
                          {metal}
                        </button>
                      ))}
                    </div>
                    {errors.metalPreference && (
                      <p className="text-rust text-sm mt-space-1">
                        {errors.metalPreference}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-space-4">
                    <div>
                      <label htmlFor="fingerSize" className="form-label">
                        Finger Size
                      </label>
                      <input
                        type="text"
                        id="fingerSize"
                        value={formData.fingerSize}
                        onChange={(e) =>
                          updateField("fingerSize", e.target.value)
                        }
                        className="form-input"
                        placeholder="e.g., 6.5"
                      />
                    </div>
                    <div>
                      <label htmlFor="whichFinger" className="form-label">
                        Which Finger
                      </label>
                      <select
                        id="whichFinger"
                        value={formData.whichFinger}
                        onChange={(e) =>
                          updateField("whichFinger", e.target.value)
                        }
                        className="form-select"
                      >
                        <option value="ring">Ring Finger</option>
                        <option value="middle">Middle</option>
                        <option value="index">Index</option>
                        <option value="pinky">Pinky</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Vision */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-space-5"
                >
                  <div>
                    <label htmlFor="vision" className="form-label">
                      Tell Us Your Vision
                    </label>
                    <textarea
                      id="vision"
                      value={formData.vision}
                      onChange={(e) => updateField("vision", e.target.value)}
                      className="form-textarea"
                      placeholder="Describe your dream ring... What style speaks to you?"
                      maxLength={500}
                      rows={6}
                    />
                    <p className="font-crimson text-xs text-sepia-shadow mt-space-1">
                      {formData.vision.length}/500 characters
                    </p>
                  </div>
                </motion.div>
              )}

              {errors.submit && (
                <p className="text-rust text-sm text-center mt-space-4">
                  {errors.submit}
                </p>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-space-8 pt-space-6 border-t border-obsidian">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary flex items-center gap-space-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary flex items-center gap-space-2"
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-space-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

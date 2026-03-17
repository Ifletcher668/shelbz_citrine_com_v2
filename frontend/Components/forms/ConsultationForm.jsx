import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { ChevronRight, ChevronLeft, Upload, X, Loader2 } from "lucide-react";

/**
 * Multi-step Consultation Form
 *
 * Step 1: Contact & Consultation Type
 * Step 2: Ring Details (budget, metal, size, stone)
 * Step 3: Vision & Photos (uploads, textarea)
 *
 * Uses Netlify Forms for submission (data-netlify="true")
 */
export default function ConsultationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    // Step 1
    fullName: "",
    email: "",
    phone: "",
    consultationType: "zoom",
    // Step 2
    budgetRange: "",
    metalPreference: "",
    fingerSize: "",
    whichFinger: "ring",
    stoneType: "black-spinel",
    stoneOther: "",
    // Step 3
    vision: "",
    designPhotos: [],
    handPhoto: null,
  });

  const totalSteps = 3;

  // Update form field
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
    }

    if (step === 2) {
      if (!formData.budgetRange)
        newErrors.budgetRange = "Please select a budget range";
      if (!formData.metalPreference)
        newErrors.metalPreference = "Please select a metal preference";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // File handling
  const handleFileChange = (e, field, multiple = false) => {
    const files = Array.from(e.target.files);
    if (multiple) {
      updateField(field, [...formData[field], ...files].slice(0, 5));
    } else {
      updateField(field, files[0] || null);
    }
  };

  const removeFile = (field, index = null) => {
    if (index !== null) {
      updateField(
        field,
        formData[field].filter((_, i) => i !== index),
      );
    } else {
      updateField(field, null);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    // Build form data for Netlify
    const netlifyFormData = new FormData();
    netlifyFormData.append("form-name", "consultation");
    netlifyFormData.append("fullName", formData.fullName);
    netlifyFormData.append("email", formData.email);
    netlifyFormData.append("phone", formData.phone);
    netlifyFormData.append("consultationType", formData.consultationType);
    netlifyFormData.append("budgetRange", formData.budgetRange);
    netlifyFormData.append("metalPreference", formData.metalPreference);
    netlifyFormData.append("fingerSize", formData.fingerSize);
    netlifyFormData.append("whichFinger", formData.whichFinger);
    netlifyFormData.append("stoneType", formData.stoneType);
    netlifyFormData.append("stoneOther", formData.stoneOther);
    netlifyFormData.append("vision", formData.vision);

    try {
      const response = await fetch("/", {
        method: "POST",
        body: netlifyFormData,
      });

      if (response.ok) {
        router.push("/consultation/success");
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress bar width
  const progressWidth = `${(currentStep / totalSteps) * 100}%`;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate mb-1">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>
            {currentStep === 1 && "Contact Info"}
            {currentStep === 2 && "Ring Details"}
            {currentStep === 3 && "Your Vision"}
          </span>
        </div>
        <div className="h-1 bg-charcoal overflow-hidden">
          <motion.div
            className="h-full bg-body"
            initial={{ width: 0 }}
            animate={{ width: progressWidth }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Form - Hidden Netlify form for form detection */}
      <form
        name="consultation"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        hidden
      >
        <input type="text" name="fullName" />
        <input type="email" name="email" />
        <input type="tel" name="phone" />
        <input type="text" name="consultationType" />
        <input type="text" name="budgetRange" />
        <input type="text" name="metalPreference" />
        <input type="text" name="fingerSize" />
        <input type="text" name="whichFinger" />
        <input type="text" name="stoneType" />
        <input type="text" name="stoneOther" />
        <textarea name="vision" />
      </form>

      {/* Actual form with steps */}
      <form onSubmit={handleSubmit}>
        {/* Honeypot for spam protection */}
        <input type="hidden" name="form-name" value="consultation" />
        <p className="hidden">
          <label>
            Don&apos;t fill this out: <input name="bot-field" />
          </label>
        </p>

        <AnimatePresence mode="wait">
          {/* Step 1: Contact Info */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="fullName" className="form-label">
                  Full Name <span className="text-body">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className={`form-input ${errors.fullName ? "border-red-500" : ""}`}
                  placeholder="Your full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Email <span className="text-body">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={`form-input ${errors.email ? "border-red-500" : ""}`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="form-label">
                  Phone <span className="text-slate">(optional)</span>
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
                  Consultation Type <span className="text-body">*</span>
                </label>
                <div className="grid grid-cols-2 gap-5">
                  {[
                    {
                      value: "in-person",
                      label: "In-Person",
                      sublabel: "Olympia",
                    },
                    { value: "zoom", label: "Zoom", sublabel: "Nationwide" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        updateField("consultationType", option.value)
                      }
                      className={`p-3 border text-left transition-all ${
                        formData.consultationType === option.value
                          ? "border-body bg-body/10"
                          : "border-charcoal hover:border-slate"
                      }`}
                    >
                      <span className="block text-bone">{option.label}</span>
                      <span className="text-sm text-slate">
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="budgetRange" className="form-label">
                  Budget Range <span className="text-body">*</span>
                </label>
                <select
                  id="budgetRange"
                  value={formData.budgetRange}
                  onChange={(e) => updateField("budgetRange", e.target.value)}
                  className={`form-input ${errors.budgetRange ? "border-red-500" : ""}`}
                >
                  <option value="">Select a range</option>
                  <option value="2k-4k">$2,000 - $4,000</option>
                  <option value="4k-7k">$4,000 - $7,000</option>
                  <option value="7k+">$7,000+</option>
                  <option value="flexible">Flexible / Discuss</option>
                </select>
                {errors.budgetRange && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.budgetRange}
                  </p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Metal Preference <span className="text-body">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "14kt-gold", label: "14kt Gold" },
                    { value: "18kt-gold", label: "18kt Gold" },
                    { value: "platinum", label: "Platinum" },
                    { value: "palladium", label: "Palladium" },
                    { value: "unsure", label: "Unsure / Discuss" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        updateField("metalPreference", option.value)
                      }
                      className={`p-2 border text-sm transition-all ${
                        formData.metalPreference === option.value
                          ? "border-body bg-body/10 text-bone"
                          : "border-charcoal text-silver hover:border-slate"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.metalPreference && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.metalPreference}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label htmlFor="fingerSize" className="form-label">
                    Finger Size <span className="text-slate">(if known)</span>
                  </label>
                  <input
                    type="text"
                    id="fingerSize"
                    value={formData.fingerSize}
                    onChange={(e) => updateField("fingerSize", e.target.value)}
                    className="form-input"
                    placeholder="e.g., 6.5"
                  />
                  <a
                    href="https://www.bluenile.com/ring-sizer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-body hover:text-ember mt-1 inline-block"
                  >
                    Need help sizing?
                  </a>
                </div>

                <div>
                  <label htmlFor="whichFinger" className="form-label">
                    Which Finger
                  </label>
                  <select
                    id="whichFinger"
                    value={formData.whichFinger}
                    onChange={(e) => updateField("whichFinger", e.target.value)}
                    className="form-input"
                  >
                    <option value="ring">Ring Finger</option>
                    <option value="middle">Middle Finger</option>
                    <option value="index">Index Finger</option>
                    <option value="pinky">Pinky Finger</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Stone Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => updateField("stoneType", "black-spinel")}
                    className={`p-2 border text-sm transition-all ${
                      formData.stoneType === "black-spinel"
                        ? "border-body bg-body/10 text-bone"
                        : "border-charcoal text-silver hover:border-slate"
                    }`}
                  >
                    Black Spinel
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField("stoneType", "other")}
                    className={`p-2 border text-sm transition-all ${
                      formData.stoneType === "other"
                        ? "border-body bg-body/10 text-bone"
                        : "border-charcoal text-silver hover:border-slate"
                    }`}
                  >
                    Other Stone
                  </button>
                </div>
                {formData.stoneType === "other" && (
                  <input
                    type="text"
                    value={formData.stoneOther}
                    onChange={(e) => updateField("stoneOther", e.target.value)}
                    className="form-input mt-2"
                    placeholder="Please describe the stone you're interested in"
                  />
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Vision & Photos */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="vision" className="form-label">
                  Tell Us Your Vision
                </label>
                <textarea
                  id="vision"
                  value={formData.vision}
                  onChange={(e) => updateField("vision", e.target.value)}
                  className="form-input min-h-[150px]"
                  placeholder="Describe your dream ring... What style speaks to you? Any specific details or inspirations?"
                  maxLength={500}
                />
                <p className="text-xs text-slate mt-1">
                  {formData.vision.length}/500 characters
                </p>
              </div>

              <div>
                <label className="form-label">
                  Design Inspiration{" "}
                  <span className="text-slate">(optional, up to 5 images)</span>
                </label>
                <div className="border border-dashed border-charcoal p-5 text-center hover:border-slate transition-colors">
                  <input
                    type="file"
                    id="designPhotos"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, "designPhotos", true)}
                    className="hidden"
                  />
                  <label htmlFor="designPhotos" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-slate mx-auto mb-1" />
                    <p className="text-sm text-silver">
                      Click to upload reference photos
                    </p>
                    <p className="text-xs text-slate mt-1">
                      PNG, JPG up to 5MB each
                    </p>
                  </label>
                </div>
                {formData.designPhotos.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-5">
                    {formData.designPhotos.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-5 bg-charcoal px-2 py-1 text-sm"
                      >
                        <span className="text-silver truncate max-w-[150px]">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile("designPhotos", index)}
                          className="text-slate hover:text-bone"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">
                  Hand/Skin Tone Photo{" "}
                  <span className="text-slate">
                    (optional, for color matching)
                  </span>
                </label>
                <div className="border border-dashed border-charcoal p-5 text-center hover:border-slate transition-colors">
                  <input
                    type="file"
                    id="handPhoto"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "handPhoto")}
                    className="hidden"
                  />
                  <label htmlFor="handPhoto" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-slate mx-auto mb-1" />
                    <p className="text-sm text-silver">
                      Upload a photo of your hand
                    </p>
                    <p className="text-xs text-slate mt-1">
                      Helps us recommend metals that complement your skin tone
                    </p>
                  </label>
                </div>
                {formData.handPhoto && (
                  <div className="mt-2 flex items-center gap-5 bg-charcoal px-2 py-1">
                    <span className="text-silver text-sm truncate">
                      {formData.handPhoto.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile("handPhoto")}
                      className="text-slate hover:text-bone ml-auto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        {errors.submit && (
          <p className="text-red-500 text-sm mt-3 text-center">
            {errors.submit}
          </p>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pt-5 border-t border-charcoal">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="btn-secondary flex items-center gap-5"
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
              className="btn-primary flex items-center gap-5"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Consultation Request"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

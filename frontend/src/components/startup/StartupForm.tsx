"use client";

import { useForm } from "react-hook-form";
import { Rocket, Sparkles, Lightbulb, Users, DollarSign, Calendar, Info, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useStartupStream } from "@/hooks/useStartupStream";
import { useStore } from "@/store";
import type { StartupFormData } from "@/types";

const INDUSTRY_OPTIONS = [
  // Tech
  "SaaS / Software", "AI / Machine Learning", "FinTech / Payments",
  "EdTech / Online Learning", "HealthTech / MedTech", "LegalTech",
  "E-Commerce / D2C", "Marketplace / Platform", "Gaming / Entertainment",
  "Cybersecurity", "DevTools / Developer Infrastructure", "CleanTech / Sustainability",
  // Non-tech
  "Food & Beverage", "Retail / Fashion", "Beauty / Wellness",
  "Real Estate / PropTech", "Travel / Hospitality", "Logistics / Supply Chain",
  "Agriculture / AgriTech", "Manufacturing / Hardware",
  // Services
  "Consulting / Professional Services", "Media / Content / Creator Economy",
  "Social Enterprise / NGO / Impact", "Education (traditional)",
  "Healthcare Services (clinic, pharmacy)", "Coaching / Training",
  // Other
  "Other (describe in pitch section)",
];

const BUSINESS_TYPE_OPTIONS = [
  "Software product (SaaS, app, platform)",
  "Physical product (hardware, consumer goods)",
  "Service business (agency, consulting, freelance)",
  "Marketplace (connecting buyers and sellers)",
  "Community / Media / Content",
  "Social enterprise / NGO",
  "Hybrid (product + services)",
  "Still figuring it out",
];

const BUDGET_OPTIONS = [
  "Bootstrapped — under $1,000",
  "Bootstrapped — $1,000 to $10,000",
  "Personal savings — $10,000 to $50,000",
  "Friends & family round — $50,000 to $150,000",
  "Angel / pre-seed funded — $150,000 to $500,000",
  "Seed funded — $500,000+",
  "Actively seeking first funding",
];

const TEAM_OPTIONS = [
  "Solo founder (just me)",
  "2 co-founders",
  "3–5 people (small founding team)",
  "5–10 people (early team)",
  "10+ people",
];

const STAGE_OPTIONS = [
  "Idea stage — nothing built yet",
  "Validation stage — talking to customers",
  "MVP in progress — building now",
  "MVP launched — early users/customers",
  "Product-market fit — growing",
  "Scaling — looking for investment",
];

const GEOGRAPHY_OPTIONS = [
  "India", "United States", "United Kingdom", "Europe (other)",
  "Southeast Asia", "Middle East / Gulf", "Africa", "Latin America",
  "Australia / New Zealand", "Canada", "Global from day one",
];

export function StartupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<StartupFormData>();
  const { run } = useStartupStream();
  const { startupResult, setUserName } = useStore();

  const onSubmit = (data: StartupFormData) => {
    if (data.name) setUserName(data.name);
    run(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-8 animate-fade-up">
        <div className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
          <Rocket size={15} />
          Startup Venture Advisor — All Business Types
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Validate your business idea
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto">
          From SaaS to food brands, from solo freelancers to funded teams — Aether evaluates your specific idea with deep market analysis, competitor intelligence, and a week-by-week launch plan.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 mb-6">
        <Info size={16} className="text-violet-500 mt-0.5 flex-shrink-0" />
        <p className="text-violet-700 dark:text-violet-300 text-xs leading-relaxed">
          <strong>The more specific you are, the better the analysis.</strong> Don&apos;t write &quot;I want to build an app&quot; — write exactly what it does, who it&apos;s for, and what problem it solves. That specificity is what makes the report truly useful.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4">

          {/* ── Founder Profile ── */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-zinc-800">
                <Users size={15} className="text-violet-500" />
                Founder Profile
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Your Name</label>
                  <input {...register("name")} placeholder="e.g. Arjun Mehta"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Team Size</label>
                  <select {...register("teamSize")}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition">
                    {TEAM_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Your Background & Skills
                </label>
                <textarea {...register("techSkills")} rows={2}
                  placeholder="e.g. 5 years as a software engineer, strong in React and Python... OR MBA with 3 years in marketing, no coding skills... OR Trained nurse with business management background... OR Serial entrepreneur, 1 previous exit in e-commerce..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none" />
              </div>
            </CardContent>
          </Card>

          {/* ── The Business Idea ── */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-zinc-800">
                <Lightbulb size={15} className="text-violet-500" />
                The Business Idea
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Describe Your Business Idea <span className="text-rose-500">*</span>
                </label>
                <textarea {...register("idea", { required: "Please describe your business idea" })} rows={4}
                  placeholder="Be specific and detailed. Describe:&#10;• What your product or service actually does&#10;• How it works (the mechanism)&#10;• Why it's different from what exists&#10;• What makes it uniquely valuable&#10;&#10;Example: 'A mobile app that uses AI to help independent pharmacies manage their inventory — predicting demand by season, location, and patient demographics to reduce waste by 30%...'"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none" />
                {errors.idea && <p className="text-xs text-rose-500 mt-1">{errors.idea.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  The Problem You&apos;re Solving <span className="text-rose-500">*</span>
                </label>
                <textarea {...register("problem", { required: "Please describe the problem you solve" })} rows={3}
                  placeholder="Describe the pain point in detail:&#10;• What frustration or inefficiency does your customer experience today?&#10;• How do they currently deal with this problem?&#10;• How often does this problem occur, and how painful is it?&#10;• Why haven't existing solutions solved it adequately?&#10;&#10;Example: 'Independent pharmacies lose 15–20% of revenue to expired or overstocked medication. They currently manage inventory in Excel spreadsheets or rely on gut feeling — there's no affordable, pharmacy-specific tool for this...'"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none" />
                {errors.problem && <p className="text-xs text-rose-500 mt-1">{errors.problem.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Your Target Audience / Customer <span className="text-rose-500">*</span>
                </label>
                <textarea {...register("audience", { required: "Please define your target audience" })} rows={2}
                  placeholder="Be as specific as possible — not just 'small businesses' or 'students'&#10;&#10;Example: 'Independent pharmacies with 1–5 locations in Tier 2 Indian cities, owned by pharmacists who are 35–55 years old with limited tech experience but smartphone-comfortable...'"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none" />
                {errors.audience && <p className="text-xs text-rose-500 mt-1">{errors.audience.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* ── Market & Resources ── */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-zinc-800">
                <DollarSign size={15} className="text-violet-500" />
                Market & Resources
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Industry / Sector</label>
                  <select {...register("industry")}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition">
                    <option value="">Select your industry</option>
                    {INDUSTRY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Business Type</label>
                  <select {...register("timeline")}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition">
                    <option value="">Select business type</option>
                    {BUSINESS_TYPE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Budget / Funding Stage</label>
                  <select {...register("budget")}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition">
                    <option value="">Select budget range</option>
                    {BUDGET_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    <Globe size={12} className="inline mr-1" />
                    Primary Market / Geography
                  </label>
                  <select {...register("teamSize")}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition">
                    <option value="">Select your market</option>
                    {GEOGRAPHY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Current Stage</label>
                <select
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                  defaultValue=""
                >
                  <option value="">Select your current stage</option>
                  {STAGE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* ── Additional Context ── */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-zinc-800">
                <Calendar size={15} className="text-violet-500" />
                Additional Context
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Anything else Aether should know?
                </label>
                <textarea rows={3}
                  placeholder="This is your chance to add anything important:&#10;• Do you have any existing customers, revenue, or commitments?&#10;• Have you validated the idea in any way (interviews, surveys, pre-orders)?&#10;• Are there any regulatory, legal, or industry-specific challenges you're aware of?&#10;• What is your unfair advantage — domain expertise, network, patents, exclusive access?&#10;• What are you most worried about with this idea?"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none" />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            size="lg"
            loading={startupResult.isStreaming}
            className="w-full bg-violet-600 hover:bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.35)]"
          >
            <Sparkles size={16} />
            {startupResult.isStreaming
              ? "Generating your startup report…"
              : "Generate My Startup Viability Report"}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            Analysis typically takes 30–60 seconds · Works for all business types and industries
          </p>
        </div>
      </form>
    </div>
  );
}
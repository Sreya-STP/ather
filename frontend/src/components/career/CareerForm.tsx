"use client";

import { useForm } from "react-hook-form";
import { GraduationCap, Sparkles, User, BookOpen, Code, Target, Briefcase, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useCareerStream } from "@/hooks/useCareerStream";
import { useStore } from "@/store";
import type { CareerFormData } from "@/types";

const YEAR_OPTIONS = [
  "1st Year Student", "2nd Year Student", "3rd Year Student", "4th Year / Final Year Student",
  "Recent Graduate (< 1 year)", "1–2 Years of Work Experience", "3–5 Years of Work Experience",
  "5–10 Years of Work Experience", "10+ Years of Work Experience", "Career Switcher",
  "Returning to Work", "Freelancer / Self-employed",
];

const FIELD_OPTIONS = [
  // Tech
  "Computer Science / Software Engineering", "Data Science / AI / Machine Learning",
  "Electrical / Electronics Engineering", "Mechanical Engineering", "Civil Engineering",
  "Information Technology / Systems",
  // Business
  "Business Administration / Management", "Finance / Accounting", "Marketing / Advertising",
  "Human Resources", "Operations / Supply Chain", "Entrepreneurship",
  // Health
  "Medicine / MBBS", "Nursing / Healthcare", "Pharmacy", "Dentistry",
  "Public Health / Epidemiology", "Physiotherapy / Allied Health",
  // Law & Social
  "Law / Legal Studies", "Psychology", "Social Work", "Education / Teaching",
  "Political Science / Public Policy", "Economics",
  // Creative
  "Design (UI/UX, Graphic, Product)", "Architecture", "Fine Arts / Visual Arts",
  "Journalism / Media / Communications", "Film / Theatre / Performing Arts",
  // Science
  "Biology / Biotechnology", "Chemistry / Biochemistry", "Physics",
  "Environmental Science", "Research / Academia",
  // Other
  "Hospitality / Tourism", "Agriculture", "Other (describe in comments)",
];

const GOAL_OPTIONS = [
  // Tech
  "Software Engineer / Developer", "Data Scientist / Analyst", "Machine Learning Engineer",
  "Product Manager", "UX / Product Designer", "DevOps / Cloud Engineer", "Cybersecurity Analyst",
  // Business
  "Business Analyst", "Marketing Manager", "Financial Analyst / Investment Banker",
  "HR Manager / Recruiter", "Management Consultant", "Entrepreneur / Startup Founder",
  // Health
  "Doctor / Physician", "Nurse / Healthcare Professional", "Clinical Researcher",
  "Pharmacist", "Public Health Officer",
  // Law & Social
  "Lawyer / Legal Counsel", "Judge / Public Servant", "Teacher / Professor / Educator",
  "Social Worker / Counsellor", "Journalist / Writer",
  // Creative
  "Graphic / UI Designer", "Architect", "Film-maker / Director", "Content Creator",
  // Research
  "Academic Researcher / PhD", "Scientist / Research Analyst",
  // Other
  "Government / Civil Services", "NGO / Non-profit Worker", "Other (describe below)",
];

export function CareerForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CareerFormData>();
  const { run } = useCareerStream();
  const { careerResult, setUserName } = useStore();

  const major = watch("major");
  const isTechField = major && (
    major.includes("Computer") || major.includes("Software") || major.includes("Data") ||
    major.includes("AI") || major.includes("IT") || major.includes("Information")
  );

  const onSubmit = (data: CareerFormData) => {
    if (data.name) setUserName(data.name);
    run(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-8 animate-fade-up">
        <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
          <GraduationCap size={15} />
          Career Intelligence — All Fields Welcome
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Get your personalised career roadmap
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto">
          Whether you&apos;re a medical student, law graduate, software engineer, teacher, designer, or entrepreneur — Aether builds a career plan tailored specifically to your field and goals.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 mb-6 text-sm">
        <Info size={16} className="text-brand-500 mt-0.5 flex-shrink-0" />
        <p className="text-brand-700 dark:text-brand-300 text-xs leading-relaxed">
          <strong>Works for every field.</strong> Share as much detail as you can — the richer your input, the more personalised and actionable the AI analysis. Fields marked * are required.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4">

          {/* ── Basic Info ── */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-zinc-800">
                <User size={15} className="text-brand-500" />
                About You
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Your Name</label>
                  <input {...register("name")} placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Career Stage <span className="text-rose-500">*</span>
                  </label>
                  <select {...register("year", { required: "Please select your career stage" })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition">
                    <option value="">Select your stage</option>
                    {YEAR_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  {errors.year && <p className="text-xs text-rose-500 mt-1">{errors.year.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Field of Study / Professional Domain <span className="text-rose-500">*</span>
                </label>
                <select {...register("major", { required: "Please select your field" })}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition">
                  <option value="">Select your field</option>
                  {FIELD_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
                {errors.major && <p className="text-xs text-rose-500 mt-1">{errors.major.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* ── Skills & Knowledge ── */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-zinc-800">
                <Code size={15} className="text-brand-500" />
                Skills & Knowledge
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  {isTechField
                    ? "Technical Skills & Tools"
                    : "Professional Skills, Tools & Competencies"
                  } <span className="text-rose-500">*</span>
                </label>
                <textarea {...register("skills", { required: "Please describe your skills" })} rows={3}
                  placeholder={isTechField
                    ? "e.g. Python, JavaScript, React, SQL, TensorFlow, Docker, AWS..."
                    : "e.g. Patient assessment, clinical documentation, medical terminology... OR Legal research, contract drafting, Westlaw... OR Financial modelling, Excel, Bloomberg, valuation... OR Adobe Suite, Figma, typography, brand design..."
                  }
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition resize-none" />
                {errors.skills && <p className="text-xs text-rose-500 mt-1">{errors.skills.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Subjects Studied / Courses / Training Completed
                </label>
                <textarea {...register("subjects")} rows={2}
                  placeholder="e.g. Anatomy, Pharmacology, Internal Medicine... OR Corporate Law, Criminal Procedure, Moot Court... OR Financial Accounting, Corporate Finance, Econometrics... OR UI Design, Typography, Motion Graphics..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Certifications, Licences & Qualifications
                </label>
                <input {...register("certifications")}
                  placeholder="e.g. USMLE Step 1, Bar Exam, CFA Level 1, AWS Certified, IELTS, ACCA, Google Analytics, Adobe Certified..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition" />
              </div>
            </CardContent>
          </Card>

          {/* ── Projects & Experience ── */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-zinc-800">
                <BookOpen size={15} className="text-brand-500" />
                Portfolio, Projects & Experience
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Projects, Portfolio & Work Samples <span className="text-rose-500">*</span>
                </label>
                <textarea {...register("projects", { required: "Please describe at least one project or piece of work" })} rows={3}
                  placeholder="e.g. Built a patient management app for a rural clinic... OR Wrote a 50-page dissertation on IP law in the digital economy... OR Designed a brand identity for a local startup... OR Published 3 research papers on gene expression... OR Created a financial model for a $10M acquisition..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition resize-none" />
                {errors.projects && <p className="text-xs text-rose-500 mt-1">{errors.projects.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Work Experience, Internships, Volunteering & Clinical Placements
                </label>
                <textarea {...register("experience")} rows={2}
                  placeholder="e.g. 3-month clinical internship at City Hospital... OR 6-month paralegal internship at a litigation firm... OR 1-year marketing coordinator at a fintech startup... OR Freelance graphic design for 2 years..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition resize-none" />
              </div>
            </CardContent>
          </Card>

          {/* ── Goals ── */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-zinc-800">
                <Target size={15} className="text-brand-500" />
                Career Goals
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Target Role or Career Direction <span className="text-rose-500">*</span>
                </label>
                <select {...register("goal", { required: "Please select a target role" })}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition">
                  <option value="">Select your target role</option>
                  {GOAL_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
                {errors.goal && <p className="text-xs text-rose-500 mt-1">{errors.goal.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Additional Context for Aether
                </label>
                <textarea {...register("extra")} rows={3}
                  placeholder="Tell Aether anything else that's relevant:&#10;• What type of organisation do you want to work in? (hospital, law firm, startup, NGO, government, corporate, freelance)&#10;• Are you open to relocation or do you need remote work?&#10;• Are you planning further education (Masters, PhD, MBA, Medical residency)?&#10;• Any specific challenges you're facing (visa issues, career gap, non-traditional background)?&#10;• What does success look like in 2–3 years?"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition resize-none" />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" loading={careerResult.isStreaming} className="w-full">
            <Sparkles size={16} />
            {careerResult.isStreaming
              ? "Generating your personalised report…"
              : "Generate My Career Intelligence Report"}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            Analysis typically takes 20–45 seconds · Works for all fields and career stages
          </p>
        </div>
      </form>
    </div>
  );
}

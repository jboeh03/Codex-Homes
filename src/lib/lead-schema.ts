import { z } from "zod";

export const projectTypes = [
  "kitchen",
  "bathroom",
  "basement",
  "whole-home",
  "addition",
  "outdoor",
  "handyman",
  "other",
] as const;

export const timelines = [
  "asap",
  "1-3-months",
  "3-6-months",
  "6-12-months",
  "exploring",
] as const;

export const budgetBands = [
  "under-15k",
  "15-35k",
  "35-75k",
  "75-150k",
  "150-300k",
  "300k-plus",
  "unsure",
] as const;

export const leadSchema = z.object({
  projectType: z.enum(projectTypes),
  rooms: z.array(z.string()).max(20).default([]),
  scopeNotes: z.string().max(2000).optional().default(""),
  timeline: z.enum(timelines),
  budget: z.enum(budgetBands),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(40),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Use a 5-digit Cincinnati-area zip"),
  address: z.string().max(240).optional().default(""),
  photoUrls: z.array(z.string().url()).max(12).optional().default([]),
  source: z.string().max(120).optional().default(""),
  designerSessionId: z.string().uuid().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const projectTypeLabels: Record<(typeof projectTypes)[number], string> = {
  kitchen: "Kitchen remodel",
  bathroom: "Bathroom remodel",
  basement: "Basement finishing",
  "whole-home": "Whole-home renovation",
  addition: "Addition",
  outdoor: "Outdoor / deck / patio",
  handyman: "Handyman / small project",
  other: "Something else",
};

export const timelineLabels: Record<(typeof timelines)[number], string> = {
  asap: "ASAP",
  "1-3-months": "1–3 months",
  "3-6-months": "3–6 months",
  "6-12-months": "6–12 months",
  exploring: "Just exploring",
};

export const budgetLabels: Record<(typeof budgetBands)[number], string> = {
  "under-15k": "Under $15k",
  "15-35k": "$15k – $35k",
  "35-75k": "$35k – $75k",
  "75-150k": "$75k – $150k",
  "150-300k": "$150k – $300k",
  "300k-plus": "$300k+",
  unsure: "Not sure yet",
};

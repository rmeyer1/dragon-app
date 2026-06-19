import type { ReactNode } from 'react';

export type VisitorIntent = 'hire' | 'client';

export interface ProfileSummary {
  name: string;
  headline: string;
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl?: string;
  intro: string;
}

export interface StoryChapter {
  id: string;
  label: string;
  title: string;
  body: string;
}

export interface ProofMetric {
  id: string;
  value: string;
  label: string;
  description: string;
}

export interface CaseStudyProject {
  id: string;
  name: string;
  tagline: string;
  problem: string;
  role: string;
  outcome: string;
  image: string;
  link?: string;
  repositoryUrl?: string;
  techStack: string[];
}

export interface ContactLink {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
}

export interface IntentPath {
  id: VisitorIntent;
  label: string;
  title: string;
  description: string;
  cta: string;
}

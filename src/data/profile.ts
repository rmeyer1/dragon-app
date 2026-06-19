import type {
  CaseStudyProject,
  IntentPath,
  ProfileSummary,
  ProofMetric,
  StoryChapter,
} from '@/types/profile';

export const profileSummary: ProfileSummary = {
  name: 'Rob Meyer',
  headline: 'Technology and engineering leader focused on leading technology teams, enterprise AI research and implementation, and product delivery.',
  location: 'Columbus, OH',
  email: 'rob.a.meyer@outlook.com',
  githubUrl: 'https://github.com/rmeyer1',
  linkedinUrl: 'https://www.linkedin.com/in/robmeyer03/',
  resumeUrl: '#contact',
  intro:
    'I help teams reduce manual effort, improve delivery visibility, and turn complex technical work into clear business outcomes.',
};

export const intentPaths: IntentPath[] = [
  {
    id: 'hire',
    label: 'Hire me',
    title: 'For teams hiring technical product builders',
    description:
      'A senior quality engineer who can reason across product, automation, delivery risk, and the customer experience.',
    cta: 'Review my product profile',
  },
  {
    id: 'client',
    label: 'Work with me',
    title: 'For clients and collaborators',
    description:
      'A builder who can turn ambiguous ideas into practical web products, prototypes, and decision-ready technical plans.',
    cta: 'Explore project fit',
  },
];

export const proofMetrics: ProofMetric[] = [
  {
    id: 'experience',
    value: '10+',
    label: 'Years leading delivery',
    description: 'Automation strategy and implementation, technical team lead and mentor, and hands-on experience across multiple business verticals.',
  },
  {
    id: 'product',
    value: 'Product',
    label: 'Backlog, epics, and acceptance criteria',
    description:
      'Experience writing epics, maintaining and prioritizing backlogs, and defining clear technical and business acceptance criteria for engineering teams.',
  },
  {
    id: 'projects',
    value: 'Discovery',
    label: 'Customer and business insight',
    description:
      'Worked with designers on UI direction, created A/B tests for enterprise software, conducted customer interviews, and translated business and operations gaps into software solutions.',
  },
  {
    id: 'impact',
    value: 'Highlights',
    label: 'Revenue-critical delivery and executive storytelling',
    description:
      'Lead Quality Engineer for Online Checkout, a high-visibility product generating $20M-$25M per quarter where execution had to be precise and release confidence mattered. Winner of the 2023 CarMax Hackathon after leading Be My Co-Buyer and presenting the solution to multiple VPs and the CIO.',
  },
];

export const storyChapters: StoryChapter[] = [
  {
    id: 'experience',
    label: '01',
    title: '10+ years in software',
    body:
      'I have spent more than a decade building, testing, improving, and leading software delivery across enterprise teams.',
  },
  {
    id: 'ai',
    label: '02',
    title: 'Focused on AI workflows',
    body:
      'More recently, my attention has shifted toward AI, agent-based workflows, and the ways these tools can change how teams build products.',
  },
  {
    id: 'product',
    label: '03',
    title: 'Product-focused',
    body:
      'I am drawn to product work because it sits at the intersection of business needs, customer experience, and technical execution. It is the direction I am intentionally moving toward in the next stage of my career.',
  },
];

export const caseStudyProjects: CaseStudyProject[] = [
  {
    id: 'alpha-dog',
    name: 'Alpha Dog',
    tagline: 'Options strategy decision dashboard',
    problem:
      'A wheel-strategy options dashboard built to rank income opportunities only after risk, liquidity, technical context, and assignment quality are considered.',
    role:
      'Product concept, requirements shaping, technical documentation, dashboard UX, and Next.js implementation.',
    outcome:
      'Live Vercel deployment with implementation docs covering REST-first architecture, API contracts, data modeling, ranking algorithms, and frontend UX behavior.',
    image: '/images/alpha-dog.svg',
    link: 'https://alpha-dog.vercel.app/',
    repositoryUrl: 'https://github.com/rmeyer1/alpha-dog',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Zod'],
  },
  {
    id: 'signal-scribe',
    name: 'Signal Scribe',
    tagline: 'SEC filing intelligence backend',
    problem:
      'A backend agent that turns official SEC EDGAR filings into structured, auditable financial intelligence for downstream apps and agent workflows.',
    role:
      'Backend architecture, SEC ingestion flow, structured analysis design, persistence model, API surface, and optional MCP tooling.',
    outcome:
      'Today it supports ticker-to-CIK lookup, filing discovery, archive retrieval, XBRL fact extraction, OpenAI structured output, Supabase or local JSONL persistence, FastAPI endpoints, and scheduled GitHub Actions ingestion.',
    image: '/images/signal-scribe.svg',
    repositoryUrl: 'https://github.com/rmeyer1/signal-scribe',
    techStack: ['Python', 'FastAPI', 'OpenAI', 'Supabase', 'SEC EDGAR', 'MCP'],
  },
  {
    id: 'blackjack',
    name: 'Blackjack',
    tagline: 'Strategy trainer and simulator',
    problem:
      'Make blackjack strategy easier to learn through a playable interface instead of static charts.',
    role: 'Product concept, React implementation, game flow, UI states, and deployment.',
    outcome:
      'Live project available. Replace this placeholder with usage, learning, or technical outcome metrics when ready.',
    image: '/images/blackjack.png',
    link: 'https://blackjac.netlify.app/',
    techStack: ['React', 'Node.js', 'Tailwind CSS', 'Firebase'],
  },
];

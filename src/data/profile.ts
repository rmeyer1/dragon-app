import type {
  CaseStudyProject,
  IntentPath,
  ProfileSummary,
  ProofMetric,
  StoryChapter,
} from '@/types/profile';

export const profileSummary: ProfileSummary = {
  name: 'Rob Meyer',
  headline: 'Engineering & Product leader focused on enterprise AI implementation, agentic workflows, and software delivery systems for product teams.',
  location: 'Columbus, OH',
  email: 'rob.a.meyer@outlook.com',
  githubUrl: 'https://github.com/rmeyer1',
  linkedinUrl: 'https://www.linkedin.com/in/rob-meyer-3a800071/',
  resumeUrl: '/files/Rob_Meyer_Resume_2026.pdf',
  intro:
    'I help teams turn ambiguous business problems into working software: AI-assisted workflows, agent pilots, delivery systems, and the operating model needed to make them stick.',
};

export const intentPaths: IntentPath[] = [
  {
    id: 'hire',
    label: 'Hire me',
    title: 'For teams hiring forward-deployed technical leaders',
    description:
      'A hands-on engineering and product leader who can shape use cases, prototype workflows, and translate delivery risk into clear technical plans.',
    cta: 'Review my product profile',
  },
  {
    id: 'client',
    label: 'Work with me',
    title: 'For clients and collaborators',
    description:
      'A builder who can turn ambiguous ideas into practical software, agentic workflow prototypes, and decision-ready implementation plans.',
    cta: 'Explore project fit',
  },
];

export const proofMetrics: ProofMetric[] = [
  {
    id: 'experience',
    value: 'Delivery',
    label: 'Enterprise AI implementation',
    description:
      'Hands-on technical leadership across automation, agentic workflow pilots, delivery systems, and production-minded software implementation.',
  },
  {
    id: 'product',
    value: 'Product',
    label: 'Use-case shaping and product enablement',
    description:
      'Translate business problems into scoped use cases, prioritized backlogs, acceptance criteria, and implementation plans teams can actually execute.',
  },
  {
    id: 'projects',
    value: 'FDE',
    label: 'Forward-deployed execution',
    description:
      'Comfortable working close to stakeholders, uncovering operational gaps, prototyping solutions, and turning messy context into clear technical direction.',
  },
  {
    id: 'impact',
    value: 'Highlights',
    label: 'AI and delivery outcomes',
    description:
      'Led quality engineering for Online Checkout, a high-visibility product generating $20M-$25M per quarter. Won the 2023 CarMax Hackathon after leading Be My Co-Buyer from concept through executive presentation.',
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
    title: 'Agentic AI workflows',
    body:
      'I am most interested in AI when it removes real delivery friction: agent-assisted planning, clearer handoffs, faster feedback, better coverage, and less manual coordination.',
  },
  {
    id: 'product',
    label: '03',
    title: 'Product-minded',
    body:
      'I like work that sits close to the customer problem, where business context, user experience, and technical tradeoffs have to be held together.',
  },
];

export const caseStudyProjects: CaseStudyProject[] = [
  {
    id: 'alpha-dog',
    name: 'Alpha Dog',
    tagline: 'Options strategy decision dashboard',
    problem:
      'A wheel-strategy options dashboard that ranks income opportunities only after risk, liquidity, technical context, and assignment quality are considered.',
    role:
      'Shaped the product concept, requirements, technical docs, dashboard UX, and Next.js implementation.',
    outcome:
      'Published a live Vercel deployment with implementation docs for REST-first architecture, API contracts, data modeling, ranking algorithms, and frontend behavior.',
    image: '/images/alpha-dog.svg',
    link: 'https://alpha-dog.vercel.app/',
    repositoryUrl: 'https://github.com/rmeyer1/alpha-dog',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Zod'],
  },
  {
    id: 'signal-scribe',
    name: 'Signal Scribe',
    tagline: 'Agentic SEC filing intelligence backend',
    problem:
      'A backend AI system that turns official SEC EDGAR filings into structured, auditable financial intelligence for downstream apps and agent workflows.',
    role:
      'Designed the backend architecture, SEC ingestion flow, structured analysis layer, persistence model, API surface, and optional MCP tooling.',
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
    role: 'Designed the product concept, React implementation, game flow, UI states, and deployment path.',
    outcome:
      'Shipped a playable strategy trainer with responsive game states. Next step: add practice-session metrics and error-rate tracking.',
    image: '/images/blackjack.png',
    link: 'https://blackjac.netlify.app/',
    techStack: ['React', 'Node.js', 'Tailwind CSS', 'Firebase'],
  },
];

import type {
  CaseStudyProject,
  IntentPath,
  ProfileSummary,
  ProofMetric,
  StoryChapter,
} from '@/types/profile';

export const profileSummary: ProfileSummary = {
  name: 'Rob Meyer',
  headline: 'Engineering manager focused on automation, delivery systems, and practical AI workflows for software teams.',
  location: 'Columbus, OH',
  email: 'rob.a.meyer@outlook.com',
  githubUrl: 'https://github.com/rmeyer1',
  linkedinUrl: 'https://www.linkedin.com/in/rob-meyer-3a800071/',
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
    value: 'Engineering',
    label: 'Software development and delivery systems',
    description:
      'Hands-on software development, automation strategy, technical leadership, team mentoring, and delivery ownership across multiple business verticals.',
  },
  {
    id: 'product',
    value: 'Product',
    label: 'Backlogs, epics, and acceptance criteria',
    description:
      'Experience turning business needs into clear engineering work, prioritized backlogs, and acceptance criteria teams can actually build against.',
  },
  {
    id: 'projects',
    value: 'Discovery',
    label: 'Customer and business insight',
    description:
      'Worked with designers on UI direction, shaped A/B tests, conducted customer interviews, and translated operational gaps into software improvements.',
  },
  {
    id: 'impact',
    value: 'Highlights',
    label: 'Revenue-critical delivery',
    description:
      'Led quality engineering for Online Checkout, a high-visibility product generating $20M-$25M per quarter. Won the 2023 CarMax Hackathon after leading Be My Co-Buyer and presenting the solution to multiple VPs and the CIO.',
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
    title: 'Practical AI workflows',
    body:
      'I am most interested in AI when it removes real delivery friction: clearer handoffs, faster feedback, better test coverage, and less manual coordination.',
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
    tagline: 'SEC filing intelligence backend',
    problem:
      'A backend agent that turns official SEC EDGAR filings into structured, auditable financial intelligence for downstream apps and agent workflows.',
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

import GitHubCalendar from 'react-github-calendar';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Mail,
  MapPin,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import {
  caseStudyProjects,
  profileSummary,
  proofMetrics,
  storyChapters,
} from '@/data/profile';

const experienceHighlights = [
  {
    company: 'Cognizant',
    role: 'Engineering Manager',
    period: 'Feb. 2026 - Present',
    details: [
      'Manage a 25-person engineering team across four business verticals.',
      'Help lead DevEx initiatives that design, pilot, and deploy team-level AI agents.',
      'Translate delivery progress and complex technical initiatives to key technical and business stakeholders.',
    ],
  },
  {
    company: 'CarMax',
    role: 'Principal Engineer & Automation Lead',
    period: '2025 - 2026',
    details: [
      'Supported 30+ quality engineers as an internal consultant and technical leader.',
      'Standardized UI and API automation on Microsoft Playwright with shared framework templates.',
      'Advanced AI-native quality workflows through proprietary agent design and prototyping.',
    ],
  },
  {
    company: 'CarMax',
    role: 'Lead Quality Engineer - Online Checkout',
    period: '2022 - 2025',
    details: [
      'Led quality engineering for a revenue-critical online vehicle purchase product.',
      'Built a Playwright + Node.js automation framework integrated into Azure CI pipelines.',
      'Designed 150+ automated workflows enabling full-application regression in about 20 minutes.',
    ],
  },
  {
    company: 'Earlier Experience',
    role: 'Automation, software development, and implementation roles',
    period: '2014 - 2021',
    details: [
      'Held engineering and automation roles at Vantage Point Logistics, Perficient, HMB, and DHL Supply Chain.',
      'Built automation frameworks with Selenium, Python, WebDriverIO, Mocha, Behave, Splinter, Jenkins, and Azure CI.',
      'Led QA/UAT planning, EDI integration, WMS implementation support, and SQL reporting.',
    ],
  },
];

const competencyGroups = [
  'Engineering Leadership',
  'AI-Driven Transformation',
  'DevEx Strategy',
  'Technical Program Leadership',
  'Metrics-Driven Delivery',
  'Platform & Workflow Automation',
  'CI/CD & Cloud Delivery',
  'Executive Communication',
];

const SignalDeckPage = () => {
  return (
    <div className="min-h-screen bg-[#f2f2ed] px-5 pb-14 pt-24 text-slate-950 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="profile-grid grid gap-6">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4 lg:block">
              <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-slate-950 p-2 lg:h-32 lg:w-32">
                <img
                  src="/images/robAvatar.png"
                  alt="Rob Meyer avatar"
                  className="h-full w-full -translate-y-2 object-contain object-center lg:-translate-y-3"
                />
              </div>
              <div className="lg:mt-6">
                <h1 className="text-3xl font-black tracking-normal">{profileSummary.name}</h1>
                <p className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-slate-600 sm:text-xs sm:tracking-[0.16em]">
                  Engineer / Product / Investor
                </p>
              </div>
            </div>

            <p className="mt-6 border-t border-slate-200 pt-6 text-base leading-7 text-slate-600">
              {profileSummary.headline}
            </p>

            <div className="mt-6 grid gap-3 text-sm">
              <a href={`mailto:${profileSummary.email}`} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 font-semibold">
                <Mail className="h-4 w-4 text-teal-600" />
                {profileSummary.email}
              </a>
              <p className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 font-semibold">
                <MapPin className="h-4 w-4 text-teal-600" />
                {profileSummary.location}
              </p>
              <a
                href={profileSummary.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 font-semibold"
              >
                <FaGithub className="h-4 w-4 text-teal-600" />
                GitHub
              </a>
              <a
                href={profileSummary.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 font-semibold"
              >
                <FaLinkedin className="h-4 w-4 text-teal-600" />
                LinkedIn
              </a>
            </div>
          </aside>

          <main className="grid min-w-0 gap-6">
            <section id="about" className="min-w-0 max-w-full overflow-hidden scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-teal-600" />
                <h2 className="text-3xl font-black tracking-normal">About Me</h2>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {storyChapters.map((chapter) => (
                  <article key={chapter.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">{chapter.label}</p>
                    <h3 className="mt-4 text-xl font-black">{chapter.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{chapter.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="resume" className="min-w-0 max-w-full overflow-hidden scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
              <div className="flex items-center gap-3">
                <BriefcaseBusiness className="h-6 w-6 text-teal-600" />
                <h2 className="text-3xl font-black tracking-normal">Resume</h2>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {proofMetrics.map((metric) => (
                  <article key={metric.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-4xl font-black">{metric.value}</p>
                    <h3 className="mt-2 text-lg font-black">{metric.label}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{metric.description}</p>
                  </article>
                ))}
              </div>
              <div className="mt-6 grid gap-4">
                {experienceHighlights.map((item) => (
                  <article key={`${item.company}-${item.period}`} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">{item.company}</p>
                        <h3 className="mt-2 text-xl font-black">{item.role}</h3>
                      </div>
                      <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                        {item.period}
                      </p>
                    </div>
                    <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-600">
                      {item.details.map((detail) => (
                        <li key={detail}>- {detail}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-black">Core competencies</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {competencyGroups.map((competency) => (
                    <span key={competency} className="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600">
                      {competency}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-6 text-slate-600">
                  Education: BBA in Management Information Systems, Ohio University.
                </p>
              </div>
            </section>

            <section id="activity" className="min-w-0 max-w-full overflow-hidden scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
              <div className="flex items-center gap-3">
                <Code2 className="h-6 w-6 text-teal-600" />
                <h2 className="text-3xl font-black tracking-normal">GitHub Activity</h2>
              </div>
              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                A quick signal of ongoing building, experimentation, and code activity.
              </p>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-4">
                <GitHubCalendar
                  username="rmeyer1"
                  blockSize={12}
                  blockMargin={4}
                  fontSize={12}
                  hideColorLegend
                  hideMonthLabels
                  year="last"
                  colorScheme="dark"
                />
              </div>
            </section>

            <section id="projects" className="min-w-0 max-w-full overflow-hidden scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
              <div className="flex items-center gap-3">
                <Code2 className="h-6 w-6 text-teal-600" />
                <h2 className="text-3xl font-black tracking-normal">Projects</h2>
              </div>
              <div className="mt-6 grid gap-5">
                {caseStudyProjects.map((project) => (
                  <article key={project.id} className="grid overflow-hidden rounded-2xl border border-slate-200 md:grid-cols-[220px_1fr]">
                    <img src={project.image} alt="" className="h-full min-h-48 w-full object-cover" />
                    <div className="p-5">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">{project.tagline}</p>
                      <h3 className="mt-2 text-2xl font-black">{project.name}</h3>
                      <div className="mt-4 grid gap-3 leading-7 text-slate-600">
                        <p>{project.problem}</p>
                        <p>{project.role}</p>
                        <p>{project.outcome}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span key={tech} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white"
                          >
                            Live project
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        )}
                        {project.repositoryUrl && (
                          <a
                            href={project.repositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-950"
                          >
                            Code
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="contact" className="min-w-0 max-w-full overflow-hidden scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-teal-600" />
                <h2 className="text-3xl font-black tracking-normal">Contact</h2>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <a href={`mailto:${profileSummary.email}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 font-black">
                  Email
                  <span className="mt-2 block text-sm font-semibold text-slate-600">{profileSummary.email}</span>
                </a>
                <a
                  href={profileSummary.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 font-black"
                >
                  GitHub
                  <span className="mt-2 block text-sm font-semibold text-slate-600">View code and projects</span>
                </a>
                <a
                  href={profileSummary.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 font-black"
                >
                  LinkedIn
                  <span className="mt-2 block text-sm font-semibold text-slate-600">Connect professionally</span>
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SignalDeckPage;

export type HttpsUrl = `https://${string}`;
export type ProjectSlug = "send" | "shenanigan" | "brightid" | "open-source";

export const site = {
  name: "Victor Ginelli",
  role: "Founding product engineer",
  url: "https://victor-ginelli-portfolio-demo.victor52668.chatgpt.site",
  socialImage: "/og.png",
  email: "victor@she.energy",
  github: "https://github.com/youngkidwarrior",
  resume: "/victor-ginelli-resume.pdf",
  description:
    "Victor Ginelli designs and builds clear, polished products across payments, identity, and mobile.",
};

export type ProjectScreenshot = {
  src: `/images/work/${string}.jpg`;
  href: HttpsUrl;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

export type Project = {
  slug: ProjectSlug;
  title: string;
  period: string;
  role: string;
  lede: string;
  metrics: [{ value: string; label: string }, { value: string; label: string }];
  links: { label: string; href: HttpsUrl }[];
  screenshot: ProjectScreenshot;
  contributions: { title: string; detail: string }[];
  accent: "red" | "yellow" | "green" | "cobalt";
};

export const projects: Project[] = [
  {
    slug: "send",
    title: "Send",
    period: "2023 - 2026",
    role: "Senior full-stack engineer",
    lede: "Led a passkey-secured card and mobile experience supporting more than $53M in transfers.",
    metrics: [
      { value: "$53M+", label: "onchain transfer volume" },
      { value: "70K+", label: "passkeys supported" },
    ],
    links: [{ label: "Visit Send", href: "https://send.it" }],
    screenshot: {
      src: "/images/work/send.jpg",
      href: "https://send.it",
      width: 1120,
      height: 630,
      alt: "Send website showing a customer using the mobile payments product",
      caption: "Send's consumer payments brand.",
    },
    contributions: [
      {
        title: "Virtual debit card",
        detail: "Led the product from architecture through launch, connecting passkey ownership, identity checks, card issuance, funding, authentication, and card controls.",
      },
      {
        title: "Community rewards",
        detail: "Designed a gaming-resistant activity and token-distribution system that allocated 81M+ SEND using behavioral signals, eligibility rules, and dynamic reward limits.",
      },
      {
        title: "Web and mobile platform",
        detail: "Architected a shared foundation for web and native apps that supported 15 iOS releases, 1K+ Android downloads, 70K+ passkeys, and 20K Sendtags.",
      },
      {
        title: "Reliable payment operations",
        detail: "Moved core payment execution into durable workflows for transactions, confirmation, reconciliation, retries, activity updates, and notifications.",
      },
      {
        title: "Social payments",
        detail: "Expanded Send with group payments, conversational sends, public activity, reactions, richer transaction details, and cross-platform notifications.",
      },
    ],
    accent: "cobalt",
  },
  {
    slug: "shenanigan",
    title: "Shenanigan",
    period: "2018 - 2023",
    role: "Founder and technical lead",
    lede: "Founded and led a community product that raised $100K+ and added a year of runway.",
    metrics: [
      { value: "$100K+", label: "community support raised" },
      { value: "12 mo", label: "runway added by PANTS" },
    ],
    links: [
      { label: "Visit Shenanigan", href: "https://she.energy" },
      { label: "Visit PANTS", href: "https://pants.energy" },
    ],
    screenshot: {
      src: "/images/work/pants.jpg",
      href: "https://pants.energy",
      width: 720,
      height: 576,
      alt: "PANTS product page showing digital clothing available to buy",
      caption: "PANTS turned community energy into added runway.",
    },
    contributions: [
      {
        title: "Company and team",
        detail: "Founded and bootstrapped the company, raised $100K+ from the community, and led six recurring contributors and two contractors.",
      },
      {
        title: "PANTS",
        detail: "Created a community fundraising and token-reward mechanism that extended the company's operating runway by 12 months.",
      },
      {
        title: "Community governance",
        detail: "Designed a decentralized system that connected governance, measurable participation, and stakeholder rewards.",
      },
    ],
    accent: "red",
  },
  {
    slug: "brightid",
    title: "BrightID Bot",
    period: "2020 - 2023",
    role: "Project lead",
    lede: "Turned a weekend prototype into a service that verified 11,000+ people in one year.",
    metrics: [
      { value: "11K+", label: "people verified in one year" },
      { value: "1", label: "dedicated BrightID node" },
    ],
    links: [
      { label: "Visit BrightID Bot", href: "https://bot.brightid.org" },
      { label: "Visit BrightID", href: "https://www.brightid.org" },
    ],
    screenshot: {
      src: "/images/work/brightid-bot.jpg",
      href: "https://bot.brightid.org",
      width: 1120,
      height: 630,
      alt: "BrightID Bot dashboard for Discord community verification",
      caption: "A simple dashboard for community verification.",
    },
    contributions: [
      {
        title: "Prototype to product",
        detail: "Turned a weekend hackathon prototype into a production identity-verification service for online communities.",
      },
      {
        title: "Verification at scale",
        detail: "Led the service as it verified more than 11,000 people in one year.",
      },
      {
        title: "Deployment migration",
        detail: "Moved the production service from Heroku to Railway for its next stage of operation.",
      },
      {
        title: "BrightID infrastructure",
        detail: "Operated a dedicated BrightID node supporting the bot's verification flow.",
      },
    ],
    accent: "green",
  },
  {
    slug: "open-source",
    title: "Open source",
    period: "2018 - 2023",
    role: "Selected contributor",
    lede: "Shipped focused product improvements across four open-source ecosystems.",
    metrics: [
      { value: "4", label: "ecosystems represented" },
      { value: "Web→DAO", label: "full product surface" },
    ],
    links: [
      { label: "SourceCred", href: "https://sourcecred.io" },
      { label: "Honeyswap", href: "https://honeyswap.org" },
      { label: "BrightID", href: "https://www.brightid.org" },
      { label: "Colony", href: "https://colony.io" },
    ],
    screenshot: {
      src: "/images/work/open-source.jpg",
      href: "https://github.com/youngkidwarrior",
      width: 1120,
      height: 630,
      alt: "Victor Ginelli's GitHub profile with pinned open-source projects",
      caption: "Public work across product and protocol ecosystems.",
    },
    contributions: [
      {
        title: "SourceCred",
        detail: "Shipped product work supporting contributor rewards and community participation.",
      },
      {
        title: "Honeyswap",
        detail: "Contributed exchange fixes across the user-facing product and payment experience.",
      },
      {
        title: "BrightID",
        detail: "Improved identity-verification work within the open-source ecosystem.",
      },
      {
        title: "Colony",
        detail: "Contributed to DAO payment logic spanning application and smart-contract work.",
      },
    ],
    accent: "yellow",
  },
];

export const recognition = {
  headline: "Winner, Aragon Hack for Freedom",
  supportingProof: [
    {
      label: "NFT Request submission",
      source: "https://hackmd.io/@HADkohMGSyy8wLqA3Vdj6w/ryxO3Aqew" as HttpsUrl,
    },
    {
      label: "Submission branch comparison",
      source: "https://github.com/youngkidwarrior/token-request-app/compare/master...hack-for-freedom-submission" as HttpsUrl,
    },
  ],
};

export const projectBySlug = Object.fromEntries(
  projects.map((project) => [project.slug, project]),
) as Record<ProjectSlug, Project>;

export function getProject(slug: string): Project | undefined {
  return projectBySlug[slug as ProjectSlug];
}

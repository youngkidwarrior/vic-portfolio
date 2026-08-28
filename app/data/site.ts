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
  clientStory: {
    challenge: string;
    contribution: string;
    result: string;
  };
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
    clientStory: {
      challenge: "Make digital payments feel familiar even when the systems underneath were new.",
      contribution: "Victor led the virtual card and mobile experience across product, design, and engineering.",
      result: "The work supported $53M+ in transfers, 70K+ passkeys, and 15 iOS releases.",
    },
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
    clientStory: {
      challenge: "Build a community-owned product and the organization needed to sustain it.",
      contribution: "Victor founded the company, raised support, assembled an eight-person team, and shipped the product.",
      result: "The community raised $100K+, and PANTS added 12 months of runway.",
    },
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
    clientStory: {
      challenge: "Help online communities verify unique people without collecting traditional identity data.",
      contribution: "Victor turned a weekend prototype into a dependable public service.",
      result: "BrightID Bot verified more than 11,000 people in its first year.",
    },
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
    clientStory: {
      challenge: "Improve important public tools across payments, identity, and community coordination.",
      contribution: "Victor contributed product and engineering work where focused changes could help users.",
      result: "The work shipped across four open-source communities.",
    },
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

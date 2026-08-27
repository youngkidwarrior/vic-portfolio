export const site = {
  name: "Victor Ginelli",
  role: "Founding product engineer",
  email: "victor@she.energy",
  github: "https://github.com/youngkidwarrior",
  resume: "/victor-ginelli-resume.pdf",
  description:
    "Founding product engineer shipping polished experiences across payments, identity, mobile, infrastructure, and onchain systems.",
  availability: "Open to full-time founding product roles with remote teams globally.",
};

export type Project = {
  slug: string;
  title: string;
  period: string;
  role: string;
  lede: string;
  summary: string;
  metrics: { value: string; label: string }[];
  links: { label: string; href: string }[];
  art: string;
  artAlt: string;
  accent: "red" | "yellow" | "green" | "cobalt";
};

export const projects: Project[] = [
  {
    slug: "send",
    title: "Send",
    period: "2023–2026",
    role: "Senior full-stack engineer",
    lede: "A social payments product built across the card, wallet, mobile, and reliability layers.",
    summary:
      "Led zero-to-one delivery of a passkey-secured virtual debit card and the systems that made complex onchain payments feel direct.",
    metrics: [
      { value: "$53M+", label: "onchain transfer volume" },
      { value: "70K+", label: "passkeys supported" },
      { value: "15", label: "iOS releases in eight months" },
    ],
    links: [{ label: "Visit Send", href: "https://send.app" }],
    art: "/images/send-poster.webp",
    artAlt: "Original geometric artwork expressing coordinated payment flows",
    accent: "cobalt",
  },
  {
    slug: "shenanigan",
    title: "Shenanigan",
    period: "2018–2023",
    role: "Founder and technical lead",
    lede: "A founder-built ecosystem for aligning a community around contribution and ownership.",
    summary:
      "Raised community funding, assembled an eight-person team, and built applications, contracts, infrastructure, and governance from the ground up.",
    metrics: [
      { value: "$100K+", label: "community support raised" },
      { value: "12 mo", label: "runway added by PANTS" },
      { value: "8", label: "contributors and contractors" },
    ],
    links: [{ label: "Visit Shenanigan", href: "https://she.energy" }],
    art: "/images/shenanigan-poster.webp",
    artAlt: "Original geometric artwork expressing community momentum",
    accent: "red",
  },
  {
    slug: "brightid",
    title: "BrightID Bot",
    period: "2020–2023",
    role: "Project lead",
    lede: "A weekend prototype grown into dependable public-good infrastructure.",
    summary:
      "Turned an identity-verification bot into a production service and operated the deployment and dedicated network node behind it.",
    metrics: [
      { value: "11K+", label: "people verified in one year" },
      { value: "1", label: "dedicated BrightID node" },
      { value: "0→1", label: "hackathon to production" },
    ],
    links: [{ label: "Visit BrightID", href: "https://www.brightid.org" }],
    art: "/images/brightid-poster.webp",
    artAlt: "Original geometric artwork expressing identity and connection",
    accent: "green",
  },
  {
    slug: "open-source",
    title: "Open source",
    period: "2018–2023",
    role: "Selected contributor",
    lede: "Product, protocol, payment, and identity work across the Ethereum ecosystem.",
    summary:
      "Shipped React, Solidity, payment, and identity improvements across SourceCred, Honeyswap, BrightID, and Colony.",
    metrics: [
      { value: "4", label: "ecosystems represented" },
      { value: "Web→DAO", label: "full product surface" },
      { value: "OSS", label: "built in public" },
    ],
    links: [
      { label: "SourceCred", href: "https://sourcecred.io" },
      { label: "Honeyswap", href: "https://honeyswap.org" },
      { label: "Colony", href: "https://colony.io" },
    ],
    art: "/images/open-source-poster.webp",
    artAlt: "Original geometric artwork expressing an open-source contribution network",
    accent: "yellow",
  },
];

export const skills = [
  ["Product layer", "Product strategy", "Zero-to-one systems", "Team leadership"],
  ["Experience layer", "React", "React Native", "Expo", "Next.js", "Tamagui"],
  ["Service layer", "TypeScript", "Node.js", "Bun", "tRPC", "Zod", "Temporal"],
  ["Trust layer", "WebAuthn", "Passkeys", "ERC-4337", "Solidity", "Foundry"],
  ["Operations layer", "PostgreSQL", "Docker", "Kubernetes", "Playwright", "OpenTelemetry"],
] as const;

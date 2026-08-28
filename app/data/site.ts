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

export type ProjectSlug = "send" | "shenanigan" | "brightid" | "open-source";
export type HttpsUrl = `https://${string}`;

export const approvedCandidateManifest = [
  "SEND-PROOF-001",
  "SEND-UI-001",
  "SEND-BRAND-001",
  "SEND-UI-002",
  "SEND-UI-003",
  "SEND-FLOW-001",
  "SEND-FLOW-002",
  "SEND-RELEASE-001",
  "SHEN-HERO-001",
  "SHEN-BRAND-001",
  "SHEN-HISTORY-001",
  "SHEN-DOC-001",
  "SHEN-PRODUCT-002",
  "SHEN-GOV-001",
  "SHEN-CONTRIB-001",
  "BRIGHTID-UI-001",
  "BRIGHTID-BRAND-001",
  "BRIGHTID-UI-002",
  "BRIGHTID-CODE-001",
  "BRIGHTID-INFRA-001",
  "OSS-COMP-001",
  "OSS-SC-PR-001",
  "OSS-HNY-PR-001",
  "OSS-BID-PR-001",
  "OSS-COL-PR-001",
  "OSS-SC-MARK-001",
  "OSS-HNY-MARK-001",
  "OSS-BID-MARK-001",
  "OSS-COL-MARK-001",
  "OSS-MARK-STRIP-001",
  "ARAGON-UI-001",
  "ARAGON-AWARD-001",
  "ARAGON-REC-001",
  "ARAGON-CODE-001",
  "ARAGON-DECK-001",
  "ARAGON-EVENT-001",
  "ARAGON-BRAND-001",
] as const;

export type ApprovedCandidateId = (typeof approvedCandidateManifest)[number];

export type ProvisionalReview = {
  agentApproval: "agent-approved";
  humanApproval: "human-pending";
  publishable: false;
};

type DocumentaryAssetBase = {
  candidateId: ApprovedCandidateId;
  title: string;
  caption: string;
  source:
    | { kind: "owner-supplied-pending" }
    | { kind: "public-primary-sources"; urls: readonly [HttpsUrl, ...HttpsUrl[]] };
  alt: string;
  review: ProvisionalReview;
};

export type BrandMarkAsset = DocumentaryAssetBase & {
  role: "brand-mark";
  media: "pending-original";
};

type NonEmptyStrings = readonly [string, ...string[]];

export type SiteNativeRecord =
  | { kind: "system-flow"; label: string; steps: NonEmptyStrings; fact: string }
  | { kind: "release-record"; label: string; value: string; period: string; fact: string }
  | { kind: "document-record"; document: string; repository: string; status: string; fact: string }
  | { kind: "architecture-record"; label: string; path: NonEmptyStrings; fact: string }
  | { kind: "code-record"; repository: string; revision: string; status: string; contribution: string }
  | { kind: "contribution-record"; project: string; record: string; status: string; contribution: string }
  | { kind: "record-set"; label: string; count: string; records: NonEmptyStrings; fact: string };

export type SiteNativeMedia = {
  media: "site-native";
  disclosure: "Site-native interpretation · not an original historical screenshot";
  record: SiteNativeRecord;
};

type DocumentaryMedia =
  | { media: "pending-original" }
  | SiteNativeMedia
  | {
      media: "local-image";
      src: `/images/${string}`;
      width: number;
      height: number;
    };

export type HeroAsset = DocumentaryAssetBase & { role: "hero-proof" } & DocumentaryMedia;

export type EvidenceAsset = DocumentaryAssetBase & { role: "case-study-evidence" } & DocumentaryMedia;

export type DecorativeArtAsset = {
  portfolioAssetId: string;
  role: "decorative-atmosphere";
  media: "portfolio-generated";
  src: `/images/${string}.webp`;
  alt: "";
  ariaHidden: true;
  provenance: "Generated for this portfolio; not documentary project evidence.";
};

export type ProjectAsset = BrandMarkAsset | HeroAsset | EvidenceAsset | DecorativeArtAsset;

export type OwnershipBlock = {
  context: string;
  mandate: string;
  collaborators: string;
  victorDecisions: string;
  constraints: string;
  shippedSurface: string;
  outcome: string;
  rightsHolder: string;
  victorRelationship: string;
  reuseStatus: "human-pending";
  exactFileRequired: true;
  privacyReview: string;
};

export type Project = {
  slug: ProjectSlug;
  title: string;
  period: string;
  role: string;
  lede: string;
  summary: string;
  metrics: { value: string; label: string }[];
  links: { label: string; href: HttpsUrl }[];
  accent: "red" | "yellow" | "green" | "cobalt";
  brandMark: BrandMarkAsset | null;
  heroAsset: HeroAsset;
  evidenceGallery: EvidenceAsset[];
  decorativeArt: DecorativeArtAsset;
  ownership: OwnershipBlock;
};

type RecognitionEvidenceBase = {
  label: string;
  establishes: string;
  review: ProvisionalReview;
};

export type RecognitionEvidence =
  | (RecognitionEvidenceBase & {
      candidateId: "ARAGON-AWARD-001";
      source: null;
      artifactStatus: "exact-artifact-pending";
    })
  | (RecognitionEvidenceBase & {
      candidateId: "ARAGON-REC-001" | "ARAGON-CODE-001";
      source: HttpsUrl;
      artifactStatus: "public-primary-source";
    });

export type Recognition = {
  project: "NFT Request";
  event: "Aragon Hack for Freedom";
  headline: "Winner, Aragon Hack for Freedom";
  claimBasis: "owner-attested";
  summary: string;
  disclosure: string;
  awardProof: Extract<RecognitionEvidence, { artifactStatus: "exact-artifact-pending" }>;
  supportingProof: readonly [
    Extract<RecognitionEvidence, { artifactStatus: "public-primary-source" }>,
    Extract<RecognitionEvidence, { artifactStatus: "public-primary-source" }>,
  ];
};

const review: ProvisionalReview = {
  agentApproval: "agent-approved",
  humanApproval: "human-pending",
  publishable: false,
};

function brand(
  candidateId: ApprovedCandidateId,
  title: string,
  caption: string,
  source: DocumentaryAssetBase["source"] | HttpsUrl,
  alt: string,
): BrandMarkAsset {
  return {
    candidateId,
    role: "brand-mark",
    media: "pending-original",
    title,
    caption,
    source: typeof source === "string" ? publicPrimarySources(source) : source,
    alt,
    review,
  };
}

function hero(
  candidateId: ApprovedCandidateId,
  media: DocumentaryMedia | "pending-original",
  title: string,
  caption: string,
  source: DocumentaryAssetBase["source"] | HttpsUrl,
  alt: string,
): HeroAsset {
  return {
    candidateId,
    role: "hero-proof",
    ...documentaryMedia(media),
    title,
    caption,
    source: typeof source === "string" ? publicPrimarySources(source) : source,
    alt,
    review,
  };
}

function evidence(
  candidateId: ApprovedCandidateId,
  media: DocumentaryMedia | "pending-original",
  title: string,
  caption: string,
  source: DocumentaryAssetBase["source"] | HttpsUrl,
  alt: string,
): EvidenceAsset {
  return {
    candidateId,
    role: "case-study-evidence",
    ...documentaryMedia(media),
    title,
    caption,
    source: typeof source === "string" ? publicPrimarySources(source) : source,
    alt,
    review,
  };
}

function documentaryMedia(
  media: DocumentaryMedia | "pending-original",
): DocumentaryMedia {
  return typeof media === "string" ? { media } : media;
}

function siteNative(record: SiteNativeRecord): SiteNativeMedia {
  return {
    media: "site-native",
    disclosure: "Site-native interpretation · not an original historical screenshot",
    record,
  };
}

function publicPrimarySources(
  ...urls: readonly [HttpsUrl, ...HttpsUrl[]]
): Extract<DocumentaryAssetBase["source"], { kind: "public-primary-sources" }> {
  return { kind: "public-primary-sources", urls };
}

const ownerSuppliedPending: Extract<DocumentaryAssetBase["source"], { kind: "owner-supplied-pending" }> = {
  kind: "owner-supplied-pending",
};

function decorative(portfolioAssetId: string, src: DecorativeArtAsset["src"]): DecorativeArtAsset {
  return {
    portfolioAssetId,
    role: "decorative-atmosphere",
    media: "portfolio-generated",
    src,
    alt: "",
    ariaHidden: true,
    provenance: "Generated for this portfolio; not documentary project evidence.",
  };
}

export const projects: Project[] = [
  {
    slug: "send",
    title: "Send",
    period: "2023 - 2026",
    role: "Senior full-stack engineer",
    lede: "A social payments product built across the card, wallet, mobile, and reliability layers.",
    summary:
      "Led zero-to-one delivery of a passkey-secured virtual debit card and the systems that made complex onchain payments feel direct.",
    metrics: [
      { value: "$53M+", label: "onchain transfer volume" },
      { value: "70K+", label: "passkeys supported" },
      { value: "15", label: "iOS releases in eight months" },
    ],
    links: [{ label: "Visit Send", href: "https://send.it" }],
    accent: "cobalt",
    brandMark: brand(
      "SEND-BRAND-001",
      "Send app mark",
      "Current Send identity, pending an authorized production master.",
      "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/3a/0b/4c/3a0b4c06-cf5a-28c5-c855-8e386f166d2e/ios-icon-0-0-1x_U007epad-0-1-sRGB-85-220.png/512x512bb.jpg",
      "Send application mark",
    ),
    heroAsset: hero(
      "SEND-PROOF-001",
      "pending-original",
      "Passkey-secured payments",
      "A cleared virtual-card or transaction-detail capture will occupy this evidence slot.",
      ownerSuppliedPending,
      "Reserved proof of the Send virtual card or transaction experience",
    ),
    evidenceGallery: [
      evidence(
        "SEND-UI-002",
        "pending-original",
        "Sendtag identity",
        "A synthetic account will show how a Sendtag makes payment identity legible.",
        "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/4f/b1/f2/4fb1f283-5955-b314-3c4c-cde6acca6488/Sendtags.png/320x480bb.jpg",
        "Reserved Sendtag product capture using a synthetic account",
      ),
      evidence(
        "SEND-UI-003",
        "pending-original",
        "Public payment profile",
        "A cleared synthetic profile will demonstrate the product's social reach.",
        "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/89/9e/c5/899ec5f7-914f-3d18-3d7f-372624b5e52d/Link_in_bio_1.png/320x480bb.jpg",
        "Reserved public-profile product capture using synthetic details",
      ),
      evidence(
        "SEND-FLOW-001",
        siteNative({
          kind: "system-flow",
          label: "Account creation path",
          steps: ["Create account", "Register passkey", "Create smart wallet"],
          fact: "The support record documents a passkey-first account creation flow.",
        }),
        "Passkey account creation",
        "A site-native sequence will explain passkey onboarding without copying support imagery.",
        "https://support.send.app/en/articles/13067044-creating-your-send-account",
        "Planned site-native sequence explaining passkey account creation",
      ),
      evidence(
        "SEND-FLOW-002",
        siteNative({
          kind: "system-flow",
          label: "Recovery path",
          steps: ["Registered passkeys", "Recovery authentication", "Account access"],
          fact: "The support record documents recovery through the account's passkey model.",
        }),
        "Account recovery",
        "A site-native sequence will show the multiple-passkey recovery model with synthetic labels.",
        "https://support.send.app/en/articles/11636787-account-recovery",
        "Planned site-native sequence explaining account recovery",
      ),
      evidence(
        "SEND-RELEASE-001",
        siteNative({
          kind: "release-record",
          label: "Owner-attested iOS cadence",
          value: "15 releases",
          period: "Eight months",
          fact: "The resume records the native shipping cadence; exact release-history evidence is still pending.",
        }),
        "iOS release cadence",
        "Fifteen iOS releases shipped in eight months during Victor's tenure.",
        { kind: "owner-supplied-pending" },
        "Planned site-native timeline of Send iOS releases",
      ),
      evidence(
        "SEND-UI-001",
        "pending-original",
        "Product introduction",
        "A cleared native-resolution capture is supporting context, not hero art.",
        "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/a8/23/04/a8230420-3557-ad4c-64c7-48fc5fbd74df/Intro.png/320x480bb.jpg",
        "Reserved Send product introduction capture",
      ),
    ],
    decorativeArt: decorative("SEND-DECOR-001", "/images/send-poster.webp"),
    ownership: {
      context: "Send was turning onchain payments into a consumer product across web and native applications.",
      mandate: "Lead zero-to-one delivery across the virtual card, passkey identity, payment reliability, and social-money surfaces.",
      collaborators: "Worked within Send's product and engineering organization and across card, identity, and payment providers.",
      victorDecisions: "Joined wallet ownership, KYC, issuance, funding, 3DS, lifecycle controls, and durable execution into one product path.",
      constraints: "Financial state had to remain understandable while authentication, provider webhooks, retries, and onchain finality stayed reliable.",
      shippedSurface: "A passkey-secured virtual debit card, shared web/native application foundation, payment workflows, recovery, and social payment features.",
      outcome: "The work supported $53M+ in onchain transfer volume, 70K+ passkeys, and 15 public iOS releases in eight months.",
      rightsHolder: "Send and relevant product-asset creators",
      victorRelationship: "Senior full-stack engineer; contribution scope requires final owner confirmation.",
      reuseStatus: "human-pending",
      exactFileRequired: true,
      privacyReview: "Use synthetic accounts; remove card, counterparty, address, identifier, avatar, and analytics data.",
    },
  },
  {
    slug: "shenanigan",
    title: "Shenanigan",
    period: "2018 - 2023",
    role: "Founder and technical lead",
    lede: "A founder-built ecosystem for aligning a community around contribution and ownership.",
    summary:
      "Raised community funding, assembled an eight-person team, and built applications, contracts, infrastructure, and governance from the ground up.",
    metrics: [
      { value: "$100K+", label: "community support raised" },
      { value: "12 mo", label: "runway added by PANTS" },
      { value: "8", label: "contributors and contractors" },
    ],
    links: [
      { label: "Visit Shenanigan", href: "https://she.energy" },
      { label: "Visit PANTS", href: "https://pants.energy" },
    ],
    accent: "red",
    brandMark: brand(
      "SHEN-BRAND-001",
      "Legacy SHE mark",
      "An archival identifier, pending creator and trademark confirmation.",
      "https://github.com/ShenaniganDApp/ShenaniganDApp.github.io/blob/6c64dbab9efc572a2f35f0072c771d0f2c57db5b/src/images/SHELogo_Final.png",
      "Legacy SHE identity mark",
    ),
    heroAsset: hero(
      "SHEN-HERO-001",
      "pending-original",
      "Product and governance archive",
      "The cleared mobile-product original will pair with site-native governance evidence.",
      "https://github.com/ShenaniganDApp/ShenaniganDApp.github.io/blob/9f384c4e703c44cd525e9fb2c91cf4595539e9df/src/images/iphoneMockup.png",
      "Reserved archival Shenanigan mobile-product mockup",
    ),
    evidenceGallery: [
      evidence(
        "SHEN-GOV-001",
        siteNative({
          kind: "document-record",
          document: "SHEiP-1",
          repository: "ShenaniganDApp/SHEiP",
          status: "Victor-authored · CC0 archive",
          fact: "The proposal records the governance model in the project's public archive.",
        }),
        "SHEiP-1 governance proposal",
        "Victor-authored governance evidence from the CC0 SHEiP archive.",
        "https://github.com/ShenaniganDApp/SHEiP/blob/6e0ef1360b2002d3d02dbd815617371954327b71/SHEiPs/SHEiP-1/SHEiP-1.md",
        "Planned site-native excerpt from the SHEiP-1 governance proposal",
      ),
      evidence(
        "SHEN-PRODUCT-002",
        "pending-original",
        "PANTS product",
        "A cleared product render will document the mechanism that added twelve months of runway.",
        "https://github.com/ShenaniganDApp/PANTS/blob/08a9ed9a4de6724d802ac601d65cdabd69ba66f5/src/components/Gallery/pants.png",
        "Reserved PANTS product render",
      ),
      evidence(
        "SHEN-CONTRIB-001",
        siteNative({
          kind: "document-record",
          document: "Contribution scoreboard",
          repository: "ShenaniganDApp/scoreboard",
          status: "Public repository",
          fact: "The repository is a direct record of the community contribution infrastructure.",
        }),
        "Contribution infrastructure",
        "A privacy-safe summary will document the community contribution system.",
        "https://github.com/ShenaniganDApp/scoreboard",
        "Planned site-native summary of Shenanigan contribution infrastructure",
      ),
      evidence(
        "SHEN-DOC-001",
        "pending-original",
        "PINKPAPER v0.1",
        "A cleared historical cover will not imply that this is the current specification.",
        "https://github.com/ShenaniganDApp/docs/blob/570bf87e0c6b5d167f86162da91df0cc22f1b019/static/img/pinkpaper/pinkpaper.png",
        "Reserved PINKPAPER version 0.1 cover",
      ),
      evidence(
        "SHEN-HISTORY-001",
        "pending-original",
        "Dathlete concept",
        "An optional historical inset, pending illustration rights and likeness review.",
        "https://github.com/ShenaniganDApp/docs/blob/570bf87e0c6b5d167f86162da91df0cc22f1b019/static/img/dathlete.png",
        "Reserved historical Dathlete concept illustration",
      ),
    ],
    decorativeArt: decorative("SHEN-DECOR-001", "/images/shenanigan-poster.webp"),
    ownership: {
      context: "Shenanigan explored how a community could coordinate product development, contribution, and ownership.",
      mandate: "Found the company, assemble the team, raise support, and lead the product, contracts, infrastructure, and governance system.",
      collaborators: "Six recurring contributors and two contractors worked across the company and community program.",
      victorDecisions: "Connected fundraising, token rewards, measurable participation, and decentralized governance as one operating model.",
      constraints: "A bootstrapped team had to balance runway, community trust, incentive design, and a broad technical surface.",
      shippedSurface: "Applications, smart contracts, infrastructure, PANTS fundraising mechanics, and a contribution-led governance archive.",
      outcome: "The community provided $100K+ in support, while PANTS extended operating runway by twelve months.",
      rightsHolder: "Shenanigan and the respective visual contributors",
      victorRelationship: "Founder and technical lead; individual visual authorship is not implied.",
      reuseStatus: "human-pending",
      exactFileRequired: true,
      privacyReview: "Remove profiles, wallets, balances, addresses, contributor records, and unreleased states.",
    },
  },
  {
    slug: "brightid",
    title: "BrightID Bot",
    period: "2020 - 2023",
    role: "Project lead",
    lede: "A weekend prototype grown into dependable public-good infrastructure.",
    summary:
      "Turned an identity-verification bot into a production service and operated the deployment and dedicated network node behind it.",
    metrics: [
      { value: "11K+", label: "people verified in one year" },
      { value: "1", label: "dedicated BrightID node" },
      { value: "0→1", label: "hackathon to production" },
    ],
    links: [
      { label: "Visit BrightID Bot", href: "https://bot.brightid.org" },
      { label: "Visit BrightID", href: "https://www.brightid.org" },
    ],
    accent: "green",
    brandMark: brand(
      "BRIGHTID-BRAND-001",
      "BrightID mark",
      "An official-hosted reference, pending current mark-use confirmation.",
      "https://github.com/BrightID/BrightID-Node/blob/master/brightid-avatar.png",
      "BrightID identity mark",
    ),
    heroAsset: hero(
      "BRIGHTID-UI-001",
      "pending-original",
      "Guided verification flow",
      "A cleared historical capture or disclosed reconstruction is reserved here.",
      "https://forum.brightid.org/t/epic-5-premium-sponsorship-subscription-testing-command-center-design-overhaul/569",
      "Reserved BrightID verification-flow evidence",
    ),
    evidenceGallery: [
      evidence(
        "BRIGHTID-CODE-001",
        siteNative({
          kind: "code-record",
          repository: "ShenaniganDApp/brightid-discord-bot",
          revision: "cbefdb0",
          status: "Immutable commit",
          contribution: "Fallback behavior for the verification bot",
        }),
        "Fallback implementation",
        "An immutable commit anchors the bot's fallback behavior in direct contribution evidence.",
        "https://github.com/ShenaniganDApp/brightid-discord-bot/commit/cbefdb01811894b8b9470fd70261618dadfd0d83",
        "Planned evidence card for the BrightID bot fallback commit",
      ),
      evidence(
        "BRIGHTID-INFRA-001",
        siteNative({
          kind: "architecture-record",
          label: "Verification service path",
          path: ["Discord bot", "Verification service", "Dedicated BrightID node"],
          fact: "The resume records Victor's Heroku-to-Railway migration and operation of the dedicated node; exact infrastructure evidence is still pending.",
        }),
        "Verification infrastructure",
        "A portfolio-owned schematic will explain verification and node fallback without exposing operations.",
        { kind: "owner-supplied-pending" },
        "Planned schematic of verification and node fallback",
      ),
      evidence(
        "BRIGHTID-UI-002",
        "pending-original",
        "Server authorization",
        "A cleared redacted original or disclosed reconstruction will follow the user journey.",
        "https://forum.brightid.org/t/epic-5-premium-sponsorship-subscription-testing-command-center-design-overhaul/569",
        "Reserved BrightID server-authorization evidence",
      ),
    ],
    decorativeArt: decorative("BRIGHTID-DECOR-001", "/images/brightid-poster.webp"),
    ownership: {
      context: "The BrightID Discord bot began as a weekend hackathon prototype for identity verification inside community workflows.",
      mandate: "Turn the prototype into a dependable production service and own the deployment path behind it.",
      collaborators: "Worked with BrightID communities and contributors while operating the bot as a focused project lead.",
      victorDecisions: "Brought verification into Discord, migrated hosting from Heroku to Railway, and operated a dedicated BrightID node.",
      constraints: "A public-good service needed continuity, privacy-safe operations, and graceful behavior when network dependencies failed.",
      shippedSurface: "A production Discord verification journey, fallback behavior, managed deployment, and dedicated node infrastructure.",
      outcome: "The service verified more than 11,000 people in one year after moving from prototype to production.",
      rightsHolder: "BrightID and the respective interface contributors",
      victorRelationship: "Project lead for the bot; direct implementation evidence is linked separately.",
      reuseStatus: "human-pending",
      exactFileRequired: true,
      privacyReview: "Redact names, avatars, balances, wallet data, identifiers, links, and operational details.",
    },
  },
  {
    slug: "open-source",
    title: "Open source",
    period: "2018 - 2023",
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
    accent: "yellow",
    brandMark: null,
    heroAsset: hero(
      "OSS-COMP-001",
      siteNative({
        kind: "record-set",
        label: "Merged contribution dossier",
        count: "04 primary records",
        records: ["SourceCred #2150", "Honeyswap #30", "BrightID SDK #1", "Colony #836"],
        fact: "Each selected contribution is linked to its public pull-request record.",
      }),
      "Four merged contributions",
      "A site-native ledger connects each contribution claim to its merged pull request.",
      publicPrimarySources(
        "https://github.com/sourcecred/sourcecred/pull/2150",
        "https://github.com/1Hive/uniswap-interface/pull/30",
        "https://github.com/BrightID/brightid-python-sdk/pull/1",
        "https://github.com/JoinColony/colonyNetwork/pull/836",
      ),
      "Planned contribution ledger for four merged open-source pull requests",
    ),
    evidenceGallery: [
      evidence(
        "OSS-SC-PR-001",
        siteNative({
          kind: "contribution-record",
          project: "SourceCred",
          record: "PR #2150",
          status: "Merged",
          contribution: "Explorer table, responsive controls, and filter-state refinements",
        }),
        "SourceCred PR #2150",
        "Migrated Explorer table and controls toward Material UI with responsive and filter-state refinements.",
        "https://github.com/sourcecred/sourcecred/pull/2150",
        "Planned evidence row for SourceCred pull request 2150",
      ),
      evidence(
        "OSS-HNY-PR-001",
        siteNative({
          kind: "contribution-record",
          project: "Honeyswap",
          record: "PR #30",
          status: "Merged",
          contribution: "Add output tokens from the active token list to MetaMask",
        }),
        "Honeyswap PR #30",
        "Enabled users to add output tokens from the active token list to MetaMask.",
        "https://github.com/1Hive/uniswap-interface/pull/30",
        "Planned evidence row for Honeyswap pull request 30",
      ),
      evidence(
        "OSS-BID-PR-001",
        siteNative({
          kind: "contribution-record",
          project: "BrightID Python SDK",
          record: "PR #1",
          status: "Merged",
          contribution: "API v6 update and sponsorship support",
        }),
        "BrightID Python SDK PR #1",
        "Updated the Python SDK for API v6 and added sponsorship support.",
        "https://github.com/BrightID/brightid-python-sdk/pull/1",
        "Planned evidence row for BrightID Python SDK pull request 1",
      ),
      evidence(
        "OSS-COL-PR-001",
        siteNative({
          kind: "contribution-record",
          project: "Colony",
          record: "PR #836",
          status: "Merged",
          contribution: "Expenditure-based multiple-token payments",
        }),
        "Colony PR #836",
        "Implemented expenditure-based multiple-token payments in the one-transaction payment extension.",
        "https://github.com/JoinColony/colonyNetwork/pull/836",
        "Planned evidence row for Colony pull request 836",
      ),
      evidence(
        "OSS-MARK-STRIP-001",
        siteNative({
          kind: "record-set",
          label: "Supporting project index",
          count: "04 ecosystems",
          records: ["SourceCred", "Honeyswap", "BrightID", "Colony"],
          fact: "Marks remain optional supporting context and require independent clearance.",
        }),
        "Project index",
        "An optional index will include only independently cleared project marks.",
        "https://github.com/JoinColony/brand",
        "Planned index of independently approved open-source project marks",
      ),
    ],
    decorativeArt: decorative("OSS-DECOR-001", "/images/open-source-poster.webp"),
    ownership: {
      context: "Four public repositories exposed focused product and protocol problems across rewards, exchange, identity, and DAO payments.",
      mandate: "Contribute bounded improvements that fit each project's architecture, conventions, and review process.",
      collaborators: "Worked through public maintainer review in the SourceCred, Honeyswap, BrightID, and Colony ecosystems.",
      victorDecisions: "Targeted the seam between user-facing behavior and the underlying payment, identity, or protocol system.",
      constraints: "Each change had to be independently reviewable, preserve upstream behavior, and meet a different community's standards.",
      shippedSurface: "Merged React, SDK, exchange-wallet, and Solidity payment changes represented by four primary pull-request records.",
      outcome: "The contribution record spans four ecosystems and connects every selected claim to a public merged change.",
      rightsHolder: "The respective open-source projects and contributors",
      victorRelationship: "Contributor through the public youngkidwarrior account; captions remain human-pending.",
      reuseStatus: "human-pending",
      exactFileRequired: true,
      privacyReview: "Use factual metadata only; omit GitHub chrome, reviewers, emails, branches, avatars, and wallet data.",
    },
  },
];

export const recognition = {
  project: "NFT Request",
  event: "Aragon Hack for Freedom",
  headline: "Winner, Aragon Hack for Freedom",
  claimBasis: "owner-attested",
  summary:
    "NFT Request paired a Solidity application with a React interface and Aragon OS during the Hack for Freedom event.",
  disclosure:
    "The current public sources verify the submission, Victor's listed role, and the implementation branch. The forthcoming organizer artifact will supply result evidence.",
  awardProof: {
    candidateId: "ARAGON-AWARD-001",
    label: "Organizer result artifact",
    establishes: "Reserved for the exact artifact supporting the owner-attested result.",
    source: null,
    review,
    artifactStatus: "exact-artifact-pending",
  },
  supportingProof: [
    {
      candidateId: "ARAGON-REC-001",
      label: "NFT Request submission",
      establishes: "Verifies the project submission and Victor's listed role.",
      source: "https://hackmd.io/@HADkohMGSyy8wLqA3Vdj6w/ryxO3Aqew",
      review,
      artifactStatus: "public-primary-source",
    },
    {
      candidateId: "ARAGON-CODE-001",
      label: "Submission branch comparison",
      establishes: "Documents the implementation branch relative to the repository's master branch.",
      source:
        "https://github.com/youngkidwarrior/token-request-app/compare/master...hack-for-freedom-submission",
      review,
      artifactStatus: "public-primary-source",
    },
  ],
} as const satisfies Recognition;

export const projectBySlug: Record<ProjectSlug, Project> = Object.fromEntries(
  projects.map((project) => [project.slug, project]),
) as Record<ProjectSlug, Project>;

export function getProject(slug: string): Project | undefined {
  return projectBySlug[slug as ProjectSlug];
}

export const skills = [
  ["Product layer", "Product strategy", "Zero-to-one systems", "Team leadership"],
  ["Experience layer", "React", "React Native", "Expo", "Next.js", "Tamagui"],
  ["Service layer", "TypeScript", "Node.js", "Bun", "tRPC", "Zod", "Temporal"],
  ["Trust layer", "WebAuthn", "Passkeys", "ERC-4337", "Solidity", "Foundry"],
  ["Operations layer", "PostgreSQL", "Docker", "Kubernetes", "Playwright", "OpenTelemetry"],
] as const;

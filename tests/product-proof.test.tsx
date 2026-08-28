import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AtmosphericArt } from "~/components/atmospheric-art";
import { ProductProof } from "~/components/product-proof";
import { getProject, type HeroAsset } from "~/data/site";

const motionPreference = vi.hoisted(() => ({ reduced: true }));

vi.mock("motion/react", async () => {
  const React = await import("react");

  return {
    motion: {
      img: React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
        function MotionImage({ children: _children, ...props }, ref) {
          const safeProps = Object.fromEntries(
            Object.entries(props).filter(([key]) => !["initial", "animate", "transition"].includes(key)),
          );
          return <img ref={ref} {...safeProps} />;
        },
      ),
    },
    useReducedMotion: () => motionPreference.reduced,
  };
});

afterEach(() => {
  motionPreference.reduced = true;
  vi.unstubAllGlobals();
});

describe("documentary and decorative media boundaries", () => {
  it("renders a pending-original slot without inventing an image", () => {
    const asset = getProject("send")!.heroAsset;
    const { container } = render(<ProductProof asset={asset} priority />);

    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByText("Passkey-secured payments")).toBeInTheDocument();
    expect(screen.getByText(asset.caption)).toBeInTheDocument();
    expect(screen.getByText("agent-approved")).toBeInTheDocument();
    expect(screen.getByText("human-pending")).toBeInTheDocument();
    expect(screen.getByText("Owner-supplied original pending")).toBeInTheDocument();
    expect(container.querySelector("figure")).toHaveAttribute("data-priority", "primary");
  });

  it("renders site-native evidence with every primary source", () => {
    const asset = getProject("open-source")!.heroAsset;
    const { container } = render(<ProductProof asset={asset} />);
    const sourceLinks = within(container).getAllByRole("link");

    expect(screen.getByText("Four merged contributions")).toBeInTheDocument();
    expect(screen.getByText(asset.caption)).toBeInTheDocument();
    expect(screen.getByText("04 primary records")).toBeInTheDocument();
    expect(screen.getByText("SourceCred #2150")).toBeInTheDocument();
    expect(screen.getByText("Colony #836")).toBeInTheDocument();
    expect(screen.getByText("Site-native interpretation · not an original historical screenshot")).toBeInTheDocument();
    expect(sourceLinks).toHaveLength(4);
    expect(sourceLinks.map((link) => link.getAttribute("href"))).toEqual(asset.source.kind === "public-primary-sources" ? asset.source.urls : []);
    expect(container.querySelector("figure")).toHaveAttribute("data-priority", "supporting");
    expect(container.querySelector(".product-proof-native")).toHaveAttribute(
      "aria-labelledby",
      container.querySelector("h3")!.id,
    );
  });

  it("labels owner-attested site-native claims without implying a public primary source", () => {
    const asset = getProject("send")!.evidenceGallery.find((candidate) => candidate.candidateId === "SEND-RELEASE-001")!;
    const { container } = render(<ProductProof asset={asset} />);

    expect(within(container).getByText("Owner-attested portfolio record")).toBeInTheDocument();
    expect(within(container).getByText("Owner-supplied supporting artifact pending")).toBeInTheDocument();
    expect(within(container).queryByRole("link")).not.toBeInTheDocument();
  });

  it.each([
    { priority: true, loading: "eager", fetchPriority: "high" },
    { priority: false, loading: "lazy", fetchPriority: "auto" },
  ])("loads an approved local documentary image according to priority", ({ priority, loading, fetchPriority }) => {
    const pending = getProject("send")!.heroAsset;
    const asset: HeroAsset = {
      ...pending,
      media: "local-image",
      src: "/images/send-product-approved.webp",
      width: 1600,
      height: 1000,
      alt: "Approved Send product interface",
    };
    const { container } = render(<ProductProof asset={asset} priority={priority} />);
    const image = container.querySelector("img");

    expect(image).toHaveAttribute("src", asset.src);
    expect(image).toHaveAttribute("width", "1600");
    expect(image).toHaveAttribute("height", "1000");
    expect(image).toHaveAttribute("alt", asset.alt);
    expect(image).toHaveAttribute("loading", loading);
    expect(image).toHaveAttribute("fetchpriority", fetchPriority);
  });

  it("keeps atmospheric artwork hidden, empty-alt, lazy, inert, and static for reduced motion", () => {
    const asset = getProject("brightid")!.decorativeArt;
    const { container } = render(<AtmosphericArt asset={asset} />);
    const figure = container.querySelector("figure");
    const image = container.querySelector("img");

    expect(figure).toHaveAttribute("aria-hidden", "true");
    expect(figure).toHaveAttribute("data-motion", "static");
    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("width", "1122");
    expect(image).toHaveAttribute("height", "1402");
    expect(figure).not.toHaveAttribute("tabindex");
  });

  it("keeps atmospheric artwork static on constrained mobile screens", () => {
    motionPreference.reduced = false;
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { container } = render(<AtmosphericArt asset={getProject("send")!.decorativeArt} />);

    expect(container.querySelector("figure")).toHaveAttribute("data-motion", "static");
  });
});

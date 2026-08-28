import { describe, expect, it } from "vitest";
import { resumeContent } from "~/data/resume";

describe("shared resume content", () => {
  it("uses the approved identity and Send dates", () => {
    expect(resumeContent.title).toBe("Founder and full-stack product engineer");
    expect(resumeContent.profile).toBe(
      "Founder and full-stack product engineer with 8+ years building payments, identity, mobile, and community products. Has led teams and taken complex systems from concept to production.",
    );
    expect(resumeContent.experience.find(({ company }) => company === "Send")?.period).toBe("Dec 2023 - Aug 2026");
  });

  it("contains public contact details without a phone number", () => {
    expect(resumeContent.location).toBe("Los Angeles area");
    expect(resumeContent.email).toBe("victor@she.energy");
    expect(JSON.stringify(resumeContent)).not.toMatch(/626|808-7834/);
  });
});

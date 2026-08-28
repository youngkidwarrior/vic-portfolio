import resumeJson from "../../content/resume.json";

export type ResumeRole = {
  company: string;
  role: string;
  period: string;
  bullets: string[];
};

export type ResumeContent = {
  name: string;
  title: string;
  location: string;
  email: string;
  website: string;
  profile: string;
  experience: ResumeRole[];
  skills: { label: string; items: string }[];
  recognition: { title: string; detail: string };
  education: { school: string; detail: string };
};

export const resumeContent: ResumeContent = resumeJson;

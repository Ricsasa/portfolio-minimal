export interface SectionConfig {
  /** Anchor id, used both as the DOM id and the URL hash. */
  id: string;
  /** i18n key for the menu label. */
  labelKey: string;
  /** Full-bleed background of the section band. */
  bgColor: string;
  /** Accent used by the section and mirrored by the active menu entry. */
  accentColor: string;
}

export const SECTIONS: SectionConfig[] = [
  {
    id: "home",
    labelKey: "common:pages.home",
    bgColor: "bg-custom-yellow-100",
    accentColor: "custom-yellow-300",
  },
  {
    id: "selected-work",
    labelKey: "common:pages.selected_work",
    bgColor: "bg-custom-green-100",
    accentColor: "custom-green-300",
  },
  {
    id: "professional-experience",
    labelKey: "common:pages.professional_experience",
    bgColor: "bg-custom-blue-100",
    accentColor: "custom-blue-300",
  },
  {
    id: "skills",
    labelKey: "common:pages.skills",
    bgColor: "bg-custom-purple-100",
    accentColor: "custom-purple-300",
  },
  {
    id: "education-and-certification",
    labelKey: "common:pages.education_and_certification",
    bgColor: "bg-custom-coral-100",
    accentColor: "custom-coral-300",
  },
];

export const getSection = (id: string) => SECTIONS.find((s) => s.id === id);

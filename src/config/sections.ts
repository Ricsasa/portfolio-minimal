export interface SectionConfig {
  /** Anchor id, used both as the DOM id and the URL hash. */
  id: string;
  /** i18n key for the menu label. */
  labelKey: string;
  /**
   * Full-bleed background of the section band. The bands alternate between a
   * pine wash and an iris wash so both accents carry the whole page. They stay
   * inside one light theme, and each section is still told apart by its layout.
   */
  bgColor: string;
  /**
   * Action accent, mirrored by the active menu entry. It is pine everywhere.
   * The metadata accent (iris) is applied directly by the components that own
   * metadata, so the two roles cannot be swapped by accident.
   */
  accentColor: string;
}

export const SECTIONS: SectionConfig[] = [
  {
    id: "home",
    labelKey: "common:pages.home",
    bgColor: "bg-paper",
    accentColor: "pine",
  },
  {
    id: "selected-work",
    labelKey: "common:pages.selected_work",
    bgColor: "bg-pine-wash",
    accentColor: "pine",
  },
  {
    id: "professional-experience",
    labelKey: "common:pages.professional_experience",
    bgColor: "bg-iris-wash",
    accentColor: "pine",
  },
  {
    id: "skills",
    labelKey: "common:pages.skills",
    bgColor: "bg-pine-wash",
    accentColor: "pine",
  },
  {
    id: "education-and-certification",
    labelKey: "common:pages.education_and_certification",
    bgColor: "bg-iris-wash",
    accentColor: "pine",
  },
];

export const getSection = (id: string) => SECTIONS.find((s) => s.id === id);

// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';

import sitemap from "@astrojs/sitemap";

import partytown from "@astrojs/partytown";

import reactI18next from "astro-react-i18next";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://ricsasa.work',
  base: '',

  integrations: [react(), sitemap(), partytown(),
  reactI18next({
    defaultLocale: "es-MX",
    locales: ["en-US", "es-MX"],
    namespaces: ['common', 'professional-experiences', 'projects']
  }),
  ],

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Literata",
      cssVariable: "--font-literata",
      fallbacks: ["serif"],
      weights: ["100 900"],
      styles: ["normal", "italic"]
    },
    {
      provider: fontProviders.google(),
      name: "Nunito Sans",
      cssVariable: "--font-nunito",
      fallbacks: ["sans-serif"],
      weights: ["100 900"],
      styles: ["normal", "italic"]
    },
    /*
    {
      provider: fontProviders.google(),
      name: "Roboto Mono",
      cssVariable: "--font-roboto",
      fallbacks: ["monospace"],
      weights: ["100 900"],
      styles: ["normal", "italic"]
    },
    */
    {
      provider: fontProviders.google(),
      name: "Share Tech Mono",
      cssVariable: "--font-share-tech",
      fallbacks: ["monospace"],
      weights: ["100 900"],
      styles: ["normal", "italic"]
    }
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});
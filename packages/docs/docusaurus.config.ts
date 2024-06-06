import type { Config } from "@docusaurus/types";
import autoprefixer from "autoprefixer";
import dotenv from "dotenv";
import { themes } from "prism-react-renderer";
import tailwind from "tailwindcss";

dotenv.config();

const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

const config = {
  title: "IGUHealth",
  tagline: "FHIR Development platform",
  favicon: "img/logo.svg",

  // Set the production url of your site here
  url: "https://docs.iguhealth.app",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "IGUHealth", // Usually your GitHub org/user name.
  projectName: "IGUHealth", // Usually your repo name.

  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "warn",

  plugins: [
    async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(tailwind);
          postcssOptions.plugins.push(autoprefixer);
          return postcssOptions;
        },
      };
    },
  ],

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  presets: [
    [
      "classic",
      {
        gtag: process.env.GOOGLE_GTAG_TRACKING_ID
          ? {
              trackingID: process.env.GOOGLE_GTAG_TRACKING_ID,
              anonymizeIP: true,
            }
          : undefined,
        theme: {
          customCss: ["./src/css/custom.css"],
        },
        docs: {
          routeBasePath: "/", // Serve the docs at the site's root. https://docusaurus.io/docs/docs-introduction#docs-only-mode
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/IGUHealth/IGUHealth/tree/main/packages/docs",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/IGUHealth/IGUHealth/tree/main/packages/docs",
        },
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: "img/docusaurus-social-card.jpg",
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      },
    },
    algolia: {
      // The application ID provided by Algolia
      appId: "9M3PZB2S4M",

      // Public API key: it is safe to commit it
      apiKey: "c1d17934425156e91976e6db786b4117",

      indexName: "iguhealth",

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      // externalUrlRegex: "external\\.com|domain\\.com",

      // // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      // replaceSearchResultPathname: {
      //   from: "/docs/", // or as RegExp: /\/docs\//
      //   to: "/",
      // },

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: "search",

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,

      //... other Algolia params
    },
    navbar: {
      title: "IGUHealth",
      logo: {
        alt: "IGUHealth Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "documentationSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          type: "docSidebar",
          sidebarId: "rfcsSidebar",
          position: "left",
          label: "RFCs",
        },
        { to: "/blog", label: "Blog", position: "right" },
        {
          to: "https://api-reference.iguhealth.app/",
          label: "Reference",
          position: "right",
        },
        { to: "/pricing", label: "Pricing", position: "right" },
        {
          href: "https://github.com/iguhealth/iguhealth",
          "aria-label": "GitHub repository",
          className: "header-github-link",
          position: "right",
        },
        {
          type: "search",
          position: "right",
        },
        {
          href: "https://api.iguhealth.app/auth/login",
          label: "Sign In",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Documentation",
              to: "/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            // {
            //   label: "Stack Overflow",
            //   href: "https://stackoverflow.com/questions/tagged/docusaurus",
            // },
            // {
            //   label: "Discord",
            //   href: "https://discordapp.com/invite/docusaurus",
            // },
            // {
            //   label: "Twitter",
            //   href: "https://twitter.com/docusaurus",
            // },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/iguhealth/iguhealth",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} IGUHealth.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ["hcl", "yaml", "bash", "diff", "json"],
    },
  },
} as Config;

export default config;

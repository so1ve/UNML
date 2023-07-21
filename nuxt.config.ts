import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const r = (s: string) => join(__dirname, s);

const alias = {
  "@unml/core": r("./packages/core/src/index.ts"),
  "@unml/extensions": r("./packages/extensions/src/index.ts"),
  "@unml/schema": r("./packages/schema/src/index.ts"),
  "@unml/kit": r("./packages/kit/src/index.ts"),
  "@unml/client": r("./packages/client/src/index.ts"),
  "@unml/constants": r("./packages/constants/src/index.ts"),
  "@unml/utils/client": r("./packages/utils/src/client.ts"),
  "@unml/utils": r("./packages/utils/src/index.ts"),
};

const viteShared = {
  build: {
    sourcemap: "inline" as const,
    minify: false,
  },
  resolve: {
    alias,
  },
};

export default defineNuxtConfig({
  srcDir: "src/",
  alias,
  ssr: false,
  router: {
    options: {
      hashMode: true,
    },
  },

  modules: [
    "@nuxtjs/i18n",
    "@nuxtjs/fontaine",
    "@nuxtjs/google-fonts",
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@pinia/nuxt",
    "@vue-macros/nuxt",
    "nuxt-electron",
    "vuetify-nuxt-module",
  ],

  imports: {
    presets: ["pinia"],
    imports: [
      {
        from: "@unml/client",
        name: "useClient",
      },
    ],
  },

  electron: {
    build: [
      {
        entry: {
          main: "src-electron/main/index.ts",
        },
        vite: viteShared,
      },
      {
        entry: {
          preload: "src-electron/preload/index.ts",
        },
        onstart(options) {
          options.reload();
        },
        vite: viteShared,
      },
    ],
    renderer: {},
  },

  i18n: {
    locales: [
      {
        code: "en",
        file: "en.yml",
      },
      {
        code: "zh-CN",
        file: "zh-CN.yml",
      },
    ],
    langDir: "locales",
    defaultLocale: "zh-CN",
  },

  unocss: {
    preflight: true,
  },

  googleFonts: {
    families: {
      "Fira Code": true,
      "Noto Serif SC": true,
    },
  },

  fontMetrics: {
    fallbacks: [
      "BlinkMacSystemFont",
      "Segoe UI",
      "Helvetica Neue",
      "Arial",
      "Noto Sans",
    ],
  },

  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: "dark",
        themes: {
          dark: {
            colors: {
              primary: "#1867C0",
              secondary: "#5CBBF6",
            },
          },
        },
      },
    },
  },

  devtools: {
    enabled: true,
  },
});

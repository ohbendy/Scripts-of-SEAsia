import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://sovichet.github.io",
  base: 'scripts-of-southeast-asia',
  integrations: [svelte(), tailwind(), mdx()]
});
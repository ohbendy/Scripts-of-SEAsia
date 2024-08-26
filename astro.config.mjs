import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://ohbendy.github.io",
  base: 'Scripts-of-SEAsia',
  integrations: [svelte(), tailwind(), mdx()]
});
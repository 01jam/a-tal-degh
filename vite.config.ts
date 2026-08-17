/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	// Matches `homepage` in package.json: the app is served from a subfolder on
	// GitHub Pages.
	base: "/a-tal-degh/",
	css: {
		modules: {
			// Pinned so the client and SSR builds agree on class names, otherwise
			// hydration mismatches on every `className`.
			generateScopedName: "[name]__[local]___[hash:base64:5]",
		},
	},
	build: {
		// Kept as `build` (instead of Vite's default `dist`) so `npm run deploy`
		// and .gitignore keep working.
		outDir: "build",
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.ts",
		css: true,
	},
});

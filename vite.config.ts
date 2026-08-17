/// <reference types="vitest/config" />
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const root = import.meta.dirname;

const MIME_TYPES: Record<string, string> = {
	".yml": "text/yaml",
	".yaml": "text/yaml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
};

/**
 * Serves `api/` and `contents/` straight off disk in dev, so editing
 * `api/content.yml` or dropping in an image shows up on refresh instead of
 * needing a commit + push to the GitHub raw host the production build reads
 * from. Paired with `VITE_GITHUB_RAWCONTENT=` in `.env.development`, which
 * makes `contentUrl()` build these same root-relative paths.
 */
const serveLocalContent = (): Plugin => ({
	name: "serve-local-content",
	apply: "serve",
	configureServer(server) {
		server.middlewares.use((req, res, next) => {
			const url = (req.url ?? "").split("?")[0];
			if (!url.startsWith("/api/") && !url.startsWith("/contents/")) {
				next();
				return;
			}

			const filePath = path.resolve(root, `.${url}`);
			// Guards against `..` in the URL escaping `root`.
			if (!filePath.startsWith(root) || !fs.existsSync(filePath)) {
				next();
				return;
			}

			res.setHeader(
				"Content-Type",
				MIME_TYPES[path.extname(filePath)] ?? "application/octet-stream"
			);
			res.setHeader("Cache-Control", "no-store");
			fs.createReadStream(filePath).pipe(res);
		});
	},
});

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), serveLocalContent()],
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

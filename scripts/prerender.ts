/**
 * Static pre-rendering step, run after the client and SSR builds.
 *
 * Reads the local `api/*.yml`, renders the app to HTML with that data already
 * in the SWR cache, and writes both the markup and the data into
 * `build/index.html`. The client hydrates from the same data, then SWR
 * revalidates against GitHub — so content edits still land without a rebuild.
 */
import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { CONTENT_KEY, type Content } from "./content.ts";

const root = path.join(import.meta.dirname, "..");
const contentPath = path.join(root, "api", "content.yml");
const indexPath = path.join(root, "build", "index.html");

const content =
	(parse(fs.readFileSync(contentPath, "utf-8")) as Content | null) ?? {};

// Keyed the way SWR keys its cache, so the client hydrates from this exact
// entry instead of refetching.
const fallback = { [CONTENT_KEY]: content };

// Produced by `npm run build:ssr`, so it does not exist when the scripts are
// typechecked. Building the specifier keeps TypeScript from resolving it.
const entryUrl = new URL("../build-ssr/entry-server.js", import.meta.url).href;
const { render } = (await import(entryUrl)) as {
	render: (fallback: Record<string, unknown>) => string;
};

const appHtml = render(fallback);

// `</script>` inside the data would close the tag early; escaping `<` is enough
// to keep the payload inert.
const serialized = JSON.stringify(fallback).replace(/</g, "\\u003c");

const template = fs.readFileSync(indexPath, "utf-8");

for (const marker of ["<!--app-html-->", "<!--app-data-->"]) {
	if (!template.includes(marker)) {
		throw new Error(`Missing ${marker} placeholder in build/index.html`);
	}
}

const html = template
	.replace("<!--app-html-->", appHtml)
	.replace(
		"<!--app-data-->",
		`<script>window.__SWR_FALLBACK__=${serialized}</script>`
	);

fs.writeFileSync(indexPath, html);

const records = Object.values(content).reduce(
	(sum, entries) => sum + entries.length,
	0
);
console.log(
	`prerendered build/index.html — ${records} records across ${
		Object.keys(content).length
	} sections, ${(html.length / 1024).toFixed(1)} kB`
);

/**
 * Post-build check on the real artifact in `build/`.
 *
 * The unit tests exercise components through Vite's dev transform, so they
 * cannot catch the two failure modes that only exist in a production build:
 * the client and SSR builds disagreeing on CSS module class names, and the
 * bundle throwing on load. This boots the built HTML and executes the built
 * bundle to cover both.
 */
import fs from "node:fs";
import path from "node:path";
import { JSDOM, VirtualConsole } from "jsdom";
import { parse } from "yaml";
import type { Content } from "./content.ts";

const root = path.join(import.meta.dirname, "..");
const buildDir = path.join(root, "build");
const assetsDir = path.join(buildDir, "assets");
const indexPath = path.join(buildDir, "index.html");

const failures: string[] = [];
const check = (ok: boolean, message: string) => {
	if (!ok) failures.push(message);
	console.log(`${ok ? "  ok" : "FAIL"}  ${message}`);
};

// The type annotation on the binding (not just the return type) is what lets
// TypeScript treat a `bail()` call as terminating control flow.
const bail: (message: string) => never = (message) => {
	console.error(message);
	process.exit(1);
};

if (!fs.existsSync(indexPath)) {
	bail("build/index.html not found — run the build first");
}

const html = fs.readFileSync(indexPath, "utf-8");

/* 1. The prerender step actually ran. */
check(!html.includes("<!--app-html-->"), "markup placeholder was replaced");
check(html.includes("__SWR_FALLBACK__"), "fallback data was injected");

/* 2. Every section made it into the static markup. */
const contentPath = path.join(root, "api", "content.yml");
const content =
	(parse(fs.readFileSync(contentPath, "utf-8")) as Content | null) ?? {};

check(Object.keys(content).length > 0, "api/content.yml has sections");

for (const [resource, records] of Object.entries(content)) {
	const label = records[0]?.name ?? records[0]?.title;

	check(
		html.includes(`id="${resource}"`),
		`section "${resource}" is in the static HTML`
	);
	// Escaped the same way React escapes it, so the comparison is meaningful.
	const escaped = label?.replace(/&/g, "&amp;").replace(/</g, "&lt;");
	check(
		!escaped || html.includes(escaped),
		`first record of "${resource}" is in the static HTML`
	);
}

/* 3. Client and SSR builds agree on CSS module class names. A mismatch here
      breaks hydration on every element that carries a scoped class. */
const assets = fs.readdirSync(assetsDir);
const cssFile = assets.find((f) => f.endsWith(".css"));
const bundleFile = assets.find((f) => f.endsWith(".js"));

if (!cssFile || !bundleFile) {
	bail("expected a .css and a .js file in build/assets");
}

const css = fs.readFileSync(path.join(assetsDir, cssFile), "utf-8");

const scoped = new Set<string>();
for (const match of html.matchAll(/class="([^"]+)"/g)) {
	for (const name of match[1].split(/\s+/)) {
		if (name.includes("___")) scoped.add(name);
	}
}
const orphans = [...scoped].filter((name) => !css.includes(`.${name}`));
check(scoped.size > 0, "static HTML carries scoped CSS module classes");
check(
	orphans.length === 0,
	`every scoped class exists in the CSS bundle${
		orphans.length ? ` (missing: ${orphans.join(", ")})` : ""
	}`
);

/* 4. The built bundle loads and hydrates the built markup without errors. */
const bundle = fs.readFileSync(path.join(assetsDir, bundleFile), "utf-8");

const consoleErrors: string[] = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on("jsdomError", (error: Error) =>
	consoleErrors.push(error.message)
);
virtualConsole.on("error", (...args: unknown[]) =>
	consoleErrors.push(args.join(" "))
);

const dom = new JSDOM(html, {
	url: "http://localhost/a-tal-degh/",
	// Runs the inline fallback-data script. The external module script is not
	// fetched, so the bundle below is the only code that executes.
	runScripts: "dangerously",
	pretendToBeVisual: true,
	virtualConsole,
});

const { window } = dom;

Object.assign(window, {
	// jsdom implements neither, and both are reached during hydration.
	IntersectionObserver: class {
		observe() {}
		unobserve() {}
		disconnect() {}
		takeRecords() {
			return [];
		}
	},
	// Keep SWR revalidation from touching the network: it would make this check
	// slow and dependent on GitHub being reachable.
	XMLHttpRequest: class {
		open() {}
		setRequestHeader() {}
		abort() {}
		addEventListener() {}
		removeEventListener() {}
		send() {}
	},
});

const rootEl = window.document.getElementById("root");
if (!rootEl) {
	bail("no #root element in build/index.html");
}

const before = rootEl.innerHTML;

window.eval(bundle);

// Let hydration and its effects flush.
await new Promise((resolve) => setTimeout(resolve, 250));

const after = rootEl.innerHTML;

check(consoleErrors.length === 0, "bundle hydrates without console errors");
for (const error of consoleErrors) console.error(`      ${error}`);

check(
	after.includes("Trattoria Aldina"),
	"content is still present after hydration"
);
check(
	before.length > 0 && after.length > 0,
	"hydration did not blank the root element"
);

window.close();

console.log(
	failures.length ? `\n${failures.length} check(s) failed` : "\nbuild verified"
);
process.exit(failures.length ? 1 : 0);

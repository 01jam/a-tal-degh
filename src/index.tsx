import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { SWRConfig } from "swr";
import App from "./App";
// Upright weights only: nothing on the site is italic, and this keeps the five
// italic subsets out of the build. Variable, so 100-900 is a single file per
// subset, and unicode-range means a browser downloads only the ones it needs.
import "@fontsource-variable/geist/wght.css";
import "./styles/globals.scss";

declare global {
	interface Window {
		__SWR_FALLBACK__?: Record<string, unknown>;
	}
}

// Injected by prerender.js. Absent when running the dev server, which serves
// the untouched template.
const fallback = window.__SWR_FALLBACK__;

const container = document.getElementById("root") as HTMLElement;

const app = (
	<React.StrictMode>
		<SWRConfig value={{ fallback: fallback ?? {} }}>
			<App />
		</SWRConfig>
	</React.StrictMode>
);

if (fallback) {
	hydrateRoot(container, app);
} else {
	createRoot(container).render(app);
}

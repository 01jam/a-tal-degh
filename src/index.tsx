import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { SWRConfig } from "swr";
import App from "./App";
import "./index.scss";

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

import { renderToString } from "react-dom/server";
import { SWRConfig } from "swr";
import App from "./App";

/** Resource name -> records, seeded from the local `api/*.yml` at build time. */
type Fallback = Record<string, unknown>;

/**
 * Renders the app to static HTML. `fallback` primes the SWR cache so the
 * markup is complete instead of showing the empty pre-fetch state.
 */
const render = (fallback: Fallback) =>
	renderToString(
		<SWRConfig value={{ fallback }}>
			<App />
		</SWRConfig>
	);

export { render };
export type { Fallback };

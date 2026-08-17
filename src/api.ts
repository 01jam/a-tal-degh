import axios from "axios";
import { parse } from "yaml";

interface Record {
	name?: string | null;
	title?: string | null;
	specialty?: string | null;
	notes?: string | null;
	link?: string | null;
	img?: string | null;
	/** Free text: a single date or a period ("12-20 settembre"). */
	date?: string | null;
	/** Where the place is: "In città", "Collina"... Shown as its own column. */
	zone?: string | null;
	/** When to go: colazione, spuntino, pranzo, cena. Shown as its own column. */
	when?: string[] | null;
	/**
	 * Set on places that have shut down. Absent means open, so only the
	 * exceptions carry the flag.
	 */
	closed?: boolean | null;
	/** Overall score, 1-5. Tables are ordered by this, highest first. */
	rating?: number | null;
	/** Price score, 1-5. */
	price?: number | null;
	/** Dish slug, set on `specialties` records. Matched against `tags`. */
	dish?: string | null;
	/** Occasion and/or dish slugs, set on `places` records. */
	tags?: string[] | null;
}

interface Content {
	specialties?: Record[];
	places?: Record[];
	visit?: Record[];
	festival?: Record[];
}

/** SWR cache key. Must match the key the prerender seeds its fallback with. */
const CONTENT_KEY = "content";

const RAWCONTENT = import.meta.env.VITE_GITHUB_RAWCONTENT;

const contentUrl = (path: string) => `${RAWCONTENT}${path}`;

/**
 * One request for every section. Splitting this per resource would mean
 * several round trips to a host that is rate limited, for a payload of a few
 * kB.
 */
const fetchContent = async (): Promise<Content> => {
	const { data } = await axios.get<string>(
		contentUrl("/api/content.yml"),
		// YAML has no dedicated content type, so keep axios from guessing and
		// hand the raw text to the parser.
		{ responseType: "text", transformResponse: [(body) => body] }
	);

	return parse(data) ?? {};
};

/**
 * Places tagged with `tag` — an occasion (breakfast, lunch...) or a dish. The
 * same helper drives both the fixed page sections and the dish overlay.
 */
const byTag = (places: Record[] | undefined, tag: string): Record[] =>
	(places ?? []).filter((place) => place.tags?.includes(tag));

export { byTag, CONTENT_KEY, contentUrl, fetchContent };
export type { Content, Record };

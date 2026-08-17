import axios from "axios";
import { parse } from "yaml";

/**
 * Sections of `api/content.yml`. The order is the order they appear on the
 * page.
 */
const RESOURCES = [
	"specialties",
	"breakfast",
	"lunch",
	"stop",
	"drink",
	"outside",
	"visit",
	"festival",
] as const;

type Resource = (typeof RESOURCES)[number];

interface Record {
	name?: string | null;
	title?: string | null;
	specialty?: string | null;
	notes?: string | null;
	link?: string | null;
	img?: string | null;
}

type Content = { [K in Resource]?: Record[] };

/** SWR cache key. Must match the key the prerender seeds its fallback with. */
const CONTENT_KEY = "content";

const RAWCONTENT = import.meta.env.VITE_GITHUB_RAWCONTENT;

const contentUrl = (path: string) => `${RAWCONTENT}${path}`;

/**
 * One request for every section. Splitting this per resource would mean eight
 * round trips to a host that is rate limited, for a payload of a few kB.
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

export { CONTENT_KEY, RESOURCES, contentUrl, fetchContent };
export type { Content, Record, Resource };

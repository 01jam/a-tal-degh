/** Shapes shared by the build-time scripts. Mirrors src/api.ts. */

interface ContentRecord {
	name?: string | null;
	title?: string | null;
	specialty?: string | null;
	notes?: string | null;
	link?: string | null;
	img?: string | null;
	dish?: string | null;
	tags?: string[] | null;
}

/** The parsed `api/content.yml`: section name -> records. */
type Content = Record<string, ContentRecord[]>;

/** SWR cache key. Must match CONTENT_KEY in src/api.ts. */
const CONTENT_KEY = "content";

export { CONTENT_KEY };
export type { Content, ContentRecord };

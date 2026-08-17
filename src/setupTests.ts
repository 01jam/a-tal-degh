// jest-dom adds custom matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/vitest";

// jsdom does not implement IntersectionObserver, which `framer`'s useInView
// relies on.
class IntersectionObserverStub implements IntersectionObserver {
	readonly root = null;
	readonly rootMargin = "";
	readonly thresholds: ReadonlyArray<number> = [];
	observe() {}
	unobserve() {}
	disconnect() {}
	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}
}

globalThis.IntersectionObserver = IntersectionObserverStub;

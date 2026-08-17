import { useInView } from "motion/react";
import { FC, FocusEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-aria-components";
import { css } from "../utils/css";
import styles from "./navigation.module.scss";

const SECTIONS = [
	{ id: "specialties", label: "Specialties 👑" },
	{ id: "breakfast", label: "Appena svegli ☕️" },
	{ id: "lunch", label: "Trattorie 🍖" },
	{ id: "stop", label: "Pranzo al volo 🏎" },
	{ id: "drink", label: "Bere e aperitivi 🍹" },
	{ id: "outside", label: "Cena fuori città 🎒" },
	{ id: "visit", label: "Cosa vedere 👀" },
	{ id: "festival", label: "Festival 🎤" },
];

const Navigation: FC = () => {
	const [scrollDir, setScrollDir] = useState<number>();
	const [, setHeight] = useState<number>();
	const [hasFocus, setHasFocus] = useState(false);

	const navRef = useRef<HTMLElement>(null);
	const elRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const threshold = 50;
		let lastScrollY = window.scrollY;
		let ticking = false;

		const updateScrollDir = () => {
			const scrollY = window.scrollY;

			if (Math.abs(scrollY - lastScrollY) < threshold) {
				ticking = false;
				return;
			}
			setScrollDir(scrollY > lastScrollY ? 1 : -1);
			lastScrollY = scrollY > 0 ? scrollY : 0;
			ticking = false;
		};

		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(updateScrollDir);
				ticking = true;
			}
		};

		const onMove = () => {
			setScrollDir(-1);
		};

		const onResize = () => {
			setHeight(navRef.current?.offsetHeight);
		};

		onResize();

		window.addEventListener("scroll", onScroll);
		window.addEventListener("resize", onResize);
		window.addEventListener("mousemove", onMove);

		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onResize);
			window.removeEventListener("mousemove", onMove);
		};
	}, [scrollDir]);

	const isInView = useInView(elRef, { amount: 0 });

	// Sliding the nav away while it holds keyboard focus would move the focused
	// link off screen with no way to see where the focus went.
	const isHidden = !isInView && !hasFocus && !!scrollDir && scrollDir > 0;

	const onBlur = (event: FocusEvent<HTMLElement>) => {
		if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false);
	};

	return (
		<>
			<nav
				ref={navRef}
				onFocus={() => setHasFocus(true)}
				onBlur={onBlur}
				className={css(
					styles.nav,
					styles[isHidden ? "nav--is-hidden" : "nav--not-hidden"]
				)}>
				<div className={styles.row}>
					{SECTIONS.slice(0, 6).map(({ id, label }) => (
						<Link key={id} href={`#${id}`} className={styles.link}>
							{label}
						</Link>
					))}
				</div>
				<div className={styles.row}>
					{SECTIONS.slice(6).map(({ id, label }) => (
						<Link key={id} href={`#${id}`} className={styles.link}>
							{label}
						</Link>
					))}
				</div>
			</nav>
			<div ref={elRef} />
		</>
	);
};

export { Navigation };

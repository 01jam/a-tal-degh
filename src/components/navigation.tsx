import { FC } from "react";
import { Button } from "react-aria-components";
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

// Setting the hash rather than calling scrollIntoView keeps the URL in step
// with where the page actually is, and html { scroll-behavior: smooth } still
// animates the jump.
const goTo = (id: string) => {
	window.location.hash = id;
};

const Navigation: FC = () => (
	<nav className={styles.nav}>
		<div className={styles.row}>
			{SECTIONS.slice(0, 6).map(({ id, label }) => (
				<Button key={id} className={styles.link} onPress={() => goTo(id)}>
					{label}
				</Button>
			))}
		</div>
		<div className={styles.row}>
			{SECTIONS.slice(6).map(({ id, label }) => (
				<Button key={id} className={styles.link} onPress={() => goTo(id)}>
					{label}
				</Button>
			))}
		</div>
	</nav>
);

export { Navigation };

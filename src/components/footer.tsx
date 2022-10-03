import { FC } from "react";
import { Block } from "./block";
import styles from "./footer.module.scss";

const Footer: FC = () => {
	return (
		<Block>
			<footer className={styles.container}>Sample text</footer>
		</Block>
	);
};

export { Footer };

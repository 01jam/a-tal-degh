import { FC, PropsWithChildren } from "react";
import { Link } from "react-aria-components";
import { css } from "../utils/css";
import styles from "./conditionalIf.module.scss";

interface DefaultProps {
	href?: string | null;
	target?: string;
	className?: string;
}

const ConditionalIf: FC<PropsWithChildren<DefaultProps>> = ({
	href,
	target,
	className,
	children,
}) =>
	href ? (
		<Link
			className={className}
			href={href}
			target={target}
			// Without this the opened page keeps a handle on this one.
			rel={target === "_blank" ? "noreferrer" : undefined}>
			{children}
		</Link>
	) : (
		// Deliberately not an anchor. An <a> without href is not focusable and
		// is not announced as a link, so it reads as a broken control rather
		// than as the plain text it actually is.
		<span className={css(className, styles["disabled"])}>{children}</span>
	);

export { ConditionalIf };

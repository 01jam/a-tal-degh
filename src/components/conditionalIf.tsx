import { FC, PropsWithChildren } from "react";
import { css } from "../utils/css";
import styles from "./conditionalIf.module.scss";

interface DefaultProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {}

const ConditionalIf: FC<PropsWithChildren<DefaultProps>> = ({
  href,
  className,
  children,
  ...rest
}) =>
  href ? (
    <a className={className} href={href} {...rest}>
      {children}
    </a>
  ) : (
    <a className={css(className, styles["disabled"])} {...rest}>
      {children}
    </a>
  );

export { ConditionalIf };

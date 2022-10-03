import { FC, PropsWithChildren } from "react";
import { css } from "../utils/css";
import styles from "./section.module.scss";

const Section: FC<PropsWithChildren<{ bg?: string; id?: string }>> = ({
  bg,
  id,
  children,
}) => {
  return (
    <section
      id={id}
      className={css(
        styles.container,
        bg && styles[`bg`],
        bg && styles[`bg--${bg}`]
      )}
    >
      <div className={styles.inner}>{children}</div>
    </section>
  );
};

export { Section };

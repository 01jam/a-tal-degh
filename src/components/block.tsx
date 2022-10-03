import { FC, PropsWithChildren } from "react";
import { css } from "../utils/css";
import styles from "./block.module.scss";

const Block: FC<PropsWithChildren<{ fullBleed?: boolean }>> = ({
  fullBleed,
  children,
}) => {
  return (
    <div className={css(styles.container, fullBleed && styles["fullbleed"])}>
      {children}
    </div>
  );
};

export { Block };

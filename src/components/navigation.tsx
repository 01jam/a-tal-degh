import { FC, useEffect, useRef, useState } from "react";
import { css } from "../utils/css";
import styles from "./navigation.module.scss";

const Navigation: FC = () => {
  const [scrollDir, setScrollDir] = useState<number>();
  const [height, setHeight] = useState<number>();

  const elRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const threshold = 0;
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

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
      setHeight(elRef.current?.offsetHeight);
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

  return (
    <>
      <nav
        ref={elRef}
        className={css(
          styles.nav,
          styles[
            scrollDir && scrollDir > 0 ? "nav--is-hidden" : "nav--not-hidden"
          ]
        )}
      >
        <div className={styles.row}>
          <a href={"#specialties"} className={styles.link}>
            Specialties 👑
          </a>
          <a href={"#breakfast"} className={styles.link}>
            Appena svegli ☕️
          </a>
          <a href={"#lunch"} className={styles.link}>
            Trattorie 🍖
          </a>
          <a href={"#stop"} className={styles.link}>
            Pranzo al volo 🏎
          </a>
          <a href={"#drink"} className={styles.link}>
            Bere e aperitivi 🍹
          </a>
          <a href={"#outside"} className={styles.link}>
            Cena fuori città 🎒
          </a>
        </div>
        <div className={styles.row}>
          <a href={"#visit"} className={styles.link}>
            Cosa vedere 👀
          </a>
          <a href={"#festival"} className={styles.link}>
            Festival 🎤
          </a>
        </div>
      </nav>
      <div style={{ height }} />
    </>
  );
};

export { Navigation };

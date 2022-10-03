const css = (...classNames: (string | undefined | false)[]) =>
  classNames.filter((i) => !!i).join(" ");

export { css };

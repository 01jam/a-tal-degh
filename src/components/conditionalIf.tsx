import { FC, PropsWithChildren } from "react";

interface DefaultProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {}

const ConditionalIf: FC<PropsWithChildren<DefaultProps>> = ({
  href,
  children,
  ...rest
}) => (href ? <a {...rest}>{children}</a> : <a {...rest}>{children}</a>);

export { ConditionalIf };

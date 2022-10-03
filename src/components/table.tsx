import { FC } from "react";
import styles from "./table.module.scss";

const Table: FC<{
  head?: (JSX.Element | null)[];
  body: (JSX.Element | null)[][];
}> = ({ head, body }) => {
  return (
    <table>
      {head && (
        <thead>
          <tr>
            {head.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {body.map((row, index) => (
          <tr key={index}>
            {row.map((column, index) => (
              <td key={index}>{column}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { Table };

import { FC, ReactNode } from "react";
import {
	Cell,
	Column,
	Row,
	Table as AriaTable,
	TableBody,
	TableHeader,
} from "react-aria-components";
import styles from "./table.module.scss";

interface DefaultProps {
	/** Accessible name for the table. Without it the table is unlabelled. */
	label: string;
	columns: string[];
	rows: ReactNode[][];
}

const Table: FC<DefaultProps> = ({ label, columns, rows }) => (
	<AriaTable aria-label={label} className={styles.container}>
		<TableHeader>
			{columns.map((column, index) => (
				// The first column names its row, which is what lets a screen
				// reader say which record a cell belongs to.
				<Column key={column} id={column} isRowHeader={index === 0}>
					<h4>
						<strong>
							<mark>{column}</mark>
						</strong>
					</h4>
				</Column>
			))}
		</TableHeader>
		<TableBody>
			{rows.map((row, rowIndex) => (
				<Row key={rowIndex} id={rowIndex}>
					{row.map((cell, cellIndex) => (
						<Cell key={cellIndex}>{cell}</Cell>
					))}
				</Row>
			))}
		</TableBody>
	</AriaTable>
);

export { Table };

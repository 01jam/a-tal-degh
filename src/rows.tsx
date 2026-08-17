import { Fragment } from "react";
import { ConditionalIf } from "./components/conditionalIf";
import { Record } from "./api";
import styles from "./rows.module.scss";

/**
 * The zone and when columns only earn their place when some record in the set
 * fills them in; otherwise every table without that data would carry an empty
 * column.
 */
const hasZone = (records: Record[]) => records.some((record) => !!record.zone);
const hasWhen = (records: Record[]) =>
	records.some((record) => !!record.when?.length);
/**
 * Column headers matching what `rows` emits for the same arguments. Deriving
 * both from the same two inputs is what keeps headers and cells lined up.
 */
const columns = (records: Record[], withSpecialty = true) =>
	[
		"Nome",
		withSpecialty ? "Specialità" : null,
		hasZone(records) ? "Zona" : null,
		hasWhen(records) ? "Quando" : null,
		"Note",
	].filter((column) => column !== null);

/** Unscored records sort below anything that was actually scored. */
const score = (value: number | null | undefined) =>
	value ?? Number.NEGATIVE_INFINITY;

/**
 * Closed places last whatever they scored, then best rated first with the
 * price score breaking the ties. Records with no rating keep their file order
 * at the bottom of the open ones rather than being treated as a zero, which
 * would rank them below places that were actually scored badly.
 */
const byRating = (records: Record[]) =>
	[...records].sort(
		(a, b) =>
			Number(!!a.closed) - Number(!!b.closed) ||
			score(b.rating) - score(a.rating) ||
			score(b.price) - score(a.price)
	);

/** A closed place is not somewhere to go, so it loses its map link. */
const name = (record: Record) =>
	record.closed ? (
		<s>{record.name}</s>
	) : (
		<ConditionalIf target='_blank' href={record.link ?? undefined}>
			{record.name}
		</ConditionalIf>
	);

/**
 * Name / specialty / zone / when / notes cells, shared by every table of places
 * — the fixed page sections and the dish overlay both render through this.
 * `rating` and `price` are deliberately not columns: they are data the record
 * carries, and they order the rows, but the tables do not show the numbers.
 */
const rows = (records: Record[], withSpecialty = true) =>
	byRating(records).map((record) =>
		[
			<Fragment>{name(record)}</Fragment>,
			withSpecialty ? <Fragment>{record.specialty}</Fragment> : null,
			// The wrapper only goes in when there is a zone to hold: an empty
			// element would still count as content and keep the stacked layout
			// from dropping the field's label.
			hasZone(records) ? (
				<Fragment>
					{record.zone ? (
						<span className={styles.zone}>{record.zone}</span>
					) : null}
				</Fragment>
			) : null,
			hasWhen(records) ? (
				<Fragment>{record.when?.join(", ")}</Fragment>
			) : null,
			<Fragment>{record.notes}</Fragment>,
		].filter((cell) => cell !== null)
	);

export { columns, rows };

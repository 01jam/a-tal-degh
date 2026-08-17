import { FC, useEffect, useState } from "react";
import {
	Button,
	Dialog,
	Heading,
	Modal,
	ModalOverlay,
} from "react-aria-components";
import { byTag, Record } from "../api";
import { columns, rows } from "../rows";
import { Table } from "./table";
import styles from "./dishOverlay.module.scss";

interface DefaultProps {
	/** The specialty card that was pressed, or null when the overlay is closed. */
	specialty: Record | null;
	places: Record[] | undefined;
	onClose: () => void;
}

const DishOverlay: FC<DefaultProps> = ({ specialty, places, onClose }) => {
	// Kept a beat behind `specialty` so the panel still shows its content while
	// it slides out — clearing it immediately would blank the title and table
	// mid-animation.
	const [displaySpecialty, setDisplaySpecialty] = useState<Record | null>(
		null
	);

	useEffect(() => {
		if (specialty) setDisplaySpecialty(specialty);
	}, [specialty]);


	const matches = displaySpecialty?.dish
		? byTag(places, displaySpecialty.dish)
		: [];

	return (
		<ModalOverlay
			isOpen={!!specialty}
			isDismissable
			onOpenChange={(isOpen) => !isOpen && onClose()}
			className={styles.overlay}>
			<Modal className={styles.modal}>
				<Dialog className={styles.dialog}>
					{({ close }) => (
						<>
							<div className={styles.header}>
								{/* slot="title" is what wires this into the dialog's
								    aria-labelledby — without it RAC warns the dialog has
								    no accessible name. */}
								<Heading slot='title' className={styles.heading}>
									{displaySpecialty?.title}
								</Heading>
								<Button
									onPress={close}
									className={styles.close}
									aria-label='Chiudi'>
									✕
								</Button>
							</div>
							{matches.length > 0 ? (
								<Table
									label={`Locali per ${displaySpecialty?.title}`}
									columns={columns(matches)}
									rows={rows(matches)}
								/>
							) : (
								<p className={styles.empty}>
									Nessun locale ancora segnalato per questo piatto.
								</p>
							)}
						</>
					)}
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
};

export { DishOverlay };

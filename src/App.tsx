import { Fragment, FC } from "react";
import { Block } from "./components/block";
import { Section } from "./components/section";
import { Table } from "./components/table";
import styles from "./app.module.scss";
import useSWR from "swr";
import { typo } from "./styles";
import { ConditionalIf } from "./components/conditionalIf";
import { Navigation } from "./components/navigation";
import { CONTENT_KEY, Content, contentUrl, fetchContent, Record } from "./api";

/** One request feeds every section. */
const useContent = (): Content =>
	useSWR<Content>(CONTENT_KEY, fetchContent).data ?? {};

/** Name / specialty / notes rows, shared by every table section. */
const rows = (records: Record[], withSpecialty = true) =>
	records.map((record) =>
		[
			<ConditionalIf target='_blank' href={record.link ?? undefined}>
				{record.name}
			</ConditionalIf>,
			withSpecialty ? <Fragment>{record.specialty}</Fragment> : null,
			<Fragment>{record.notes}</Fragment>,
		].filter((cell) => cell !== null)
	);

/** Captioned image grid, used by specialties, visit and festival. */
const Grid: FC<{ records: Record[] }> = ({ records }) => (
	<div className={styles.grid}>
		{records.map((record, index) => (
			<ConditionalIf
				key={index}
				href={record.link ?? undefined}
				target='_blank'
				className={styles.block}>
				<div className={styles.caption}>
					<p>{record.title}</p>
					<p>📍</p>
				</div>
				<img src={contentUrl(record.img ?? "")} alt={record.title ?? ""} />
			</ConditionalIf>
		))}
	</div>
);

function App() {
	const {
		specialties,
		breakfast,
		lunch,
		stop,
		drink,
		outside,
		visit,
		festival,
	} = useContent();

	return (
		<main className='App'>
			{/* Disclaimer */}
			<Section bg='black'>
				<Block>
					<h3>
						Use the ⚠️ button to report something suspect about a record – such
						as wrong opening hours, bad experience, expensive bill, wrong info –
						it will be revised and updated ASAP.
					</h3>
					<h3>
						Sorry for pixelated photos but I don't own the copyright and you
						don't want spoilers.
					</h3>
				</Block>
			</Section>
			{/* Specialties */}
			{!!specialties?.length && (
				<Section id={"specialties"}>
					<Block>
						<h2>Specialità</h2>

						<p className={typo.medium}>
							I re indiscussi della tavola o cose difficili da torvare
							altrove...
						</p>

						<Grid records={specialties} />
					</Block>
				</Section>
			)}
			{/* Breakfast */}
			{!!breakfast?.length && (
				<Section id={"breakfast"}>
					<Block>
						<h2>Appena svegli</h2>

						<p className={typo.medium}>
							Sì, il gnocco fritto si mangia a colazione
						</p>
					</Block>
					<Table
						label="Appena svegli"
						columns={["Nome", "Specialità", "Note"]}
						rows={rows(breakfast)}
					/>
				</Section>
			)}
			{/* Lunch */}
			{!!lunch?.length && (
				<Section id={"lunch"}>
					<Block>
						<h2>Trattorie</h2>

						<p className={typo.medium}>
							La regola generale? Se ha il menù fisso vai tranquill*
						</p>
					</Block>
					<Table
						label="Trattorie"
						columns={["Nome", "Specialità", "Note"]}
						rows={rows(lunch)}
					/>
				</Section>
			)}
			{/* Snack */}
			{!!stop?.length && (
				<Section id={"stop"}>
					<Block>
						<h2>Pranzo al volo</h2>
					</Block>
					<Table
						label="Pranzo al volo"
						columns={["Nome", "Specialità", "Note"]}
						rows={rows(stop)}
					/>
				</Section>
			)}
			{/* Bere e aperitivo */}
			{!!drink?.length && (
				<Section id={"drink"}>
					<Block>
						<h2>Bere</h2>
					</Block>
					<Table
						label="Bere"
						columns={["Nome", "Note"]}
						rows={rows(drink, false)}
					/>
				</Section>
			)}
			{/* Cena fuori modena */}
			{!!outside?.length && (
				<Section id={"outside"}>
					<Block>
						<h2>Cena al fresco</h2>
					</Block>
					<Table
						label="Cena al fresco"
						columns={["Nome", "Specialità", "Note"]}
						rows={rows(outside)}
					/>
				</Section>
			)}
			{/* Places and activities */}
			{!!visit?.length && (
				<Section id={"visit"}>
					<Block>
						<h2>Una breve visita</h2>

						<p className={typo.medium}>Cosa vedere se si è di passaggio</p>

						<Grid records={visit} />
					</Block>
				</Section>
			)}
			{/* Festival */}
			{!!festival?.length && (
				<Section id={"festival"}>
					<Block>
						<h2>Festival ed eventi</h2>

						<p className={typo.medium}>
							Non è Milano, ma un paio di festival ci sono
						</p>

						<Grid records={festival} />
					</Block>
				</Section>
			)}

			<Navigation />

		</main>
	);
}

export default App;

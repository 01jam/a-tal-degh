import { FC, useState } from "react";
import { Button } from "react-aria-components";
import { Block } from "./components/block";
import { Section } from "./components/section";
import { Table } from "./components/table";
import { DishOverlay } from "./components/dishOverlay";
import styles from "./app.module.scss";
import useSWR from "swr";
import { ConditionalIf } from "./components/conditionalIf";
import { Navigation } from "./components/navigation";
import { byTag, CONTENT_KEY, Content, contentUrl, fetchContent, Record } from "./api";
import { columns, rows } from "./rows";

/** One request feeds every section. */
const useContent = (): Content => useSWR<Content>(CONTENT_KEY, fetchContent).data ?? {};

/**
 * Captioned image grid, used by specialties, visit and festival. Specialty
 * cards render as buttons that open the dish overlay instead of linking out.
 */
const Grid: FC<{ records: Record[]; onSelect?: (record: Record) => void }> = ({
  records,
  onSelect,
}) => (
  <div className={styles.grid}>
    {records.map((record, index) => {
      const content = (
        <>
          <div className={styles.caption}>
            <div>
              <p>{record.title}</p>
              {record.date && <p className={styles.date}>{record.date}</p>}
            </div>
            <p>📍</p>
          </div>
          {record.img ? (
            <img src={contentUrl(record.img)} alt={record.title ?? ""} />
          ) : (
            <div className={styles.placeholder} aria-hidden="true">
              🖼️
            </div>
          )}
        </>
      );

      return onSelect ? (
        <Button
          key={index}
          className={styles.block}
          onPress={() => onSelect(record)}
        >
          {content}
        </Button>
      ) : (
        <ConditionalIf
          key={index}
          href={record.link ?? undefined}
          target="_blank"
          className={styles.block}
        >
          {content}
        </ConditionalIf>
      );
    })}
  </div>
);

function App() {
  const { specialties, places, visit, festival } = useContent();
  const [activeSpecialty, setActiveSpecialty] = useState<Record | null>(null);

  const breakfast = byTag(places, "colazione");
  const lunch = byTag(places, "pranzo");
  const stop = byTag(places, "volo");
  const drink = byTag(places, "bere");
  const outside = byTag(places, "fuori");

  return (
    <main className="App">
      {/* Disclaimer */}
      <Section bg="black">
        <Block>
          <h3>
            Questa pagina nasce per poter rispondere con un link veloce quando qualcuno mi chiede se
            ho consigli o suggerimenti su cosa fare a Modena, la mia città. Invece che provare a
            ricordarmi tutto da zero ogni volta, dimenticandomi sempre qualcosa, gli condivido
            questo link. Se sei arrivato qui senza link, complimenti. Ecco qualche suggerimento.
          </h3>
          <h3 className="text-xl">
            Perdonerete le foto pixelate, ma non ne ho i diritti e comunque non vorreste spoiler.
          </h3>
        </Block>
      </Section>
      {/* Specialties */}
      {!!specialties?.length && (
        <Section id={"specialties"}>
          <Block>
            <h2>Specialità</h2>

            <p className="text-2xl">I piatti core della tradizione.</p>

            <Grid records={specialties} onSelect={setActiveSpecialty} />
          </Block>
        </Section>
      )}
      {/* Breakfast */}
      {!!breakfast?.length && (
        <Section id={"breakfast"}>
          <Block>
            <h2>Appena svegli</h2>

            <p className="text-2xl">
              Il gnocco fritto si può mangiare a colazione, pucciato nel caffelatte
            </p>

            <Table
              label="Appena svegli"
              columns={columns(breakfast)}
              rows={rows(breakfast)}
            />
          </Block>
        </Section>
      )}
      {/* Lunch */}
      {!!lunch?.length && (
        <Section id={"lunch"}>
          <Block>
            <h2>Trattorie</h2>

            <p className="text-2xl">La regola generale? Se ha il menù fisso vai tranquill*</p>

            <Table label="Trattorie" columns={columns(lunch)} rows={rows(lunch)} />
          </Block>
        </Section>
      )}
      {/* Snack */}
      {!!stop?.length && (
        <Section id={"stop"}>
          <Block>
            <h2>Pranzo al volo</h2>

            <Table label="Pranzo al volo" columns={columns(stop)} rows={rows(stop)} />
          </Block>
        </Section>
      )}
      {/* Bere e aperitivo */}
      {!!drink?.length && (
        <Section id={"drink"}>
          <Block>
            <h2>Bere</h2>

            <Table label="Bere" columns={columns(drink, false)} rows={rows(drink, false)} />
          </Block>
        </Section>
      )}
      {/* Cena fuori modena */}
      {!!outside?.length && (
        <Section id={"outside"}>
          <Block>
            <h2>Cena al fresco</h2>

            <Table label="Cena al fresco" columns={columns(outside)} rows={rows(outside)} />
          </Block>
        </Section>
      )}
      {/* Places and activities */}
      {!!visit?.length && (
        <Section id={"visit"}>
          <Block>
            <h2>Una breve visita</h2>

            <p className="text-2xl">Cosa vedere se si è di passaggio...gratis</p>

            <Grid records={visit} />
          </Block>
        </Section>
      )}
      {/* Festival */}
      {!!festival?.length && (
        <Section id={"festival"}>
          <Block>
            <h2>Festival ed eventi</h2>

            <p className="text-2xl">
              Se siete in zona in questi giorni vale la pena farci un salto
            </p>

            <Grid records={festival} />
          </Block>
        </Section>
      )}

      <Navigation />

      <DishOverlay
        specialty={activeSpecialty}
        places={places}
        onClose={() => setActiveSpecialty(null)}
      />
    </main>
  );
}

export default App;

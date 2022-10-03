import { Fragment, useEffect } from "react";
import { Block } from "./components/block";
import { Section } from "./components/section";
import { Table } from "./components/table";
import styles from "./app.module.scss";
import useSWR from "swr";
import axios from "axios";

function App() {
  const { data: specialties, error } = useSWR("/api/user/123", (url: string) =>
    axios
      .get<any[]>(
        "https://raw.githubusercontent.com/01jam/a-tal-degh/main/api/specialties.json"
      )
      .then(({ data }) => data)
  );

  console.log(specialties);

  return (
    <main className="App">
      <Section bg="black">
        <Block>
          <h3>
            Use the ⚠️ button to report something suspect about a record – such
            as wrong opening hours, bad experience, expensive bill, wrong info –
            it will be revised and updated
          </h3>
        </Block>
      </Section>
      {!!specialties?.length && (
        <Section>
          <Block>
            <h2>Specialità</h2>
          </Block>
          <div className={styles.grid}>
            {specialties.map((specialty: any, index: number) => (
              <a
                key={index}
                href={specialty.link}
                target="_blank"
                className={styles.block}
              >
                <img src={specialty.img} />
              </a>
            ))}
          </div>
        </Section>
      )}
      <Section>
        <Block>
          <h2>Appena svegli</h2>
        </Block>
        <Table
          head={[
            <h4>
              <strong>
                <mark>Nome</mark>
              </strong>
            </h4>,
            <h4>
              <strong>
                <mark>Specialità</mark>
              </strong>
            </h4>,
            <h4>
              <strong>
                <mark>Note</mark>
              </strong>
            </h4>,
            null,
          ]}
          body={[
            [
              <Fragment>Caffè Del Collegio</Fragment>,
              <Fragment>Gnocco Fritto col Crudo</Fragment>,
              <Fragment>
                Il gnocco fritto al mattino è il classico dei classici
              </Fragment>,
              <Fragment>📍</Fragment>,
            ],
          ]}
        />
      </Section>
    </main>
  );
}

export default App;

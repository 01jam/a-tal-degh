import { Fragment, useEffect } from "react";
import { Block } from "./components/block";
import { Section } from "./components/section";
import { Table } from "./components/table";
import styles from "./app.module.scss";
import useSWR from "swr";
import axios from "axios";
import { typo } from "./styles";

function App() {
  const { data: specialties, error } = useSWR(
    "specialties",
    (resource: string) =>
      axios
        .get<any[]>(
          `https://raw.githubusercontent.com/01jam/a-tal-degh/main/api/${resource}.json`
        )
        .then(({ data }) => data)
  );

  return (
    <main className="App">
      {/* Disclaimer */}
      <Section bg="black">
        <Block>
          <h3>
            Use the ⚠️ button to report something suspect about a record – such
            as wrong opening hours, bad experience, expensive bill, wrong info –
            it will be revised and updated
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
          </Block>
        </Section>
      )}

      {/* Breakfast */}
      <Section id={"breakfast"}>
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

      <nav className={styles.nav}>
        <a href={"#specialties"} className={styles.link}>
          Specialties 👑
        </a>
        <a href={"#breakfast"} className={styles.link}>
          Appena svegli ☕️
        </a>
      </nav>
    </main>
  );
}

export default App;

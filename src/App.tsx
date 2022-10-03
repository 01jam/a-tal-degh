import { Fragment, useEffect } from "react";
import { Block } from "./components/block";
import { Section } from "./components/section";
import { Table } from "./components/table";
import styles from "./app.module.scss";
import useSWR from "swr";
import axios from "axios";
import { typo } from "./styles";
import { ConditionalIf } from "./components/conditionalIf";

function App() {
  const { data: specialties } = useSWR("specialties", (resource: string) =>
    axios
      .get<any[]>(
        `https://raw.githubusercontent.com/01jam/a-tal-degh/main/api/${resource}.json`
      )
      .then(({ data }) => data)
  );

  const { data: breakfast } = useSWR("breakfast", (resource: string) =>
    axios
      .get<any[]>(
        `https://raw.githubusercontent.com/01jam/a-tal-degh/main/api/${resource}.json`
      )
      .then(({ data }) => data)
  );

  const { data: lunch } = useSWR("lunch", (resource: string) =>
    axios
      .get<any[]>(
        `https://raw.githubusercontent.com/01jam/a-tal-degh/main/api/${resource}.json`
      )
      .then(({ data }) => data)
  );

  const { data: stop } = useSWR("stop", (resource: string) =>
    axios
      .get<any[]>(
        `https://raw.githubusercontent.com/01jam/a-tal-degh/main/api/${resource}.json`
      )
      .then(({ data }) => data)
  );

  const { data: drink } = useSWR("drink", (resource: string) =>
    axios
      .get<any[]>(
        `https://raw.githubusercontent.com/01jam/a-tal-degh/main/api/${resource}.json`
      )
      .then(({ data }) => data)
  );

  const { data: outside } = useSWR("outside", (resource: string) =>
    axios
      .get<any[]>(
        `https://raw.githubusercontent.com/01jam/a-tal-degh/main/api/${resource}.json`
      )
      .then(({ data }) => data)
  );

  const { data: visit } = useSWR("visit", (resource: string) =>
    axios
      .get<any[]>(
        `https://raw.githubusercontent.com/01jam/a-tal-degh/main/api/${resource}.json`
      )
      .then(({ data }) => data)
  );

  const { data: festival } = useSWR("festival", (resource: string) =>
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
            it will be revised and updated ASAP
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
                <ConditionalIf
                  key={index}
                  href={specialty.link}
                  target="_blank"
                  className={styles.block}
                >
                  <img
                    src={`${process.env.REACT_APP_GITHUB_RAWCONTENT}${specialty.img}`}
                  />
                </ConditionalIf>
              ))}
            </div>
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
            ]}
            body={
              breakfast?.map((record) => [
                <ConditionalIf href={record.link}>{record.name}</ConditionalIf>,
                <Fragment>{record.specialty}</Fragment>,
                <Fragment>{record.notes}</Fragment>,
              ]) || []
            }
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
            ]}
            body={
              lunch?.map((record) => [
                <ConditionalIf href={record.link}>{record.name}</ConditionalIf>,
                <Fragment>{record.specialty}</Fragment>,
                <Fragment>{record.notes}</Fragment>,
              ]) || []
            }
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
            ]}
            body={
              stop?.map((record) => [
                <ConditionalIf href={record.link}>{record.name}</ConditionalIf>,
                <Fragment>{record.specialty}</Fragment>,
                <Fragment>{record.notes}</Fragment>,
              ]) || []
            }
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
            head={[
              <h4>
                <strong>
                  <mark>Nome</mark>
                </strong>
              </h4>,
              <h4>
                <strong>
                  <mark>Note</mark>
                </strong>
              </h4>,
            ]}
            body={
              drink?.map((record) => [
                <ConditionalIf href={record.link}>{record.name}</ConditionalIf>,
                <Fragment>{record.notes}</Fragment>,
              ]) || []
            }
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
            ]}
            body={
              outside?.map((record) => [
                <ConditionalIf href={record.link}>{record.name}</ConditionalIf>,
                <Fragment>{record.specialty}</Fragment>,
                <Fragment>{record.notes}</Fragment>,
              ]) || []
            }
          />
        </Section>
      )}

      {/* Places and activities */}
      {!!visit?.length && (
        <Section id={"visit"}>
          <Block>
            <h2>Una breve visita</h2>

            <p className={typo.medium}>Cosa vedere se si è di passaggio</p>

            <div className={styles.grid}>
              {visit.map((specialty: any, index: number) => (
                <ConditionalIf
                  key={index}
                  href={specialty.link}
                  target="_blank"
                  className={styles.block}
                >
                  <img
                    src={`${process.env.REACT_APP_GITHUB_RAWCONTENT}${specialty.img}`}
                  />
                </ConditionalIf>
              ))}
            </div>
          </Block>
        </Section>
      )}

      {/* Festival */}
      {!!festival?.length && (
        <Section id={"festival"}>
          <Block>
            <h2>Ou, vieni dai</h2>

            <p className={typo.medium}>
              Non è Milano, ma un paio di festival ci sono
            </p>

            <div className={styles.grid}>
              {festival.map((specialty: any, index: number) => (
                <ConditionalIf
                  key={index}
                  href={specialty.link}
                  target="_blank"
                  className={styles.block}
                >
                  <img
                    src={`${process.env.REACT_APP_GITHUB_RAWCONTENT}${specialty.img}`}
                  />
                </ConditionalIf>
              ))}
            </div>
          </Block>
        </Section>
      )}

      <nav className={styles.nav}>
        <div className={styles.row}>
          <a href={"#specialties"} className={styles.link}>
            Specialties 👑
          </a>
          <a href={"#breakfast"} className={styles.link}>
            Appena svegli ☕️
          </a>
          <a href={"#lunch"} className={styles.link}>
            Trattorie 🍖
          </a>
          <a href={"#stop"} className={styles.link}>
            Pranzo al volo 🏎
          </a>
          <a href={"#drink"} className={styles.link}>
            Bere e aperitivi 🍹
          </a>
          <a href={"#outside"} className={styles.link}>
            Cena fuori città 🎒
          </a>
        </div>
        <div className={styles.row}>
          <a href={"#visit"} className={styles.link}>
            Cosa vedere 👀
          </a>
          <a href={"#festival"} className={styles.link}>
            Festival 🎤
          </a>
        </div>
      </nav>
    </main>
  );
}

export default App;

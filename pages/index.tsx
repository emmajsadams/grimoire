import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { NotesList } from "../lib/models/notes/NotesList";
import { UserStatus } from "../lib/models/users/UserStatus";
import { v4 as uuidv4 } from "uuid";

// TODO: Change the name of clientID to requestID
const Home: NextPage<any, any> = (props: { clientID: string }) => {
  const { clientID } = props;
  return (
    <div className={styles.container}>
      <Head>
        <title>Grimoire</title>
        <meta name="description" content="Grimoire Automata Notes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Grimoire</h1>
        <p className={styles.description}>
          <UserStatus />
        </p>
        <NotesList clientID={clientID} />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;

export async function getServerSideProps() {
  return {
    props: {
      clientID: uuidv4(),
    },
  };
}

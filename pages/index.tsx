import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { NotesList } from "../lib/models/notes/NotesList";
import { UserStatus } from "../lib/models/users/UserStatus";
import { v4 as uuidv4 } from "uuid";

interface IndexProps {
  clientId: string; // TODO: Move clientID to app
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// TODO: Change the name of clientID to requestID
const Home: NextPage<any, any> = ({
  clientId,
  searchQuery,
  setSearchQuery,
}: IndexProps) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Grimoire Automata</title>
        <meta name="description" content="Grimoire Automata" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p className={styles.description}>
          <UserStatus />
        </p>
        <NotesList
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clientId={clientId}
        />
      </main>
    </div>
  );
};

export default Home;

export async function getServerSideProps() {
  return {
    props: {
      clientId: uuidv4(),
    },
  };
}

import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { NotesList } from "../lib/models/notes/NotesList";
import { UserStatus } from "../lib/models/users/UserStatus";
import { AppProps } from "./_app";

interface IndexProps extends AppProps {}

// TODO: Move this to notes/list? and maybe just redirect to notes list by default?
const Home: NextPage<any, any> = ({
  clientId,
  searchQuery,
  setSearchQuery,
}: IndexProps) => {
  return (
    <>
      <Head>
        <title>Notes</title>
        <meta name="description" content="Grimoire Automata" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <p className={styles.description}>
          <UserStatus />
        </p>
        <NotesList
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clientId={clientId}
        />
      </main>
    </>
  );
};

export default Home;

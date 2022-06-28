import "../styles/globals.css";
import Head from "next/head";
import { initThinBackend } from "thin-backend";
import { ThinBackend } from "thin-backend-react";
import { Container } from "@mui/material";
import { PrimaryAppBar } from "../lib/utils/navigation/AppBar";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

initThinBackend({ host: process.env.NEXT_PUBLIC_BACKEND_URL });

export interface AppProps {
  clientId: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function MyApp({ Component, pageProps }: AppProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [clientId, _] = useState(uuidv4());
  const customProps: AppProps = {
    clientId,
    searchQuery,
    setSearchQuery,
  };

  return (
    <ThinBackend requireLogin>
      <Head>
        <meta name="description" content="Grimoire Automata" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PrimaryAppBar {...customProps} />
      <Container maxWidth="sm">
        <Component {...customProps} {...pageProps} />
      </Container>
    </ThinBackend>
  );
}
export default MyApp;

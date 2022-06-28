import "../styles/globals.css";
import type { AppProps } from "next/app";
import { initThinBackend } from "thin-backend";
import { ThinBackend } from "thin-backend-react";
import { Container } from "@mui/material";
import { PrimaryAppBar } from "../lib/utils/navigation/AppBar";
import React, { useState } from "react";

initThinBackend({ host: process.env.NEXT_PUBLIC_BACKEND_URL });

function MyApp({ Component, pageProps }: AppProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ThinBackend requireLogin>
      <PrimaryAppBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Container maxWidth="sm">
        <Component
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          {...pageProps}
        />
      </Container>
    </ThinBackend>
  );
}
export default MyApp;

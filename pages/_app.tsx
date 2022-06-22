import "../styles/globals.css";
import type { AppProps } from "next/app";
import { initThinBackend } from "thin-backend";
import { ThinBackend } from "thin-backend-react";
import { Container } from "@mui/material";
import { PrimaryAppBar } from "../lib/utils/navigation/AppBar";

initThinBackend({ host: process.env.NEXT_PUBLIC_BACKEND_URL });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThinBackend requireLogin>
      <PrimaryAppBar />
      <Container maxWidth="sm">
        <Component {...pageProps} />
      </Container>
    </ThinBackend>
  );
}
export default MyApp;

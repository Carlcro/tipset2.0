import "../styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import Layout from "../components/Layout";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { getUser } from "../services/userService";
import { ReactQueryDevtools } from "react-query/devtools";
import Navbar from "../components/Navbar";
import { Suspense, useState } from "react";
import { SessionProvider } from "next-auth/react";
import Spinner from "../components/Spinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <RecoilRoot>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Suspense
              fallback={
                <div className="h-screen grid place-items-center">
                  <Spinner width={60} height={60} />
                </div>
              }
            >
              <ToastContainer />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </Suspense>
          </Hydrate>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </RecoilRoot>
  );
}

export default MyApp;

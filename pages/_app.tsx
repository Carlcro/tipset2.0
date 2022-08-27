import "../styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import { getUser } from "../services/userService";
import { ReactQueryDevtools } from "react-query/devtools";
import Navbar from "../components/Navbar";
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery("user", async () => {
    const data = await getUser();
    return data;
  });

  return (
    <RecoilRoot>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="bg-gradient-to-br from-teal-300 bg-emerald-300 min-h-screen h-full">
              <Navbar />
              <Component {...pageProps} />
            </div>
          </Suspense>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </RecoilRoot>
  );
}

export default MyApp;

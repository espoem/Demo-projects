import Nav from "@components/Nav";
import Provider from "@components/Provider";
import "@styles/globals.css";
import { Metadata } from "next";
import { Session } from "next-auth";

export const metadata: Metadata = {
  title: "Promptopia MS",
  description: "Discover & Share AI Prompts",
};

interface RootLayoutProps {
  children: React.ReactElement;
  session: Session;
}

const RootLayout = ({ children, session }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        <Provider session={session}>
          <div className="main">
            <div className="gradient"></div>
          </div>

          <main className="app">
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;

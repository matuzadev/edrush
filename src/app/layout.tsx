import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { BugReportButton } from "@/components/BugReportButton";
import FriendsChatLoader from "@/components/FriendsChatLoader";
import { StudentPresenceTracker } from "@/components/StudentPresenceTracker";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "EdRush | Preparação gratuita para concursos",
  description: "Estude para concursos com questões, simulados e acompanhamento do desempenho. Todos os recursos de estudo são gratuitos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('foco_theme');if(t==='light'){document.documentElement.classList.add('light');}else{document.documentElement.classList.add('dark');}}catch(e){}})();`}
        </Script>
        <link rel="icon" type="image/png" href="/imagens/favicon.png" />
        <link rel="apple-touch-icon" href="/imagens/favicon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <StudentPresenceTracker />
            {children}
          </AuthProvider>
        </ThemeProvider>
        <FriendsChatLoader />
        <BugReportButton />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { BugReportButton } from "@/components/BugReportButton";
import { FriendsChat } from "@/components/FriendsChat";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Foco Federal | Perito PF Informática & ESFCEx",
  description: "A única planilha com foco em 4000 questões, Active Recall e métricas reais para Perito Criminal Federal e ESFCEx.",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/png" href="/imagens/favicon.png" />
        <link rel="apple-touch-icon" href="/imagens/favicon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <FriendsChat />
        <BugReportButton />
      </body>
    </html>
  );
}
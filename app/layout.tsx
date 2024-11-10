import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ClientLayout from "@/components/layout/client-layout";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Lumina - Your Intelligent Streaming Companion',
  description: 'Track, discover, and enhance your streaming experience with AI-powered insights',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientLayout>
            {children}
          </ClientLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
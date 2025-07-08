'use client';

import './globals.css';
import Footer from '@/components/footer';
import Header from '@/components/header';
import ClientProviders from './ClientProviders';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Check if the current route is under /admin
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="en" className="font-sans">
      <body className="flex flex-col min-h-screen w-full">
        <ClientProviders>
          {!isAdminRoute && <Header />}
          <main className="flex-grow w-full">{children}</main>
          {!isAdminRoute && <Footer />}
          <Toaster position="top-right" reverseOrder={false} />
        </ClientProviders>
      </body>
    </html>
  );
}

'use client';

import './globals.css';
import Footer from '@/components/footer';
import Header from '@/components/header';
import ClientProviders from './ClientProviders';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/login'; 

  const shouldHideHeaderFooter = isAdminRoute || isLoginRoute;

  return (
    <html lang="en" className="font-sans">
      <body className="flex flex-col min-h-screen w-full">
        <ClientProviders>
          {!shouldHideHeaderFooter && <Header />}
          <main className="flex-grow w-full">{children}</main>
          {!shouldHideHeaderFooter && <Footer />}
          <Toaster position="top-right" reverseOrder={false} />
        </ClientProviders>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EMDR Platform',
  description: 'AI-powered autonomous EMDR therapy platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0d1117] text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}

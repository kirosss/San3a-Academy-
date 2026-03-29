import type {Metadata} from 'next';
import './globals.css';
import { AuthProvider } from '@/AuthContext';

export const metadata: Metadata = {
  title: 'San3a Academy',
  description: 'A digital platform for digital fabrication and STEM learning.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

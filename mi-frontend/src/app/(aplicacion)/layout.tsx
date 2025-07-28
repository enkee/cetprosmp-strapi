import { Inter } from 'next/font/google';
import '@/app/globals.css';
import Header from '@/components/Header/Header';
import ClientProviders from '@/components/ClientProviders';
import { Box } from '@mui/material';
import metadata from './metadata'; // importamos directamente el objeto completo

const inter = Inter({ subsets: ['latin'] });

// Exportamos directamente el metadata definido en metadata.ts
export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientProviders>
          <Box className="layout" sx={{ maxWidth: '1000px', mx: 'auto' }}>
            <Box component="header">
              <Header />
            </Box>
            <Box
              component="main"
              sx={{ mt: { xs: '48px', md: '64px' } }}
            >
              {children}
            </Box>
          </Box>
        </ClientProviders>
      </body>
    </html>
  );
}

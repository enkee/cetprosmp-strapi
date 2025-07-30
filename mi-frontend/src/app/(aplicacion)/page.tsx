// src/app/page.tsx
import { Box, Typography } from '@mui/material';
import CarruselPortada from '@/components/Carrusel/CarruselPortada';
import BotonInscripcion from '@/components/Generales/BotonInscripcion';
import Footer from '@/components/Footer/Footer'; // ✅ IMPORTACIÓN AGREGADA
import metadata from './metadata';

export { metadata };

export default function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'CETPRO San Martín de Porres',
    alternateName: 'CETPRO SMP',
    description:
      'Centro de Educación Técnico Productiva que forma técnicos emprendedores en computación, electricidad, confección, manualidades y más.',
    url: 'https://www.tusitioweb.edu.pe',
    logo: 'https://www.tusitioweb.edu.pe/logo.png',
    sameAs: ['https://www.facebook.com/cetprosmp'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Ejemplo 123',
      addressLocality: 'Los Olivos',
      addressRegion: 'Lima',
      postalCode: '15301',
      addressCountry: 'PE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+51 1 2345678',
      contactType: 'administración',
      areaServed: 'PE',
      availableLanguage: ['Spanish'],
    },
  };

  return (
    <>
      <Box component="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Sección de bienvenida */}
        <Box
          component="section"
          sx={{ padding: 4, display: { xs: 'none', md: 'block' }, textAlign: 'center' }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Bienvenidos al CETPRO de "San Martín de Porres"
          </Typography>
          <Typography component="h2" variant="h6">
            Formando Técnicos Emprendedores
            <BotonInscripcion sx={{ ml: 4 }} />
          </Typography>
        </Box>

        {/* Carrusel de especialidades */}
        <Box component="section">
          <CarruselPortada />
        </Box>

        {/* Texto de prueba SEO */}
        <Box component="section" sx={{ p: 2 }}>
          {[...Array(15)].map((_, i) => (
            <Typography key={i} component="p" paragraph>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo adipisci qui, fugit
              labore nulla, distinctio quo reprehenderit veniam maxime laborum ipsum eaque ad
              voluptatibus! Facilis deleniti accusantium neque sequi assumenda tenetur?
            </Typography>
          ))}
        </Box>


      </Box>
    </>
  );
}

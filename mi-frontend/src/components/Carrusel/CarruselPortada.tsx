'use client';

import { Box, useMediaQuery } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useTheme } from '@mui/material/styles';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import CarruselSlide from './CarruselSlide';
import CarruselBienvenidaSlide from './CarruselBienvenidaSlide';

export type Modulo = {
  id: number;
  tituloComercial: string;
};

export type Carrera = {
  id: number;
  tituloComercial: string;
  codigo?: string;
  duracion?: number;
  modulos: Modulo[];
};

export type Especialidad = {
  id: number;
  tituloComercial: string;
  fondo: string | null;
  portada: string | null;
  carreras: Carrera[];
};

export default function CarruselPortada() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [data, setData] = useState<Especialidad[]>([]);
  const swiperRef = useRef<any>(null);

  const prevRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/data/carrusel.json')
      .then(res => res.json())
      .then(json => {
        if (isMobile) {
          const bienvenida: Especialidad = {
            id: -1,
            tituloComercial: 'Bienvenida',
            fondo: null,
            portada: null,
            carreras: [],
          };
          setData([bienvenida, ...json]);
        } else {
          setData(json);
        }
      })
      .catch(err => console.error('Error cargando carrusel:', err));
  }, [isMobile]);

  // ⏱️ Retraso del autoplay de 1 minuto en móviles
  useEffect(() => {
    if (isMobile && swiperRef.current) {
      const timeout = setTimeout(() => {
        if (swiperRef.current) {
          swiperRef.current.params.autoplay.delay = 5000; // delay de 5 segundos por slide
          swiperRef.current.autoplay.start(); // Inicia autoplay manualmente
        }
      }, 7000); // 1 minuto
      return () => clearTimeout(timeout);
    }
  }, [isMobile, data]);

  // 🛑 Detener autoplay si el usuario interactúa
  const handleClickOrTap = () => {
    swiperRef.current?.autoplay?.stop?.();
  };

  if (data.length === 0) return null;

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Botones de navegación */}
      <Box ref={prevRef} sx={botonNavegacion('left')}>&lt;</Box>
      <Box ref={nextRef} sx={botonNavegacion('right')}>&gt;</Box>

      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;

          // 🟢 Si no es móvil, iniciamos autoplay inmediatamente
          if (!isMobile) {
            if (swiper.params.autoplay && typeof swiper.params.autoplay === 'object') {
              swiper.params.autoplay.delay = 5000;
            }
            swiper.autoplay?.start?.();
          }
        }}
        onClick={handleClickOrTap}
        onTouchStart={handleClickOrTap}
        autoplay={false} // ⛔ Autoplay apagado al cargar
        loop
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination-custom',
          renderBullet: (index, className) =>
            `<span class="${className}" style="
              width: 28px;
              height: 28px;
              background: rgba(255,255,255,0.4);
              color: black;
              font-size: 13px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            ">${index + 1}</span>`,
        }}
      >
        {data.map((esp) => (
          <SwiperSlide key={esp.id}>
            {esp.id === -1 ? (
              <CarruselBienvenidaSlide />
            ) : (
              <CarruselSlide especialidad={esp} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Paginación personalizada */}
      <Box
        className="swiper-pagination-custom"
        sx={{
          position: 'absolute',
          mb: '40px',
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
          '& span': {
            pointerEvents: 'auto',
          },
        }}
      />
    </Box>
  );
}

const botonNavegacion = (posicion: 'left' | 'right') => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  [posicion]: 8,
  zIndex: 10,
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.3)',
  color: 'rgba(103, 103, 103, 0.7)',
  textShadow: '0 0 4px white',
  fontSize: '24px',
  display: {
    xs: 'none',
    sm: 'none',
    md: 'flex',
  },
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});

// HomePage.tsx actualizado y corregido
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@strapi/design-system';

// Interface TypeScript para definir la estructura de un semestre
interface Semestre {
  id: number;
  titulo: string;
  archivado: boolean;
}

const HomePage = () => {
  const [semestres, setSemestres] = useState<Semestre[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // useEffect para obtener los semestres al montar el componente
  useEffect(() => {
    const fetchSemestres = async () => {
      try {
        const res = await fetch('/api/semestres');
        const raw = await res.json();

        // Formateamos y ordenamos los semestres por ID ascendente
        const data = Array.isArray(raw?.data)
          ? (raw.data.map((item: any) => ({
              id: item.id,
              titulo: item.titulo ?? 'Sin título',
              archivado: item.archivado ?? false,
            })) as Semestre[]).sort((a, b) => a.id - b.id)
          : [];

        setSemestres(data);
      } catch (err) {
        console.error('Error al cargar semestres:', err);
        setMensaje('Error al cargar semestres');
      }
    };

    fetchSemestres();
  }, []);

  // Alternar estado archivado desde el plugin
  const toggleArchivado = async (semestreId: number) => {
    try {
      setLoading(true);
      setMensaje('');

      const res = await fetch(`/api/archivador/${semestreId}`, {
        method: 'PUT',
      });

      if (!res.ok) throw new Error('Error al archivar/desarchivar');

      const { mensaje: msg } = await res.json();
      setMensaje(msg);

      //Refresca la pagina
      window.location.reload();
      // Actualizar localmente el estado archivado
      const updated = semestres.map((s) =>
        s.id === semestreId ? { ...s, archivado: !s.archivado } : s
      );
      setSemestres(updated);
    } catch (err) {
      setMensaje('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding={8}>
      <Typography variant="alpha" as="h1">
        PANEL DE CONTROL GENERAL
      </Typography>
      <Typography variant="beta" as="h2" marginTop={4}>
        Archivar Semestres Pasados
      </Typography>

      {/* Mensaje de éxito o error */}
      {mensaje && (
        <Typography variant="omega" as="p" marginTop={4} color="success600">
          {mensaje}
        </Typography>
      )}

      {/* Tabla de semestres */}
      <Table colCount={3} rowCount={semestres.length} marginTop={6}>
        <Thead>
          <Tr>
            <Th><Typography variant="sigma">Título</Typography></Th>
            <Th><Typography variant="sigma">Estado</Typography></Th>
            <Th><Typography variant="sigma">Acción</Typography></Th>
          </Tr>
        </Thead>
        <Tbody>
          {semestres.map((semestre) => (
            <Tr key={semestre.id}>
              <Td>
                <Typography textColor="neutral800">{semestre.titulo}</Typography>
              </Td>
              <Td>
                <Typography textColor={semestre.archivado ? 'danger600' : 'success600'}>
                  {semestre.archivado ? 'Archivado' : 'Activo'}
                </Typography>
              </Td>
              <Td>
                <Button
                  variant="default"
                  disabled={loading}
                  onClick={() => toggleArchivado(semestre.id)}
                >
                  {semestre.archivado ? 'Desarchivar' : 'Archivar'}
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default HomePage;

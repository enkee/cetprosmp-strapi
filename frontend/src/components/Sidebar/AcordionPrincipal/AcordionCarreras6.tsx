import React, { useEffect, useState } from "react";
import FullCustomAccordion, {
  CustomList,
  CustomListItem,
  CustomTypography,
} from "../FullCustomAccordion/FullCustomAccordion2";

type Modulo = { id: number; tituloComercial: string };
type Carrera = {
  id: number;
  tituloComercial: string;
  codigo: string | null;
  duracion: number;
  modulos: Modulo[];
};
type Especialidad = {
  id: number;
  tituloComercial: string;
  carreras: Carrera[];
};

interface Props {
  openAccordions: string[];
  handleAccordionChange: (id: string, ancestors: string[]) => void;
}

export default function AcordionCarreras({
  openAccordions,
  handleAccordionChange,
}: Props) {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const rootId = "principal-carreras";

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/data/carreras.json");
      const data: Especialidad[] = await res.json();
      const sortedData = data
        .sort((a, b) => a.id - b.id)
        .map((esp) => ({
          ...esp,
          carreras: esp.carreras
            .sort((a, b) => a.id - b.id)
            .map((car) => ({
              ...car,
              modulos: car.modulos.sort((a, b) => a.id - b.id),
            })),
        }));
      setEspecialidades(sortedData);
    };

    fetchData();
  }, []);

  return (
    <FullCustomAccordion
      id={rootId}
      title="Carreras"
      expanded={openAccordions.includes(rootId)}
      onChange={() => handleAccordionChange(rootId, ["principal"])}
      ancestors={["principal"]}
    >
      {especialidades.map((esp) => {
        const espId = `${rootId}-esp-${esp.id}`;
        return (
          <FullCustomAccordion
            key={espId}
            id={espId}
            title={esp.tituloComercial}
            expanded={openAccordions.includes(espId)}
            onChange={() => handleAccordionChange(espId, [rootId, "principal"])}
            ancestors={[rootId, "principal"]}
          >
            {esp.carreras
              .filter((car) => car.codigo !== null)
              .map((car) => {
                const carId = `${espId}-car-${car.id}`;
                return (
                  <FullCustomAccordion
                    key={carId}
                    id={carId}
                    title={car.tituloComercial}
                    expanded={openAccordions.includes(carId)}
                    onChange={() =>
                      handleAccordionChange(carId, [espId, rootId, "principal"])
                    }
                    ancestors={[espId, rootId, "principal"]}
                  >
                    <CustomList>
                      {car.modulos.map((mod) => (
                        <CustomListItem key={mod.id}>
                          <CustomTypography>
                            {mod.tituloComercial}
                          </CustomTypography>
                        </CustomListItem>
                      ))}
                    </CustomList>
                  </FullCustomAccordion>
                );
              })}

            {esp.carreras
              .filter((car) => car.codigo === null)
              .flatMap((car) => car.modulos)
              .map((mod) => (
                <CustomListItem key={mod.id}>
                  <CustomTypography>{mod.tituloComercial}</CustomTypography>
                </CustomListItem>
              ))}
          </FullCustomAccordion>
        );
      })}
    </FullCustomAccordion>
  );
}

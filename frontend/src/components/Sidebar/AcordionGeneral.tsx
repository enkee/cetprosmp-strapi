import React, { useState } from "react";
import AcordionPrincipal from "./AcordionPrincipal/AcordionPrincipal";
import AcordionIntranet from "./AcordionIntranet/AcordionIntranet";

export default function AcordionGeneral() {
  // Estado global de acordiones abiertos
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  /**
   * Maneja la expansión de un acordeón con exclusividad global.
   * - Si ya está abierto, lo cierra (pero deja abiertos sus ancestros).
   * - Si está cerrado, cierra todo lo demás excepto él mismo y sus ancestros.
   */
  const handleAccordionChange = (id: string, ancestors: string[]) => {
    setOpenAccordions((prev) => {
      const isOpen = prev.includes(id);

      if (isOpen) {
        // Cerrar solo este acordeón, conservar los padres
        return prev.filter((item) => item !== id);
      } else {
        // Cerrar todo lo demás, y abrir ancestros + el acordeón actual
        return [...ancestors, id];
      }
    });
  };

  return (
    <>
      <AcordionPrincipal
        openAccordions={openAccordions}
        handleAccordionChange={handleAccordionChange}
      />
      <AcordionIntranet
        openAccordions={openAccordions}
        handleAccordionChange={handleAccordionChange}
      />
    </>
  );
}

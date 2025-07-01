// src/components/FullCustomAccordion.tsx
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";

// 🎨 Estilos personalizados
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  p: 0,
  m: 0,
  backgroundColor: "#f0f8ff",
  color: "#000",
  borderRadius: 8,
  marginBottom: theme.spacing(0),
  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  "&:before": { display: "none" },
  "&.Mui-expanded": { margin: 0 },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: "#dbeafe",
  padding: theme.spacing(1),
  minHeight: "40px",
  "& .MuiAccordionSummary-content": { margin: 0 },
  "& .MuiAccordionSummary-content.Mui-expanded": { margin: 0 },
  "&.Mui-expanded": { minHeight: "auto" },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  backgroundColor: "#ffffff",
  padding: theme.spacing(0, 0, 0, 1),
  borderTop: "1px solid #ccc",
}));

const StyledList = styled(List)(({ theme }) => ({
  backgroundColor: "#f9f9f9",
  padding: 0,
  margin: 0,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(0.5),
  paddingLeft: theme.spacing(0.5),
  backgroundColor: "#ffffff",
  position: "relative",
  minHeight: "40px",
  "&::before": {
    alignSelf: "flex-start",
    content: '"•"',
    fontSize: "1.2rem",
    lineHeight: 1,
    color: "#888",
    flexShrink: 0,
    marginTop: "4px",
  },
  "&:hover": {
    backgroundColor: "#f1f1f1",
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem",
  color: "#333",
}));

// Props del componente
interface Props {
  id: string;
  ancestors: string[];
  expanded: boolean;
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void; // ✅ corregido
  title: string;
  children: React.ReactNode;
}

// Componente completo reutilizable
export default function FullCustomAccordion({
  id,
  ancestors,
  expanded,
  onChange,
  title,
  children,
}: Props) {
  return (
    <StyledAccordion expanded={expanded} onChange={onChange}>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <StyledTypography fontWeight="bold">{title}</StyledTypography>
      </StyledAccordionSummary>
      <StyledAccordionDetails>{children}</StyledAccordionDetails>
    </StyledAccordion>
  );
}

// Exportar estilos internos para uso opcional
export {
  StyledList as CustomList,
  StyledListItem as CustomListItem,
  StyledTypography as CustomTypography,
};

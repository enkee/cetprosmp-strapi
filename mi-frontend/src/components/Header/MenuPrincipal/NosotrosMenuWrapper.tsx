'use client';
// src/components/Header/MenuPrincipal/NosotrosMenuWrapper.tsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Popper } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Link from "next/link";
import { cerrarTodosLosMenus } from "./_otros/CerrarTodoMenus";

import {
  MenuContainer,
  MenuItemBox,
  MenuText,
} from "@/components/Header/MenuPrincipal/FullCustomMenu/FullCustomMenu";

type SubItem = {
  id: number;
  titulo: string;
  slug: string;
};

type Item = {
  id: number;
  titulo: string;
  slug: string;
  contenido?: SubItem[];
};

export default function NosotrosMenuWrapper() {
  const anchoMenu = "156px";
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [subItems, setSubItems] = useState<SubItem[] | null>(null);
  const [anchorSub, setAnchorSub] = useState<HTMLElement | null>(null);

  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/data/nosotros.json");
        const data: Item[] = await res.json();

        const sorted = [
          ...data
            .filter((i) => i.contenido && i.contenido.length > 0)
            .sort((a, b) => a.id - b.id),
          ...data
            .filter((i) => !i.contenido || i.contenido.length === 0)
            .sort((a, b) => a.id - b.id),
        ];

        setItems(sorted);
      } catch (err) {
        setItems([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleCloseAllMenus = () => {
      setOpen(false);
      setSubItems(null);
      setAnchorSub(null);
    };

    window.addEventListener("cerrar-todos-los-menus", handleCloseAllMenus);
    return () => {
      window.removeEventListener("cerrar-todos-los-menus", handleCloseAllMenus);
    };
  }, []);

  const startCloseTimer = () => {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setSubItems(null);
      setAnchorSub(null);
    }, 150);
  };

  const cancelCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleItemEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    contenido?: SubItem[]
  ) => {
    if (contenido && contenido.length > 0) {
      const sortedSub = [...contenido].sort((a, b) => a.id - b.id);
      setSubItems(sortedSub);
      setAnchorSub(e.currentTarget);
    } else {
      setSubItems(null);
      setAnchorSub(null);
    }
  };

  return (
    <Box
      ref={wrapperRef}
      onMouseEnter={() => {
        cancelCloseTimer();
        setOpen(true);
      }}
      onMouseLeave={startCloseTimer}
    >
      <Button color="inherit" ref={anchorRef}>
        Nosotros
      </Button>

      {items.length > 0 && (
        <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start" sx={{ zIndex: 1300 }}>
          <MenuContainer ancho={anchoMenu} sx={{ ml: -5 }}>
            {items.map((item) =>
              item.contenido && item.contenido.length > 0 ? (
                <MenuItemBox
                  key={item.id}
                  onMouseEnter={(e) => handleItemEnter(e, item.contenido)}
                  iconRight={
                    <ArrowRightIcon
                      fontSize="small"
                      sx={{ mt: 0.5, alignSelf: "flex-start" }}
                    />
                  }
                >
                  <MenuText>{item.titulo}</MenuText>
                </MenuItemBox>
              ) : (
                <Link
                  key={item.id}
                  href={`/nosotros/${item.slug}`}
                  onClick={cerrarTodosLosMenus}
                  style={{ textDecoration: "none" }}
                >
                  <MenuItemBox>
                    <MenuText>{item.titulo}</MenuText>
                  </MenuItemBox>
                </Link>
              )
            )}
          </MenuContainer>
        </Popper>
      )}

      <Popper open={Boolean(subItems)} anchorEl={anchorSub} placement="right-start" sx={{ zIndex: 1300 }}>
        <MenuContainer ancho={anchoMenu} sx={{ mt: 0 }}>
          {subItems?.map((sub) => (
            <Link
              key={sub.id}
              href={`/nosotros/${sub.slug}`}
              onClick={cerrarTodosLosMenus}
              style={{ textDecoration: "none" }}
            >
              <MenuItemBox>
                <MenuText>{sub.titulo}</MenuText>
              </MenuItemBox>
            </Link>
          ))}
        </MenuContainer>
      </Popper>
    </Box>
  );
}

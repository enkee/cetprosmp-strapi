// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 450,
            md: 750,
            lg: 1050,
            xl: 1350,
        },
    },
});

export default theme;
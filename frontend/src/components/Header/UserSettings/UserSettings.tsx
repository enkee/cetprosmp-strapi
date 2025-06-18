import { Box } from '@mui/material';
import Settings from './Settings';
import Apps from './Apps';
import User from './User';

export default function UserSettings() {
  return (
    <Box sx={{ width: '190px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
      <Settings />
      <Apps />
      <User />
    </Box>
  );
}

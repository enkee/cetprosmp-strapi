import {
  Divider,
  SwipeableDrawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Drawer,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

type Props = {
  mobileOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

const drawerWidth = 240;

export default function SideMenu({ mobileOpen, onClose, onOpen }: Props) {
  const drawerContent = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItemButton>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Noticias" />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <>
      {/* Drawer móvil con swipe solo para cerrar */}
      <SwipeableDrawer 
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        onOpen={onOpen}
        swipeAreaWidth={0}
        disableSwipeToOpen
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawerContent}
      </SwipeableDrawer>

      {/* Drawer fijo en escritorio */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor:"yellow",
            position:"static",
            flex: '0 0 300px',
            zIndex:'-100'
           }
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

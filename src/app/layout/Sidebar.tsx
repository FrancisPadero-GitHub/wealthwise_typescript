import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Link, useLocation } from "react-router-dom";
import React from "react";

// Drawer widths
const drawerWidth = 250;
const minimizedDrawerWidth = 65;

// Menu items type
interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Transactions", icon: <ReceiptIcon />, path: "/transactions" },
];

// Props type for Sidebar
interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const location = useLocation();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={true} // <-- Should this be `open={open}`?
      ModalProps={{
        keepMounted: true,
        disableAutoFocus: true,
        disableEnforceFocus: true,
      }}
      sx={{
        width: open ? drawerWidth : minimizedDrawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : minimizedDrawerWidth,
          boxSizing: "border-box",
          transition: "width 0.2s ease-in-out",
          overflowX: "hidden",
          position: "fixed",
          height: "100%",
          zIndex: (theme) => theme.zIndex.drawer,
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflowX: "hidden" }}>
        <List>
          {menuItems.map(({ text, icon, path }) => (
            <Tooltip title={!open ? text : ""} placement="right" key={text}>
              <ListItemButton
                component={Link}
                to={path}
                selected={location.pathname === path}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {icon}
                </ListItemIcon>
                {open && <ListItemText primary={text} />}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

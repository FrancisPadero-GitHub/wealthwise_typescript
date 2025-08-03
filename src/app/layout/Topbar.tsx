import { useState, type MouseEvent } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  CircularProgress,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import wealthwise from "../../assets/img/wealthwise.png";
import { supabase } from "../../backend/supabase";

// import Profile from "../components/modals/ProfileModal";
// import { useProfile } from "../../hooks/useProfile";

// Props type for Topbar
interface TopbarProps {
  onDrawerToggle: () => void;
}

export default function Topbar({ onDrawerToggle }: TopbarProps) {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Assuming useProfile returns a shape { data: Profile | null, isLoading: boolean }
  // const { data: profile, isLoading } = useProfile();

  const handleMenuClick = (event: MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget as unknown as HTMLElement);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#FAF9F6",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={wealthwise}
              alt="WealthWise"
              style={{
                width: "40px",
                height: "40px",
                marginRight: "10px",
                marginBottom: "10px",
              }}
            />
            <Typography
              variant="h1"
              component="div"
              noWrap
              sx={{ mr: 5, fontSize: "1.5rem", fontWeight: "bold" }}
              color="primary"
            >
              WealthWise
            </Typography>

            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={onDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                color: "#000000",
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#1976d2",
                }}
              >
                {/* {profile?.full_name?.[0] || "U"} */}
              </Avatar>
              <Typography variant="body1">
                {/* {isLoading ? "Loading..." : profile?.full_name || "User"} */}
              </Typography>

              <ArrowDropDownIcon
                color="primary"
                sx={{ cursor: "pointer" }}
                onClick={handleMenuClick}
              />
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  backgroundColor: "#ffffff",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  setIsSettingsOpen(true);
                }}
              >
                <SettingsOutlinedIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="body2" color="primary">
                  Settings
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleSignOut} disabled={isLoggingOut}>
                {isLoggingOut ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={18} />
                    Logging out...
                  </Box>
                ) : (
                  <>
                    <LogoutOutlinedIcon sx={{ mr: 1 }} color="warning" />
                    <Typography variant="body2" color="warning">
                      Logout
                    </Typography>
                  </>
                )}
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* <Profile open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} /> */}
    </>
  );
}

import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
// import SmartToyIcon from "@mui/icons-material/SmartToy";

import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { IconMenuItem } from "mui-nested-menu";

import { useAuth0 } from "@auth0/auth0-react";
import { SimStatus } from "./SimStatus";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const headerHeight = 48;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  // padding: theme.spacing(0, 1),
  width: "100%",
  // necessary for content to be below app bar
  // ...theme.mixins.toolbar,

  minHeight: `${headerHeight}px !important`,
}));

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  color: "#444444",
  backgroundColor: theme.palette.primary.main,
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Logo = ({ sx }) => {
  return (
    <Box sx={sx}>
      <img
        height="25px"
        src={`${process.env.PUBLIC_URL}/logo.png`}
        alt={"Page logo"}
      />
    </Box>
  );
};

export default function Layout(props) {
  const { user, isAuthenticated, logout } = useAuth0();
  const [anchorElNavMenu, setAnchorElNavMenu] = useState(null);
  const [anchorElAccMenu, setAnchorElAccMenu] = useState(null);

  const theme = useTheme();
  const matchSM = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    // This it to avoid keeping the anchor of the small menu if the screen is width enough
    if (matchSM) {
      setAnchorElNavMenu(null);
    }
  }, [matchSM]);

  const handleMenu = (f) => {
    return (event) => f(event.currentTarget);
  };

  const handleClose = (f) => {
    return () => f(null);
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <Box sx={{ display: "flex", flex: "1", height: "100%" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar
          sx={{
            minHeight: `${headerHeight}px !important`,
            height: `${headerHeight}px !important`,
            alignItems: "center",
          }}
        >
          {isAuthenticated ? (
            <React.Fragment>
              <Box
                sx={{
                  flexGrow: 0,
                  marginRight: 3,
                  display: { xs: "flex", md: "none" },
                }}
              >
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu(setAnchorElNavMenu)}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNavMenu}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNavMenu)}
                  onClose={handleClose(setAnchorElNavMenu)}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  <IconMenuItem
                    leftIcon={<DashboardIcon />}
                    label={
                      <Link
                        to="/ambientes"
                        style={{
                          color: "black",
                          textDecoration: "none",
                          textTransform: "none",
                        }}
                      >
                        {" "}
                        Mis Ambientes{" "}
                      </Link>
                    }
                  ></IconMenuItem>

                  <IconMenuItem
                    leftIcon={<SimStatus />}
                    label={
                      <Link
                        to="/simulador"
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          textTransform: "none",
                        }}
                      >
                        {" "}
                        Simulador{" "}
                      </Link>
                    }
                  />
                </Menu>
              </Box>

              <Logo sx={{ flexGrow: 1 }} />

              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <Link
                  to="/ambientes"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <Button
                    sx={{
                      mx: 0,
                      color: "inherit",
                      textTransform: "none",
                    }}
                  >
                    Mis Ambientes
                  </Button>
                </Link>
                <Link
                  to="/simulador"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <Button
                    sx={{
                      mx: 0,
                      color: "inherit",
                      textTransform: "none",
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    Simulador <SimStatus />
                  </Button>
                </Link>
              </Box>

              <div>
                <IconButton
                  size="medium"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu(setAnchorElAccMenu)}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElAccMenu}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElAccMenu)}
                  onClose={handleClose(setAnchorElAccMenu)}
                >
                  <MenuItem>
                    <Typography>{user.email}</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <IconButton>
                      <LogoutIcon />
                    </IconButton>
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </div>
            </React.Fragment>
          ) : (
            <Logo sx={{ flexGrow: 1 }} />
          )}
        </Toolbar>
      </AppBar>

      <Grid
        container
        direction={"column"}
        component="main"
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
          left: 0,
        }}
      >
        <Grid item component={DrawerHeader} id="headerSpacer" />
        <Grid item component={"div"} sx={{ width: "100%", flexGrow: 1, height: `calc(100% - ${headerHeight}px)`, overflow: "auto"}}>
          {props.children}
        </Grid>
      </Grid>
    </Box>
  );
}

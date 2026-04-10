import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import {
  Group,
  Button,
  Text,
  Container,
  ActionIcon,
  useMantineColorScheme,
  Avatar,
  Menu,
  Box,
  rem,
} from "@mantine/core";
import {
  IconSun,
  IconMoon,
  IconUser,
  IconLogout,
  IconPlus,
} from "@tabler/icons-react";
import classes from "./Navbar.module.css";

function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOutUser();
    navigate("/");
  };
  console.log("Estado actual del usuario:", user);
  return (
    <Box component="header" className={classes.header}>
      <Container size="xl" className={classes.inner}>
        {/* LOGO */}
        <Text
          component={Link}
          to="/"
          size="xl"
          fw={900}
          className={classes.logo}
          variant="gradient"
          gradient={{ from: "blue", to: "cyan", deg: 90 }}
        >
          IRONLANCE
        </Text>

        <Group gap={20}>
          {/* NAVEGACIÓN PRINCIPAL */}
          <Group gap={10} visibleFrom="sm">
            <Button component={Link} to="/jobs" variant="subtle">
              Find Jobs
            </Button>

            {isLoggedIn && user?.role === "IRONHACKER" && (
              <Button component={Link} to="/my-applications" variant="subtle">
                My Applications
              </Button>
            )}

            {isLoggedIn && user?.role === "COMPANY" && (
              <>
                <Button component={Link} to="/my-jobs" variant="subtle">
                  My Jobs
                </Button>
                <Button
                  component={Link}
                  to="/jobs/create"
                  variant="light"
                  leftSection={<IconPlus size={16} />}
                >
                  Post a Job
                </Button>
              </>
            )}
          </Group>

          {/* DARK MODE */}
          <ActionIcon
            onClick={() => toggleColorScheme()}
            variant="default"
            size="lg"
          >
            {colorScheme === "dark" ? (
              <IconSun size={20} />
            ) : (
              <IconMoon size={20} />
            )}
          </ActionIcon>

          {/* SECCIÓN DE USUARIO */}
          <Group gap="md">
            {isLoggedIn ? (
              <Group gap="xs">
                {/* DROPDOWN DE PERFIL */}
                <Menu shadow="md" width={200} trigger="hover" openDelay={100}>
                  <Menu.Target>
                    <Avatar
                      color="blue"
                      radius="xl"
                      size="sm"
                      style={{ cursor: "pointer" }}
                    >
                      <IconUser size={18} />
                    </Avatar>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>Settings</Menu.Label>
                    <Menu.Item
                      leftSection={<IconUser style={{ width: rem(14) }} />}
                      component={Link}
                      to="/profile"
                    >
                      Profile
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={<IconLogout style={{ width: rem(14) }} />}
                      onClick={handleLogout}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>

                {/* MENSAJE DE BIENVENIDA */}
                <Text size="sm" fw={500} visibleFrom="xs" c="dimmed">
                  Welcome,{" "}
                  <Text span c="blue" fw={700}>
                    {user.name}
                  </Text>
                </Text>
              </Group>
            ) : (
              <Group gap={10}>
                <Button component={Link} to="/login" variant="default">
                  Login
                </Button>
                <Button component={Link} to="/signup">
                  Signup
                </Button>
              </Group>
            )}
          </Group>
        </Group>
      </Container>
    </Box>
  );
}

export default Navbar;

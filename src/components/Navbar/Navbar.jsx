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
  Burger,
  Drawer,
  Stack,
  Divider
} from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { 
  IconSun, 
  IconMoon, 
  IconUser, 
  IconLogout, 
  IconPlus,
  IconUserSearch 
} from "@tabler/icons-react";
import classes from "./Navbar.module.css";

function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOutUser();
    close();
    navigate("/");
  };

  // Lógica para obtener el nombre a mostrar según el rol y los datos disponibles
  const getUserName = () => {
    if (!user) return "";
    
    if (user.role === "IRONHACKER") return user.firstName || "Ironhacker";
    if (user.role === "COMPANY") return user.companyName || "Company";

    return user.name || "User";
  };

  const NavContent = ({ isMobile = false }) => (
    <>
      {/* Solo visible para anónimos o Ironhackers */}
      {(!isLoggedIn || user?.role === "IRONHACKER") && (
        <Button 
          component={Link} to="/jobs" variant="subtle" 
          onClick={close} fullWidth={isMobile} justify={isMobile ? "flex-start" : "center"}
        >
          Find Jobs
        </Button>
      )}

      {isLoggedIn && user?.role === "IRONHACKER" && (
        <Button 
          component={Link} to="/my-applications" variant="subtle" 
          onClick={close} fullWidth={isMobile} justify={isMobile ? "flex-start" : "center"}
        >
          My Applications
        </Button>
      )}

      {isLoggedIn && user?.role === "COMPANY" && (
        <>
          {/* Botón específico para empresas para buscar talento */}
          <Button 
            component={Link} to="/ironhackers" variant="subtle" 
            leftSection={<IconUserSearch size={18} />}
            onClick={close} fullWidth={isMobile} justify={isMobile ? "flex-start" : "center"}
          >
            Find Talent
          </Button>
          <Button 
            component={Link} to="/my-jobs" variant="subtle" 
            onClick={close} fullWidth={isMobile} justify={isMobile ? "flex-start" : "center"}
          >
            My Jobs
          </Button>
          <Button 
            component={Link} to="/jobs/create" variant="light" 
            leftSection={<IconPlus size={16} />} 
            onClick={close} fullWidth={isMobile} justify={isMobile ? "flex-start" : "center"}
          >
            Post a Job
          </Button>
        </>
      )}
    </>
  );

  return (
    <Box component="header" className={classes.header}>
      <Container size="xl" className={classes.inner}>
        
        <Group gap="xs">
          {/* BURGER (Izquierda del logo en móvil) */}
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          
          {/* LOGO */}
          <Text
            component={Link}
            to={isLoggedIn ? "/jobs" : "/"}
            size="xl"
            fw={900}
            className={classes.logo}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 90 }}
          >
            IRONLANCE
          </Text>
        </Group>

        <Group gap="md">
          
          {/* NAVEGACIÓN DESKTOP */}
          <Group gap={5} visibleFrom="sm">
            <NavContent />
          </Group>

          <Divider orientation="vertical" visibleFrom="sm" />

          {/* DARK MODE */}
          <ActionIcon onClick={() => toggleColorScheme()} variant="default" size="lg">
            {colorScheme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
          </ActionIcon>

          {/* SECCIÓN DE USUARIO / ACCESO */}
          <Group gap="xs">
            {isLoggedIn ? (
              <>
                <Text size="sm" fw={500} visibleFrom="sm" c="dimmed">
                  Welcome, <Text span c="blue" fw={700}>{getUserName()}</Text>
                </Text>
                <Menu shadow="md" width={200} trigger="hover" offset={20}>
                  <Menu.Target>
                    <Avatar src={user.logo} color="blue" radius="xl" size="md" style={{ cursor: "pointer" }}>
                      <IconUser size={18} />
                    </Avatar>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item component={Link} to="/profile" leftSection={<IconUser size={14} />}>Profile</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item color="red" onClick={handleLogout} leftSection={<IconLogout size={14} />}>Logout</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            ) : (
              <Group gap={10} visibleFrom="xs">
                <Button component={Link} to="/login" variant="default">Login</Button>
                <Button component={Link} to="/signup">Signup</Button>
              </Group>
            )}
          </Group>
        </Group>
      </Container>

      {/* DRAWER (Menú lateral móvil) */}
      <Drawer
        opened={opened}
        onClose={close}
        size="70%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Stack gap="sm">
          <Divider my="sm" />
          {isLoggedIn && (
             <Text size="sm" fw={700} px="xs" mb="xs">
                Hi, {getUserName()}!
             </Text>
          )}
          <NavContent isMobile={true} />
          {!isLoggedIn && (
            <>
              <Divider my="sm" />
              <Button component={Link} to="/login" variant="default" onClick={close}>Login</Button>
              <Button component={Link} to="/signup" onClick={close}>Signup</Button>
            </>
          )}
        </Stack>
      </Drawer>
    </Box>
  );
}

export default Navbar;
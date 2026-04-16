import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import usersService from "../../services/users.service";
import {
  Container,
  Text,
  Title,
  Group,
  Stack,
  Avatar,
  Button,
  Divider,
  Box,
  Center,
  Loader,
  ActionIcon,
  Tooltip,
  Alert,
  Grid,
  Paper,
  SimpleGrid,
  useMantineTheme,
  rem,
  ThemeIcon,
} from "@mantine/core";
import {
  IconBrandLinkedin,
  IconExternalLink,
  IconMapPin,
  IconSchool,
  IconMail,
  IconArrowLeft,
  IconLock,
  IconShieldCheck,
  IconBriefcase,
  IconConfetti,
  IconPalette,
  IconCode,
  IconChartBar,
  IconShieldLock,
  IconDatabase,
  IconCloud,
  IconBrain,
  IconSparkles
} from "@tabler/icons-react";

function IronhackerDetailsPage() {
  const { userId } = useParams();
  const theme = useMantineTheme();
  const [hacker, setHacker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    usersService
      .getIronhackerDetails(userId)
      .then((res) => {
        setHacker(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching ironhacker details", err);
        setError("User not found or profile is private.");
        setLoading(false);
      });
  }, [userId]);

  if (loading)
    return (
      <Center h="80vh">
        <Loader size="xl" />
      </Center>
    );

  if (error || !hacker) {
    return (
      <Container size="sm" py="xl">
        <Alert
          icon={<IconLock size={16} />}
          title="Access Restricted"
          color="red"
          variant="light"
        >
          {error}
        </Alert>
        <Center mt="xl">
          <Button
            component={Link}
            to="/ironhackers"
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
          >
            Back to Ironhackers Board
          </Button>
        </Center>
      </Container>
    );
  }

  // Doble check de seguridad
  if (!hacker.isPublic) {
    return (
      <Container size="sm" py="xl">
        <Alert
          icon={<IconLock size={16} />}
          title="Private Profile"
          color="orange"
        >
          This Ironhacker has decided to keep their profile private.
        </Alert>
      </Container>
    );
  }

 const getBootcampConfig = (bootcamp) => {
  // 1. Diccionario de configuración para todos los roles
  const configs = {
    "Web Development": { 
      color: "blue", 
      icon: IconCode,  
    },
    "Data Analytics": { 
      color: "cyan", 
      icon: IconChartBar,  
    },
    "UX/UI Design": { 
      color: "pink", 
      icon: IconPalette, 
    },
    "Cybersecurity": { 
      color: "red", 
      icon: IconShieldLock, 
    },
    "Data Engineering": { 
      color: "orange", 
      icon: IconDatabase, 
    },
    "Machine Learning": { 
      color: "grape", 
      icon: IconBrain, 
    },
    "Cloud Engineering": { 
      color: "indigo", 
      icon: IconCloud, 
    },
    "AI Consultant": { 
      color: "teal", 
      icon: IconSparkles, 
    }
  };

  // 2. Configuración por defecto si no hay match
  const default_config = { 
    color: "blue", 
    icon: IconBriefcase, 
  };

  if (!bootcamp) return default_config;

  // 3. Buscamos la clave que esté incluida en el string del bootcamp
  const foundKey = Object.keys(configs).find((key) => bootcamp.includes(key));

  return configs[foundKey] || default_config;
};

  const bootcampConfig = getBootcampConfig(hacker.bootcamp);

  return (
    <>
      {/* SECCIÓN 1: HERO / BANNER SUPERIOR */}
      <Box
        style={{
          paddingTop: rem(40),
          paddingBottom: rem(80),
          borderBottom: "1px solid rgba(182, 192, 192, 0.18)",
        }}
      >
        <Container size="lg">
          <Button
            component={Link}
            to="/ironhackers"
            variant="transparent"
            mb="xl"
            leftSection={<IconArrowLeft size={16} />}
            p={0}
            opacity={0.8}
            style={{ "&:hover": { opacity: 1 } }}
          >
            Back to Talent Board
          </Button>

          <Grid align="center" gutter="xl">
            <Grid.Col span={{ base: 12, md: "content" }}>
              <Avatar
                src={hacker.logo}
                size={150}
                radius={150}
                style={{
                  boxShadow: theme.shadows.xl,
                }}
                color="blue"
                mx={{ base: "auto", md: 0 }} 
              >
                {hacker.firstName?.[0]}
              </Avatar>
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, md: "auto" }}
              ta={{ base: "center", md: "left" }}
            >
              <Group gap="xs" justify={{ base: "center", md: "flex-start" }}>
                <Title order={1} fw={900} size={rem(42)}>
                  {hacker.firstName} {hacker.lastName}
                </Title>
                <Tooltip label="Verified Ironhacker">
                  <IconShieldCheck size={32} color="cyan" />
                </Tooltip>
              </Group>

              <Group
                gap="lg"
                mt="xs"
                justify={{ base: "center", md: "flex-start" }}
              >
                <Group gap={5}>
                  <IconSchool size={20} />
                  <Text fw={700} size="lg">
                    {hacker.bootcamp}
                  </Text>
                </Group>
                <Group gap={5}>
                  <IconMapPin size={20} />
                  <Text size="lg">{hacker.campus} Campus</Text>
                </Group>
              </Group>
            </Grid.Col>

            {/* BOTONES DE ACCIÓN MANTENIDOS */}
            <Grid.Col
              span={{ base: 12, md: "content" }}
              ta={{ base: "center", md: "right" }}
            >
              <Group gap="sm" justify={{ base: "center", md: "flex-end" }}>
                {hacker.linkedinUrl && (
                  <Tooltip label="LinkedIn Profile">
                    <ActionIcon
                      component="a"
                      href={hacker.linkedinUrl}
                      target="_blank"
                      size="xl"
                      color="blue"
                      radius="md"
                    >
                      <IconBrandLinkedin size={rem(28)} />
                    </ActionIcon>
                  </Tooltip>
                )}
                {hacker.portfolioUrl && (
                  <Tooltip label="Visit Portfolio">
                    <ActionIcon
                      component="a"
                      href={hacker.portfolioUrl}
                      target="_blank"
                      size="xl"
                      color="green"
                      radius="md"
                    >
                      <IconExternalLink size={26} />
                    </ActionIcon>
                  </Tooltip>
                )}
                {hacker.email && (
                  <Tooltip label="Send an email">
                    <ActionIcon
                      component="a"
                      href={hacker.email}
                      target="_blank"
                      size="xl"
                      color="red"
                      radius="md"
                    >
                      <IconMail size={20} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Group>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* SECCIÓN 2: CONTENIDO PRINCIPAL (Con efecto Overlap) */}
      <Container size="lg" mt={rem(-50)} pb="xl">
        {" "}
        {/* mt negativo para subir el contenido */}
        <Grid gutter="xl">
          {/* COLUMNA IZQUIERDA (Biografía) */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper withBorder p="xl" radius="md" shadow="sm">
              <Stack gap="lg">
                <Title order={2}>About Me</Title>
                <Text
                  style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
                  c="dimmed"
                  size="md"
                >
                  {hacker.about || "This Ironhacker hasn't added a bio yet."}
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* COLUMNA DERECHA (Información Adicional / Sidebar de perfil) */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="lg">
              {/* Tarjeta de Educación */}
              <Paper
                withBorder
                p="lg"
                radius="md"
                shadow="sm"
                style={{
                  borderLeft: `5px solid var(--mantine-color-${bootcampConfig.color}-6)`,
                }}
              >
                <Group gap="sm" mb="xs">
                  <ThemeIcon
                    size="lg"
                    radius="md"
                    variant="light"
                    color={bootcampConfig.color}
                  >
                    <bootcampConfig.icon size={20} />
                  </ThemeIcon>
                  <Title order={4}>Educational Journey</Title>
                </Group>
                <Text size="sm" c="dimmed">
                  Completed the intensive{" "}
                  <Text span fw={700} c={bootcampConfig.color}>
                    {hacker.bootcamp}
                  </Text>{" "}
                  bootcamp at the {hacker.campus} Campus.
                </Text>
              </Paper>

              {/* Tarjeta de Contacto / Info */}
              <Paper withBorder p="lg" radius="md" shadow="sm">
                <Title order={4} mb="xs">
                  Quick Facts
                </Title>
                <Stack gap="sm">
                  <Group gap="xs" wrap="nowrap">
                    <IconMail size={16} color="gray" />
                    <Text
                      size="sm"
                      fw={500}
                      lineClamp={1}
                      style={{ textOverflow: "ellipsis" }}
                    >
                      {hacker.email}
                    </Text>
                  </Group>
                  <Group gap="xs" wrap="nowrap">
                    <IconConfetti size={16} color="gray" />
                    <Text size="sm" c="dimmed">
                      Status: Open to Work
                    </Text>
                  </Group>
                </Stack>
              </Paper>

              <Alert
                icon={<IconShieldCheck size={16} />}
                title="Hiring Tip"
                radius="md"
              >
                Ready to take the next step? Contact this candidate directly.
              </Alert>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}

export default IronhackerDetailsPage;

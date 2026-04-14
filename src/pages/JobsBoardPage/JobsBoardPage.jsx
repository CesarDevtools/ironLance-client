import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import jobsService from "../../services/jobs.service";
import { AuthContext } from "../../context/auth.context";
import { 
  Container, Title, Text, TextInput, SimpleGrid, Paper, Badge, 
  Group, Stack, Box, Divider, Center, Loader, Button, 
  ThemeIcon, Avatar, Grid, Progress, Affix, Transition, ActionIcon, rem // Añadidos Affix, Transition, ActionIcon
} from "@mantine/core";
import { useWindowScroll } from '@mantine/hooks'; // Añadido hook de scroll
import { 
  IconSearch, IconCoin, IconMapPin, IconClock, 
  IconDeviceAnalytics, IconChecklist, IconRocket, IconPlus, IconArrowUp // Añadido IconArrowUp
} from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PromoCarousel from "../../components/PromoCarousel/PromoCarousel";

dayjs.extend(relativeTime);

function JobBoardPage() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [scroll, scrollTo] = useWindowScroll();

  // Lista de habilidades populares 
  const popularSkills = ["React", "Python", "Node", "Figma", "Java"];

  // Lógica de progreso 
  const calculateProgress = () => {
    if (!user) return 0;
    let score = 0;
    const totalFields = user.role === "IRONHACKER" ? 8 : 5; // 
    
    if (user.role === "IRONHACKER") {
      if (user.firstName) score++;
      if (user.lastName) score++;
      if (user.about) score++;
      if (user.bootcamp) score++;
      if (user.campus) score++;
      if (user.linkedinUrl) score++;
      if (user.portfolioUrl) score++;
      if (user.logo) score++;
    } else {
      if (user.companyName) score++;
      if (user.about) score++;
      if (user.website) score++;
      if (user.logo) score++;
      if (user.email) score++;
    }

    return Math.round((score / totalFields) * 100);
  };

  useEffect(() => {
    jobsService.getAllJobs()
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jobs", err);
        setLoading(false);
      });
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const searchLower = search.toLowerCase();
    return (
      job.requirements.some(skill => skill.toLowerCase().includes(searchLower)) ||
      job.title.toLowerCase().includes(searchLower)
    );
  });

  const getLevelBadge = (level) => {
    const config = {
      Entry: { color: "teal", icon: <IconDeviceAnalytics size={14} /> },
      Intermediate: { color: "blue", icon: <IconDeviceAnalytics size={14} /> },
      Expert: { color: "violet", icon: <IconDeviceAnalytics size={14} /> }
    };
    return config[level] || config.Intermediate;
  };

  if (loading) return <Center h="80vh"><Loader size="xl" /></Center>;

  return (
    <Container size="lg" py="xl">
      <Grid gutter="xl">
        
        {/* COLUMNA IZQUIERDA (75%) */}
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Stack mb={40}>
            <Title order={1} fw={900}>Find your next challenge</Title>
            <TextInput
              placeholder="Filter by skills (e.g. React, Node, Figma...)"
              leftSection={<IconSearch size={18} />}
              size="md"
              w="100%"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              radius="md"
            />
            {/* POPULAR SKILLS PILLS */}
            <Group gap="xs">
              <Text size="xs" fw={700} c="dimmed">Popular skills:</Text>
              {popularSkills.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="light"  
                  onClick={() => setSearch(skill)}
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "var(--mantine-shadow-sm)";
                    }}
                >
                  {skill}
                </Badge>
              ))}
            </Group>
          </Stack>

          <SimpleGrid cols={1} spacing="lg">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
                const levelInfo = getLevelBadge(job.level);
                return (
                  <Paper key={job._id} withBorder p="xl" radius="md" shadow="sm" style={{
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'default'
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "var(--mantine-shadow-sm)";
                    }}>
                    <Stack gap="xs">
                      <Box>
                        <Group gap="xs" mb={4}>
                          <Avatar src={job.owner?.logo} size="xs" radius="xs" />
                          <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                            {job.owner?.companyName || "Company"}
                          </Text>
                        </Group>
                        <Title order={3} c="blue.7">{job.title}</Title>
                        <Group gap={5} mt={4}>
                          <IconClock size={14} color="gray" />
                          <Text size="xs" c="dimmed">Posted {dayjs(job.createdAt).fromNow()}</Text>
                        </Group>
                      </Box>

                      <Group gap="lg" my="sm">
                        <Group gap={5}><IconCoin size={18} color="#40c057" /><Text fw={600} size="sm">{job.salary}</Text></Group>
                        <Group gap={5}>
                          <ThemeIcon variant="light" color={levelInfo.color} size="sm">{levelInfo.icon}</ThemeIcon>
                          <Text fw={600} size="sm">{job.level}</Text>
                        </Group>
                      </Group>

                      <Text size="sm" c="dimmed" lineClamp={2}>{job.description}</Text>

                      <Group gap={8} mt="md">
                        {job.requirements.slice(0, 5).map((skill, index) => (
                          <Badge key={index} variant="light" color="gray" radius="sm">{skill}</Badge>
                        ))}
                      </Group>

                      <Divider my="sm" variant="dotted" />

                      <Group justify="space-between">
                        <Group gap={5}><IconMapPin size={16} color="red" /><Text size="sm" fw={500}>{job.location}</Text></Group>
                        <Button component={Link} to={`/jobs/${job._id}`} variant="light" radius="xl" size="xs">View Details</Button>
                      </Group>
                    </Stack>
                  </Paper>
                );
              })
            ) : (
              <Center py="xl"><Text c="dimmed">No jobs found matching those skills.</Text></Center>
            )}
          </SimpleGrid>
        </Grid.Col>

        {/* COLUMNA DERECHA (25%) - SOLO DESKTOP */}
        <Grid.Col span={3} visibleFrom="md">
          <Stack style={{ top: 20 }}>
            <Paper withBorder p="lg" radius="md" shadow="sm">
              {!isLoggedIn ? (
                <Stack align="center" ta="center" py="md">
                  <ThemeIcon size={50} radius="xl" variant="light" color="blue">
                    <IconRocket size={30} />
                  </ThemeIcon>
                  <Title order={4}>Boost your career</Title>
                  <Text size="sm" c="dimmed">Login to apply for jobs and track your applications.</Text>
                  <Button fullWidth component={Link} to="/signup" mt="md" radius="md">Get Started</Button>
                </Stack>
              ) : user.role === "IRONHACKER" ? (
                <Stack align="center" ta="center">
                  <Avatar size="xl" radius="xl" color="blue" src={user.logo} />
                  <Box>
                    <Text fw={700} size="lg">Hello, {user.firstName || "Ironhacker"}!</Text>
                    <Text size="xs" c="dimmed">{user.bootcamp || "Student"}</Text>
                  </Box>
                  <Divider w="100%" />
                  <Box w="100%">
                    <Group justify="space-between" mb={5}>
                      <Text size="xs" fw={700}>Profile Strength</Text>
                      <Text size="xs" c="blue" fw={700}>{calculateProgress()}%</Text>
                    </Group>
                    <Progress value={calculateProgress()} size="sm" radius="xl" color={calculateProgress() === 100 ? "green" : "blue"} striped animated />
                    {calculateProgress() < 100 && (
                      <Text size="xs" c="dimmed" mt={8}>Complete your profile to stand out!</Text>
                    )}
                  </Box>
                  <Button fullWidth variant="light" size="xs" component={Link} to="/profile">Edit Profile</Button>
                </Stack>
              ) : (
                <Stack align="center" ta="center">
                  <Avatar src={user.logo} size="xl" radius="md" />
                  <Box>
                    <Text fw={700} size="lg">{user.companyName || "Company"}</Text>
                    <Text size="xs" c="dimmed">Corporate Account</Text>
                  </Box>
                  <Divider w="100%" />
                  <Button fullWidth component={Link} to="/profile" size="xs">Profile</Button>
                  <Button fullWidth variant="light" component={Link} to="/my-jobs" size="xs">Manage My Jobs</Button>
                </Stack>
              )}
            </Paper>

            <Paper withBorder p="md" radius="md" bg="var(--mantine-color-blue-light)" style={{ borderStyle: 'dashed' }}>
              <Text size="xs" c="blue" fw={700} ta="center">Tip: Use skills in search to find specific roles!</Text>
            </Paper>

            <PromoCarousel />
          </Stack>
        </Grid.Col>

      </Grid>

      {/* BOTÓN SCROLL TO TOP */}
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <ActionIcon
              color="blue"
              size="xl"
              radius="xl"
              variant="filled"
              style={transitionStyles}
              onClick={() => scrollTo({ y: 0 })}
            >
              <IconArrowUp style={{ width: rem(16), height: rem(16) }} />
            </ActionIcon>
          )}
        </Transition>
      </Affix>

    </Container>
  );
}

export default JobBoardPage;
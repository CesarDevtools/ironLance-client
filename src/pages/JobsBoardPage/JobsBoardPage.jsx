import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jobsService from "../../services/jobs.service";
import { 
  Container, Title, Text, TextInput, SimpleGrid, Paper, Badge, 
  Group, Stack, Box, Divider, Center, Loader, Button, 
  ThemeIcon, Avatar, Grid, Affix, Transition, ActionIcon, rem,
  Pagination 
} from "@mantine/core";
import { useWindowScroll } from '@mantine/hooks'; 
import { 
  IconSearch, IconCoin, IconMapPin, IconClock, 
  IconDeviceAnalytics, IconArrowUp 
} from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Sidebar from "../../components/Sidebar/Sidebar"; 

dayjs.extend(relativeTime);

function JobBoardPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [scroll, scrollTo] = useWindowScroll();
  const [activePage, setActivePage] = useState(1);
  const jobsPerPage = 5;

  const popularSkills = ["React", "Python", "Node", "Figma", "Java"];

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

  // Lógica para obtener los empleos de la página actual
  const indexOfLastJob = activePage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  useEffect(() => {
    setActivePage(1);
  }, [search]);

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
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => {
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

          {totalPages > 1 && (
            <Center mt={40}>
              <Pagination 
                total={totalPages} 
                value={activePage} 
                onChange={(page) => {
                  setActivePage(page);
                  scrollTo({ y: 0 }); 
                }} 
                radius="md"
                withEdges
              />
            </Center>
          )}
        </Grid.Col>

        {/* COLUMNA DERECHA (25%) - SOLO DESKTOP */}
        <Grid.Col span={3} visibleFrom="md">
          <Sidebar />
        </Grid.Col>

      </Grid>

      {/* BOTÓN SCROLL TO TOP */}
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <ActionIcon
              color="cyan"
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
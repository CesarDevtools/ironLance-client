import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jobsService from "../../services/jobs.service"; 
import { 
  Container, 
  Title, 
  Text, 
  TextInput, 
  SimpleGrid, 
  Paper, 
  Badge, 
  Group, 
  Stack, 
  Box, 
  Divider, 
  Center, 
  Loader, 
  Button,
  ThemeIcon,
  Avatar // <--- Añadido para el logo de la empresa
} from "@mantine/core";
import { 
  IconSearch, 
  IconCoin, 
  IconMapPin, 
  IconClock, 
  IconDeviceAnalytics, 
  IconChecklist 
} from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function JobBoardPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
      <Stack align="center" mb={40}>
        <Title order={1} fw={900}>Find your next challenge</Title>
        <Text c="dimmed" size="lg">Customize your search to match your skills</Text>
        
        <TextInput
          placeholder="Filter by skills (e.g. React, Node, Figma...)"
          leftSection={<IconSearch size={18} />}
          size="md"
          w={{ base: "100%", sm: 400 }}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          radius="md"
        />
      </Stack>

      <SimpleGrid cols={1} spacing="lg">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const levelInfo = getLevelBadge(job.level);
            
            return (
              <Paper 
                key={job._id} 
                withBorder 
                p="xl" 
                radius="md" 
                shadow="sm"
                style={{
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
                }}
              >
                <Stack gap="xs">
                  <Box>
                    {/* LOGO + NOMBRE DE EMPRESA */}
                    <Group gap="xs" mb={4}>
                      <Avatar src={job.owner?.logo} size="xs" radius="xs" />
                      <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                        {job.owner?.companyName || "Company"}
                      </Text>
                    </Group>

                    <Title order={3} c="blue.7">{job.title}</Title>
                    <Group gap={5} mt={4}>
                      <IconClock size={14} color="gray" />
                      <Text size="xs" c="dimmed">
                        Posted {dayjs(job.createdAt).fromNow()}
                      </Text>
                    </Group>
                  </Box>

                  <Group gap="lg" my="sm">
                    <Group gap={5}>
                      <IconCoin size={18} color="#40c057" />
                      <Text fw={600} size="sm">{job.salary}</Text>
                    </Group>
                    <Group gap={5}>
                      <ThemeIcon variant="light" color={levelInfo.color} size="sm">
                        {levelInfo.icon}
                      </ThemeIcon>
                      <Text fw={600} size="sm">{job.level}</Text>
                    </Group>
                  </Group>

                  <Text size="sm" c="dimmed" lineClamp={3}>
                    {job.description}
                  </Text>

                  <Group gap={8} mt="md">
                    <IconChecklist size={16} color="gray" />
                    {job.requirements.map((skill, index) => (
                      <Badge key={index} variant="light" color="gray" radius="sm">
                        {skill}
                      </Badge>
                    ))}
                  </Group>

                  <Divider my="sm" variant="dotted" />

                  <Group justify="space-between">
                    <Group gap={5}>
                      <IconMapPin size={16} color="red" />
                      <Text size="sm" fw={500}>{job.location}</Text>
                    </Group>
                    
                    <Button 
                      component={Link} 
                      to={`/jobs/${job._id}`} 
                      variant="light" 
                      radius="xl" 
                      size="xs"
                    >
                      View Details
                    </Button>
                  </Group>
                </Stack>
              </Paper>
            );
          })
        ) : (
          <Center py="xl">
            <Text c="dimmed">No jobs found matching those skills.</Text>
          </Center>
        )}
      </SimpleGrid>
    </Container>
  );
}

export default JobBoardPage;
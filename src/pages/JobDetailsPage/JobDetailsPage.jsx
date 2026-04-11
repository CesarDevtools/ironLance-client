import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import jobsService from "../../services/jobs.service";
import { 
  Container, Grid, Paper, Stack, Title, Text, Group, 
  Badge, Avatar, Button, Divider, Loader, Center, Box, 
  ThemeIcon, SimpleGrid // <--- Movido aquí para que esté disponible
} from "@mantine/core";
import { 
  IconMapPin, IconCoin, IconWorld, 
  IconArrowLeft, IconBriefcase, IconCalendar
} from "@tabler/icons-react";
import dayjs from "dayjs";

function JobDetailsPage() {
  // 1. Extraemos el id de la URL
  const { id } = useParams(); 
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsService.getJobDetails(id) 
      .then(res => {
        setJob(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching job details", err);
        setLoading(false);
      });
  }, [id]); 

  if (loading) return <Center h="80vh"><Loader size="xl" /></Center>;
  if (!job) return <Center h="80vh"><Text size="xl" fw={700}>Job not found</Text></Center>;

  return (
    <Container size="lg" py="xl">
      <Button 
        component={Link} 
        to="/jobs" 
        variant="subtle" 
        leftSection={<IconArrowLeft size={16} />}
        mb="lg"
        color="gray"
      >
        Back to Job Board
      </Button>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="xl">
            <Box>
              <Title order={1} size="h1" fw={900} mb="xs">{job.title}</Title>
              <Group gap="sm">
                <Badge color="blue" variant="light" size="lg" radius="sm">
                  {job.level}
                </Badge>
                <Group gap={5}>
                  <IconCalendar size={16} color="gray" />
                  <Text size="sm" c="dimmed">
                    Posted {dayjs(job.createdAt).fromNow()}
                  </Text>
                </Group>
              </Group>
            </Box>

            <Paper withBorder p="md" radius="md">
              <SimpleGrid cols={{ base: 1, sm: 3 }}>
                <Group>
                  <ThemeIcon color="green" variant="light" size="lg">
                    <IconCoin size={20} />
                  </ThemeIcon>
                  <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Salary</Text>
                    <Text fw={700}>{job.salary}</Text>
                  </Box>
                </Group>

                <Group>
                  <ThemeIcon color="red" variant="light" size="lg">
                    <IconMapPin size={20} />
                  </ThemeIcon>
                  <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Location</Text>
                    <Text fw={700}>{job.location}</Text>
                  </Box>
                </Group>

                <Group>
                  <ThemeIcon color="cyan" variant="light" size="lg">
                    <IconBriefcase size={20} />
                  </ThemeIcon>
                  <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Company</Text>
                    <Text fw={700}>{job.owner?.companyName}</Text>
                  </Box>
                </Group>
              </SimpleGrid>
            </Paper>

            <Divider />

            <Box>
              <Title order={3} mb="md">Description</Title>
              <Text style={{ whiteSpace: 'pre-line' }} lh={1.7}>
                {job.description}
              </Text>
            </Box>

            <Box>
              <Title order={3} mb="md">Requirements</Title>
              <Group gap="xs">
                {job.requirements.map((req, i) => (
                  <Badge key={i} size="xl" variant="filled" color="gray.2" c="dark" radius="md">
                    {req}
                  </Badge>
                ))}
              </Group>
            </Box>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md" style={{ position: 'sticky', top: '20px' }}>
            <Paper withBorder p="xl" radius="md" shadow="sm">
              <Stack align="center" ta="center" mb="md">
                <Avatar 
                  src={job.owner?.logo} 
                  size={100} 
                  radius="md" 
                />
                <Title order={3}>{job.owner?.companyName}</Title>
                {job.owner?.website && (
                  <Button 
                    component="a" 
                    href={job.owner.website} 
                    target="_blank" 
                    variant="subtle" 
                    size="compact-xs" 
                    leftSection={<IconWorld size={14} />}
                  >
                    Official Website
                  </Button>
                )}
              </Stack>

              <Divider label="About the company" labelPosition="center" my="lg" />
              
              <Text size="sm" c="dimmed" lh={1.6} mb="xl">
                {job.owner?.about || "This company values privacy and has not provided a description yet."}
              </Text>

              <Button fullWidth size="md" radius="md" color="blue">
                Apply for this job
              </Button>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default JobDetailsPage;
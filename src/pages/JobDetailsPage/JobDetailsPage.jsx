import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import jobsService from "../../services/jobs.service";
import applicationsService from "../../services/applications.service";
import { 
  Container, Grid, Paper, Stack, Title, Text, Group, 
  Badge, Avatar, Button, Divider, Loader, Center, Box, 
  ThemeIcon, SimpleGrid, Modal, Textarea 
} from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications'; 
import { 
  IconMapPin, IconCoin, IconWorld, 
  IconArrowLeft, IconBriefcase, IconCalendar, IconSend,
  IconCheck, IconX // 
} from "@tabler/icons-react";
import dayjs from "dayjs";

function JobDetailsPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user, isLoggedIn } = useContext(AuthContext);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [opened, { open, close }] = useDisclosure(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

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

  const handleApplyClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    open();
  };

  const submitApplication = () => {
    setSending(true);
    const appData = {
      job: id,
      message: message
    };

    applicationsService.createApplication(appData)
      .then(() => {
        setSending(false);
        close();
        setMessage(""); // Limpiamos el mensaje para la próxima vez
        
        // NOTIFICACIÓN DE ÉXITO
        notifications.show({
          title: 'Success!',
          message: 'Your application has been sent correctly. Good luck!',
          color: 'green',
          icon: <IconCheck size={18} />,
        });
      })
      .catch(err => {
        setSending(false);
        console.error(err);
        
        // NOTIFICACIÓN DE ERROR (Maneja el "unique: true" del backend si ya aplicó)
        notifications.show({
          title: 'Application failed',
          message: err.response?.data?.message || "Something went wrong sending your application.",
          color: 'red',
          icon: <IconX size={18} />,
        });
      });
  };

  if (loading) return <Center h="80vh"><Loader size="xl" /></Center>;
  if (!job) return <Center h="80vh"><Text size="xl" fw={700}>Job not found</Text></Center>;

  const shouldShowApplyButton = !isLoggedIn || (isLoggedIn && user.role === "IRONHACKER");

  return (
    <Container size="lg" py="xl">
      
      {/* MODAL DE APLICACIÓN */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title="Apply for this position" 
        centered
        radius="md"
      >
        <Stack>
          <Text size="sm">
            Introduce yourself to <strong>{job.owner?.companyName}</strong>. 
            Explain why you are a great fit for the <strong>{job.title}</strong> role.
          </Text>
          <Textarea
            placeholder="Write your cover letter here..."
            label="Message"
            minRows={5}
            maxLength={3000}
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
          />
          <Button 
            fullWidth 
            onClick={submitApplication} 
            loading={sending}
            leftSection={<IconSend size={16} />}
          >
            Send Application
          </Button>
        </Stack>
      </Modal>

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
                  <ThemeIcon color="green" variant="light" size="lg"><IconCoin size={20} /></ThemeIcon>
                  <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Salary</Text>
                    <Text fw={700}>{job.salary}</Text>
                  </Box>
                </Group>
                <Group>
                  <ThemeIcon color="red" variant="light" size="lg"><IconMapPin size={20} /></ThemeIcon>
                  <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Location</Text>
                    <Text fw={700}>{job.location}</Text>
                  </Box>
                </Group>
                <Group>
                  <ThemeIcon color="cyan" variant="light" size="lg"><IconBriefcase size={20} /></ThemeIcon>
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
              <Text style={{ whiteSpace: 'pre-line' }} lh={1.7}>{job.description}</Text>
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
                <Avatar src={job.owner?.logo} size={100} radius="md" />
                <Title order={3}>{job.owner?.companyName}</Title>
              </Stack>

              <Divider label="About the company" labelPosition="center" my="lg" />
              
              <Text size="sm" c="dimmed" lh={1.6} mb="xl">
                {job.owner?.about || "No information available."}
              </Text>

              {shouldShowApplyButton && (
                <Button 
                  fullWidth 
                  size="md" 
                  radius="md" 
                  color="blue" 
                  onClick={handleApplyClick}
                >
                  {isLoggedIn ? "Apply for this job" : "Login to Apply"}
                </Button>
              )}
              
              {isLoggedIn && user.role === "COMPANY" && (
                <Text size="xs" c="orange" ta="center" fw={500}>
                  Companies cannot apply to jobs.
                </Text>
              )}
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default JobDetailsPage;
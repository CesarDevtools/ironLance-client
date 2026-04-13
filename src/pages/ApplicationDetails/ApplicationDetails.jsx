import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import applicationsService from "../../services/applications.service";
import { 
  Container, Paper, Title, Text, Group, Avatar, Badge, 
  Stack, Button, Divider, Grid, Box, ThemeIcon, Loader, Center, ActionIcon
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { 
  IconArrowLeft, IconBrandLinkedin, IconWorld, IconMail, 
  IconCheck, IconX, IconMessage2, IconSchool, IconLoader2 
} from "@tabler/icons-react";

function ApplicationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    applicationsService.getApplicationDetails(id)
      .then(res => {
        setApp(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const updateStatus = (newStatus) => {
    setUpdating(true);
    applicationsService.updateApplicationStatus(id, newStatus) 
      .then(() => {
        setApp({ ...app, status: newStatus });
        notifications.show({
          title: `Status: ${newStatus}`,
          message: `Candidate application is now ${newStatus.toLowerCase()}.`,
          color: newStatus === "HIRED" ? "green" : newStatus === "REJECTED" ? "red" : "orange",
        });
      })
      .catch(err => console.error(err))
      .finally(() => setUpdating(false));
  };

  if (loading) return <Center h="80vh"><Loader size="xl" /></Center>;
  if (!app) return <Center h="80vh"><Text>Application not found</Text></Center>;

  const { applicant } = app;

  // Helper para colores dinámicos
  const getStatusInfo = (status) => {
    switch (status) {
      case "HIRED": return { color: "green", label: "HIRED" };
      case "REJECTED": return { color: "red", label: "Rejected" };
      case "IN PROCESS": return { color: "orange", label: "In Process" };
      default: return { color: "blue", label: "Pending" };
    }
  };

  const statusInfo = getStatusInfo(app.status);

  return (
    <Container size="lg" py="xl">
      <Button 
        variant="subtle" 
        leftSection={<IconArrowLeft size={16} />} 
        onClick={() => navigate(-1)} 
        mb="xl" 
        color="gray"
      >
        Back to applicants
      </Button>

      <Grid gutter="xl">
        {/*  Perfil del Candidato */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="xl" radius="md" shadow="sm">
            <Stack align="center" ta="center">
              <Avatar src={applicant.logo} size={120} radius="120" color="blue">
                {applicant.firstName?.[0]}
              </Avatar>
              <Box>
                <Title order={3}>{applicant.firstName} {applicant.lastName}</Title>
                <Badge variant="light" color="blue" mt="xs">{applicant.bootcamp}</Badge>
              </Box>
              
              <Group gap="sm" mt="md">
                {applicant.linkedinUrl && (
                  <ActionIcon size="lg" variant="light" color="blue" component="a" href={applicant.linkedinUrl} target="_blank">
                    <IconBrandLinkedin size={20} />
                  </ActionIcon>
                )}
                {applicant.portfolioUrl && (
                  <ActionIcon size="lg" variant="light" color="teal" component="a" href={applicant.portfolioUrl} target="_blank">
                    <IconWorld size={20} />
                  </ActionIcon>
                )}
                <ActionIcon size="lg" variant="light" color="gray" component="a" href={`mailto:${applicant.email}`}>
                  <IconMail size={20} />
                </ActionIcon>
              </Group>
            </Stack>

            <Divider my="xl" label="Education" labelPosition="center" />
            
            <Group wrap="nowrap" gap="sm">
              <ThemeIcon variant="light" color="blue"><IconSchool size={18} /></ThemeIcon>
              <Box>
                <Text size="xs" c="dimmed">Campus</Text>
                <Text size="sm" fw={500}>{applicant.campus || "Remote"}</Text>
              </Box>
            </Group>
          </Paper>
        </Grid.Col>

        {/*  Mensaje y Acción */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="xl">
            <Paper withBorder p="xl" radius="md">
              <Group justify="space-between" mb="lg">
                <Title order={4}><IconMessage2 size={20} style={{ marginBottom: -4, marginRight: 8 }} />Cover Letter</Title>
                <Badge size="lg" variant="filled" color={statusInfo.color}>
                  {statusInfo.label}
                </Badge>
              </Group>
              
              <Text style={{ whiteSpace: "pre-line" }} lh={1.8} fs="italic">
                "{app.message || "The candidate did not include a specific message."}"
              </Text>

              <Divider my="xl" />

              <Title order={4} mb="md">Candidate Bio</Title>
              <Text c="dimmed" lh={1.6}>
                {applicant.about || "No bio provided."}
              </Text>
            </Paper>

            {/* BOTONES DE ACCIÓN  */}
            <Paper withBorder p="lg" radius="md" style={{ backgroundColor: 'var(--_paper-bg)' }}>
              <Stack gap="sm">
                <Text size="xs" fw={700} c="dimmed" ta="center" tt="uppercase">Update Application Status</Text>
                <Group justify="center" gap="sm">
                  <Button 
                    variant="light" 
                    color="red" 
                    leftSection={<IconX size={18} />}
                    onClick={() => updateStatus("REJECTED")}
                    loading={updating}
                    disabled={app.status === "REJECTED"}
                    flex={1}
                  >
                    Reject
                  </Button>

                  <Button 
                    variant="light" 
                    color="orange" 
                    leftSection={<IconLoader2 size={18} />}
                    onClick={() => updateStatus("IN PROCESS")}
                    loading={updating}
                    disabled={app.status === "IN PROCESS"}
                    flex={1}
                  >
                    In Process
                  </Button>

                  <Button 
                    variant="filled" 
                    color="green" 
                    leftSection={<IconCheck size={18} />}
                    onClick={() => updateStatus("HIRED")}
                    loading={updating}
                    disabled={app.status === "HIRED"}
                    flex={1}
                  >
                    Approve
                  </Button>
                </Group>
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default ApplicationDetailsPage;
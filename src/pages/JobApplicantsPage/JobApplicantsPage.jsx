import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import applicationsService from "../../services/applications.service";
import { 
  Container, Title, Text, Card, Group, Avatar, 
  Stack, Button, Loader, Center, SimpleGrid, 
  Badge, Paper, Box, SegmentedControl, Pagination 
} from "@mantine/core";
import { 
  IconArrowLeft, IconExternalLink, IconInbox 
} from "@tabler/icons-react";

function JobApplicantsPage() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    applicationsService.getJobApplications(jobId)
      .then((res) => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching applicants", err);
        setLoading(false);
      });
  }, [jobId]);

  // Lógica de filtrado
  const filteredApplications = applications.filter((app) => {
    if (filter === "ALL") return true;
    return app.status === filter;
  });

  // Lógica de paginación
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const currentItems = filteredApplications.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  // Resetear página al cambiar el filtro
  useEffect(() => {
    setActivePage(1);
  }, [filter]);

  if (loading) return <Center h="80vh"><Loader size="xl" /></Center>;

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* CABECERA */}
        <Group justify="space-between">
          <Box>
            <Button 
              component={Link} 
              to="/my-jobs" 
              variant="subtle" 
              leftSection={<IconArrowLeft size={16} />}
              p={0}
              mb="xs"
              color="gray"
            >
              Back to My Jobs
            </Button>
            <Title order={2}>Applicants List</Title>
            <Text c="dimmed">Review candidates who applied for this position</Text>
          </Box>
          
          <Badge size="xl" variant="outline" radius="sm">
            {filteredApplications.length} {filteredApplications.length === 1 ? 'Applicant' : 'Applicants'}
          </Badge>
        </Group>

        {/* FILTROS DE ESTADO */}
        <Paper withBorder p="xs" radius="md">
          <SegmentedControl
            fullWidth
            value={filter}
            onChange={setFilter}
            data={[
              { label: 'All', value: 'ALL' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'In Process', value: 'IN PROCESS' },
              { label: 'Rejected', value: 'REJECTED' },
              { label: 'Hired', value: 'HIRED' },
            ]}
          />
        </Paper>

        {filteredApplications.length === 0 ? (
          <Paper withBorder p={50} radius="md" ta="center">
            <IconInbox size={50} color="gray" stroke={1.5} />
            <Title order={3} mt="md">No applicants found</Title>
            <Text c="dimmed">
              {filter === "ALL" 
                ? "This job offer hasn't received any applications so far." 
                : `There are no applications with status "${filter}"`}
            </Text>
          </Paper>
        ) : (
          <>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              {currentItems.map((app) => (
                <Card key={app._id} withBorder padding="lg" radius="md" shadow="sm">
                  <Group justify="space-between" mb="md">
                    <Badge 
                      color={
                        app.status === "HIRED" ? "green" : 
                        app.status === "REJECTED" ? "red" : 
                        app.status === "IN PROCESS" ? "orange" : "blue"
                      }
                      variant="light"
                    >
                      {app.status}
                    </Badge>
                  </Group>

                  <Stack align="center" gap="xs">
                    <Avatar 
                      src={app.applicant?.logo} 
                      size={80} 
                      radius={80} 
                      color="blue"
                    >
                      {app.applicant?.firstName?.[0]}
                    </Avatar>
                    
                    <Box ta="center">
                      <Text fw={700} size="lg">
                        {app.applicant?.firstName} {app.applicant?.lastName}
                      </Text>
                      <Badge variant="outline" color="gray" size="sm">
                        {app.applicant?.bootcamp}
                      </Badge>
                    </Box>
                  </Stack>

                  <Button 
                    component={Link} 
                    to={`/applications/${app._id}`}
                    fullWidth 
                    mt="xl" 
                    variant="light"
                    rightSection={<IconExternalLink size={16} />}
                  >
                    View Full Application
                  </Button>
                </Card>
              ))}
            </SimpleGrid>

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
              <Center mt="xl">
                <Pagination 
                  total={totalPages} 
                  value={activePage} 
                  onChange={(page) => {
                    setActivePage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  radius="md"
                />
              </Center>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}

export default JobApplicantsPage;
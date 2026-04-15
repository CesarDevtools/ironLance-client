import { useState, useEffect } from "react";
import applicationsService from "../../services/applications.service";
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Badge,
  Avatar,
  Stack,
  Button,
  Loader,
  Center,
  SimpleGrid,
  ThemeIcon,
  Divider,
  Box,
  TextInput,
  Paper,
  ActionIcon,
  SegmentedControl,
  Pagination, 
} from "@mantine/core";
import { Link } from "react-router-dom";
import {
  IconBriefcase,
  IconCalendar,
  IconBuildingCommunity,
  IconChevronRight,
  IconInfoCircle,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";

function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); 
  const [activePage, setActivePage] = useState(1); 
  const itemsPerPage = 5;

  useEffect(() => {
    applicationsService
      .getMyApplications()
      .then((res) => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching applications", err);
        setLoading(false);
      });
  }, []);

  // Lógica de filtrado combinada (Empresa + Status)
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.job?.owner?.companyName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Lógica de paginación
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const currentItems = filteredApplications.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  // Resetear página al filtrar
  useEffect(() => {
    setActivePage(1);
  }, [searchQuery, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "HIRED":
        return "green";
      case "REJECTED":
        return "red";
      case "IN PROCESS":
        return "orange";
      default:
        return "blue"; // PENDING
    }
  };

  if (loading)
    return (
      <Center h="80vh">
        <Loader size="xl" />
      </Center>
    );

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Box>
          <Title order={1}>My Applications</Title>
          <Text c="dimmed">
            Track the status of your job applications and history
          </Text>
        </Box>

        {/* --- FILTERS SECTION --- */}
        {applications.length > 0 && (
          <Stack gap="sm">
            <TextInput
              placeholder="Search by company name..."
              size="md"
              leftSection={<IconSearch size={18} stroke={1.5} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              rightSection={
                searchQuery !== "" && (
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={() => setSearchQuery("")}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                )
              }
            />
            <SegmentedControl
              value={statusFilter}
              onChange={setStatusFilter}
              fullWidth
              data={[
                { label: "All", value: "ALL" },
                { label: "Pending", value: "PENDING" },
                { label: "In Process", value: "IN PROCESS" },
                { label: "Rejected", value: "REJECTED" },
                { label: "Hired", value: "HIRED" },
              ]}
            />
          </Stack>
        )}

        {applications.length === 0 ? (
          <Paper withBorder p="xl" radius="md" ta="center">
            <ThemeIcon
              size={60}
              radius="xl"
              variant="light"
              color="gray"
              mb="md"
            >
              <IconInfoCircle size={30} />
            </ThemeIcon>
            <Title order={3}>No applications yet</Title>
            <Text c="dimmed" mb="xl">
              You haven't applied to any job offers yet. Start exploring the job
              board!
            </Text>
            <Button component={Link} to="/jobs" size="md">
              Browse Jobs
            </Button>
          </Paper>
        ) : filteredApplications.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="xs">
              <Text c="dimmed">No applications found matching your criteria</Text>
              <Button variant="subtle" onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); }}>
                Clear all filters
              </Button>
            </Stack>
          </Center>
        ) : (
          <>
            <SimpleGrid cols={1} gap="md">
              {currentItems.map((app) => (
                <Card
                  key={app._id}
                  withBorder
                  padding="lg"
                  radius="md"
                  shadow="sm"
                >
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Group align="center" gap="md">
                      <Avatar
                        src={app.job?.owner?.logo}
                        size={60}
                        radius="md"
                        variant="light"
                      >
                        <IconBuildingCommunity size={30} />
                      </Avatar>

                      <Stack gap={2}>
                        <Title order={4} style={{ lineHeight: 1 }}>
                          {app.job?.title || "Job position"}
                        </Title>
                        <Text size="sm" fw={700} c="blue">
                          {app.job?.owner?.companyName}
                        </Text>
                        <Group gap="xs" mt={4}>
                          <IconCalendar size={14} color="gray" />
                          <Text size="xs" c="dimmed">
                            Applied on{" "}
                            {dayjs(app.createdAt).format("MMM DD, YYYY")}
                          </Text>
                        </Group>
                      </Stack>
                    </Group>

                    <Stack align="flex-end" gap="xs">
                      <Badge
                        size="lg"
                        variant="light"
                        color={getStatusColor(app.status)}
                      >
                        {app.status}
                      </Badge>
                      <Button
                        variant="subtle"
                        size="xs"
                        component={Link}
                        to={`/jobs/${app.job?._id}`}
                        rightSection={<IconChevronRight size={14} />}
                      >
                        View Job
                      </Button>
                    </Stack>
                  </Group>

                  {app.message && (
                    <>
                      <Divider my="md" variant="dashed" />
                      <Box>
                        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={4}>
                          Your Message:
                        </Text>
                        <Text size="sm" lineClamp={2} fs="italic">
                          "{app.message}"
                        </Text>
                      </Box>
                    </>
                  )}
                </Card>
              ))}
            </SimpleGrid>

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
              <Center mt="xl">
                <Pagination
                  total={totalPages}
                  value={activePage}
                  onChange={(page) => {
                    setActivePage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
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

export default MyApplicationsPage;
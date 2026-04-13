import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jobsService from "../../services/jobs.service";
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Group,
  Button,
  ActionIcon,
  TextInput,
  Stack,
  Badge,
  Menu,
  Paper,
  Center,
  Loader,
  Box,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconSearch,
  IconPlus,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconUsers,
  IconInfoCircle,
  IconBriefcaseOff,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = () => {
    jobsService
      .getMyJobs()
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const openDeleteModal = (id) =>
    modals.openConfirmModal({
      title: "Delete job offer",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this job? This action is irreversible
          and
          <b> all associated applications will be permanently removed</b>.
        </Text>
      ),
      labels: { confirm: "Delete Job", cancel: "No, keep it" },
      confirmProps: { color: "red" },
      onConfirm: () => handleDelete(id),
    });

  const handleDelete = (id) => {
    jobsService
      .deleteJob(id)
      .then(() => {
        setJobs(jobs.filter((job) => job._id !== id));
        notifications.show({
          title: "Job deleted",
          message: "Job and its applications removed successfully",
          color: "red",
          icon: <IconTrash size={16} />,
        });
      })
      .catch((err) => console.error(err));
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <Center h="80vh">
        <Loader size="xl" />
      </Center>
    );

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* HEADER SECTION */}
        <Box>
          <Group justify="space-between" align="flex-end">
            <Box>
              <Title order={2}>Manage Your Job Offers</Title>
              <Text c="dimmed">
                Track, edit, and review applicants for your active positions
              </Text>
            </Box>
            <Button
              component={Link}
              to="/jobs/create"
              leftSection={<IconPlus size={18} />}
              radius="md"
            >
              Create New Job
            </Button>
          </Group>

          <Paper withBorder p="md" mt="xl" radius="md">
            <TextInput
              placeholder="Search by job title..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
          </Paper>
        </Box>

        {/* JOBS GRID */}
        {filteredJobs.length === 0 ? (
          <Paper withBorder p={50} radius="md" ta="center">
            <IconBriefcaseOff size={50} color="gray" stroke={1.5} />
            <Title order={3} mt="md">
              No jobs found
            </Title>
            <Text c="dimmed">
              Try a different search or create your first job offer.
            </Text>
          </Paper>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {filteredJobs.map((job) => (
              <Card
                key={job._id}
                withBorder
                padding="lg"
                radius="md"
                shadow="sm"
              >
                <Group justify="space-between" mb="xs">
                  <Badge variant="light" color={job.active ? "green" : "red"}>
                    {job.active ? "Active" : "Closed"}
                  </Badge>

                  <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDotsVertical size={18} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>Actions</Menu.Label>
                      <Menu.Item
                        component={Link}
                        to={`/jobs/${job._id}/edit`}
                        leftSection={<IconEdit size={14} />}
                      >
                        Edit Job
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={() => openDeleteModal(job._id)} 
                      >
                        Delete Job
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>

                <Stack gap={4} mb="xl">
                  <Title order={4} lineClamp={1}>
                    {job.title}
                  </Title>
                  <Text size="sm" c="dimmed">
                    {job.location} • {job.jobType}
                  </Text>
                </Stack>

                <Stack gap="xs">
                  <Button
                    component={Link}
                    to={`/jobs/${job._id}/applicants`}
                    variant="light"
                    fullWidth
                    leftSection={<IconUsers size={18} />}
                  >
                    View Applicants
                  </Button>
                  <Button
                    component={Link}
                    to={`/jobs/${job._id}`}
                    variant="subtle"
                    fullWidth
                    color="gray"
                    leftSection={<IconInfoCircle size={18} />}
                  >
                    Public View
                  </Button>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}

export default MyJobsPage;

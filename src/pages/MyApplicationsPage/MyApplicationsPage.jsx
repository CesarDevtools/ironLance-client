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
} from "@mantine/core";
import { Link } from "react-router-dom";
import {
  IconBriefcase,
  IconCalendar,
  IconBuildingCommunity,
  IconChevronRight,
  IconInfoCircle,
} from "@tabler/icons-react";
import dayjs from "dayjs";

function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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


  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "green";
      case "REJECTED":
        return "red";
      default:
        return "blue"; 
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
      <Stack gap="lg">
        <Box>
          <Title order={1}>My Applications</Title>
          <Text c="dimmed">
            Track the status of your job applications and history
          </Text>
        </Box>

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
        ) : (
          <SimpleGrid cols={1}>
            {applications.map((app) => (
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
                      <Text size="sm" lineClamp={2} italic>
                        "{app.message}"
                      </Text>
                    </Box>
                  </>
                )}
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}

export default MyApplicationsPage;

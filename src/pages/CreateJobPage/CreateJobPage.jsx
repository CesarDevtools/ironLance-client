import { useState } from "react";
import { useNavigate } from "react-router-dom";
import jobsService from "../../services/jobs.service";
import { 
  Container, Paper, Title, TextInput, Textarea, 
  Button, Group, Stack, Select, TagsInput, 
  NumberInput, Box, Divider, Text, Center
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBriefcase, IconArrowLeft, IconCheck } from "@tabler/icons-react";

function CreateJobPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estado del formulario 
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: [],
    salary: "",
    level: "Intermediate",
    location: "Remote",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    jobsService.createJob(formData)
      .then(() => {
        notifications.show({
          title: "Job Created!",
          message: "Your job offer is now live on the board.",
          color: "green",
          icon: <IconCheck size={16} />,
        });
        navigate("/my-jobs");
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Error",
          message: "Something went wrong. Please check the fields.",
          color: "red",
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container size="sm" py="xl">
      <Button 
        variant="subtle" 
        color="gray" 
        leftSection={<IconArrowLeft size={16} />} 
        onClick={() => navigate("/my-jobs")}
        mb="lg"
      >
        Back to Dashboard
      </Button>

      <Paper withBorder shadow="md" p={30} radius="md">
        <Stack gap="xs" mb="xl">
          <Group gap="xs">
            <IconBriefcase size={28} color="var(--mantine-color-blue-filled)" />
            <Title order={2}>Post a New Job</Title>
          </Group>
          <Text c="dimmed">Fill in the details to find your next Ironhacker</Text>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Job Title"
              placeholder="e.g. Fullstack Developer (React/Node)"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <Textarea
              label="Description"
              placeholder="Tell us about the role and the project..."
              required
              minRows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <TagsInput
              label="Requirements"
              placeholder="Type a skill and press Enter"
              description="Add the main technologies or skills required"
              value={formData.requirements}
              onChange={(val) => setFormData({ ...formData, requirements: val })}
              clearable
            />

            <Divider my="sm" label="Conditions" labelPosition="center" />

            <Group grow>
              <Select
                label="Experience Level"
                data={["Entry", "Intermediate", "Expert"]}
                value={formData.level}
                onChange={(val) => setFormData({ ...formData, level: val })}
                required
              />
              <TextInput
                label="Location"
                placeholder="e.g. Madrid, Berlin or Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Group>

            <TextInput
              label="Salary Range"
              placeholder="e.g. 30k - 40k or Negotiable"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />

            <Button 
              type="submit" 
              fullWidth 
              mt="xl" 
              size="md" 
              loading={loading}
              radius="md"
            >
              Create Job Offer
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default CreateJobPage;
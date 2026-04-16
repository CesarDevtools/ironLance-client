import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jobsService from "../../services/jobs.service";
import { 
  Container, Paper, Title, TextInput, Textarea, 
  Button, Group, Stack, Select, TagsInput, 
  Divider, Text, Loader, Center, Box, Switch, MultiSelect
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy, IconArrowLeft, IconEdit } from "@tabler/icons-react";

// Listado cerrado de opciones
const SKILLS_OPTIONS = [
  "React", "JavaScript", "Node.js", "Express", "MongoDB", "Python", "Data Analysis", 
  "SQL", "UX Design", "UI Design", "Figma", "TypeScript", "HTML", "CSS", "AWS", 
  "Docker", "Cybersecurity", "Machine Learning", "Tableau", "Power BI", "Git"
];

function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: [],
    salary: "",
    level: "Intermediate",
    location: "Remote",
    active: true 
  });

  useEffect(() => {
    jobsService.getJobDetails(id)
      .then((res) => {
        const { title, description, requirements, salary, level, location, active } = res.data;
        setFormData({ title, description, requirements, salary, level, location, active });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Error",
          message: "Could not load job details",
          color: "red",
        });
        navigate("/my-jobs");
      });
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    jobsService.updateJob(id, formData)
      .then(() => {
        notifications.show({
          title: "Job Updated",
          message: "The changes have been saved successfully.",
          color: "blue",
          icon: <IconDeviceFloppy size={16} />,
        });
        navigate("/my-jobs");
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Error",
          message: "Failed to update the job offer.",
          color: "red",
        });
      })
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <Center h="80vh">
        <Loader size="xl" variant="dots" />
      </Center>
    );
  }

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
          <Group justify="space-between">
            <Group gap="xs">
              <IconEdit size={28} color="var(--mantine-color-blue-filled)" />
              <Title order={2}>Edit Job Offer</Title>
            </Group>
            
            <Switch
              label="Active"
              checked={formData.active}
              onChange={(event) => setFormData({ ...formData, active: event.currentTarget.checked })}
              color="green"
            />
          </Group>
          <Text c="dimmed">Update the information for your position</Text>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Job Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <Textarea
              label="Description"
              autosize 
              minRows={4}
              maxRows={15} 
              required
              minRows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

             {/* MultiSelect  */}
            <MultiSelect
              label="Requirements"
              placeholder="Pick skills from the list"
              data={SKILLS_OPTIONS}
              searchable 
              nothingFoundMessage="Skill not found..."
              value={formData.requirements}
              onChange={(val) => setFormData({ ...formData, requirements: val })}
              hidePickedOptions 
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
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Group>

            <TextInput
              label="Salary Range"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />

            <Button 
              type="submit" 
              fullWidth 
              mt="xl" 
              size="md" 
              loading={submitting}
              radius="md"
            >
              Save Changes
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default EditJobPage;
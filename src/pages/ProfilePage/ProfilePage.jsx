import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import authService from "../../services/auth.service"; // Ajusta la ruta según tu proyecto
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
  Select,
  Divider,
  Avatar,
  SimpleGrid,
  Center,
  Loader,
  Box, 
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconUser,
  IconSettings,
  IconLink,
  IconBriefcase,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

function ProfilePage() {
  const { user, authenticateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Estado del formulario
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    about: "",
    bootcamp: "",
    campus: "",
    portfolioUrl: "",
    linkedinUrl: "",
    companyName: "",
    website: "",
    logo: "",
  });

  // 1. Cargar datos actuales del usuario al montar
  useEffect(() => {
    // Aquí podrías hacer un GET /auth/verify para traer los datos frescos del usuario
    // o usar una ruta GET /auth/me si la tienes.
    authService
      .verify()
      .then((res) => {
        const userData = res.data;
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          about: userData.about || "",
          bootcamp: userData.bootcamp || "",
          campus: userData.campus || "",
          portfolioUrl: userData.portfolioUrl || "",
          linkedinUrl: userData.linkedinUrl || "",
          companyName: userData.companyName || "",
          website: userData.website || "",
          logo: userData.logo || "",
        });
        setFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setFetching(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    authService
      .updateProfile(formData)
      .then((response) => {
        // 2. Guardamos el nuevo token recibido
        localStorage.setItem("authToken", response.data.authToken);
        // 3. Refrescamos el contexto para que toda la app vea los cambios (nombre en navbar, etc)
        return authenticateUser();
      })
      .then(() => {
        notifications.show({
          title: "Profile updated",
          message: "Your information has been saved successfully.",
          color: "green",
          icon: <IconCheck size={18} />,
        });
      })
      .catch((err) => {
        notifications.show({
          title: "Update failed",
          message: err.response?.data?.message || "Error updating profile",
          color: "red",
          icon: <IconX size={18} />,
        });
      })
      .finally(() => setLoading(false));
  };

  if (fetching)
    return (
      <Center h="80vh">
        <Loader />
      </Center>
    );

  return (
    <Container size="md" py="xl">
      <Paper withBorder p="xl" radius="md" shadow="sm">
        <Stack gap="xs" mb="xl">
          <Group justify="space-between">
            <Box>
              <Title order={2}>Account Settings</Title>
              <Text c="dimmed" size="sm">
                Manage your public profile and personal information
              </Text>
            </Box>
            <Avatar
              src={user?.role === "COMPANY" ? formData.logo : null}
              size="lg"
              radius="xl"
              color="blue"
            >
              {user?.role === "IRONHACKER" ? formData.firstName[0] : null}
            </Avatar>
          </Group>
          <Divider />
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            {/* --- SECCIÓN: INFORMACIÓN BÁSICA --- */}
            <Title order={4} mb={-10}>
              <IconUser
                size={18}
                style={{ marginBottom: -3, marginRight: 8 }}
              />{" "}
              Basic Info
            </Title>

            {user?.role === "IRONHACKER" ? (
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <TextInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </SimpleGrid>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
                <TextInput
                  label="Logo URL"
                  name="logo"
                  placeholder="https://..."
                  value={formData.logo}
                  onChange={handleChange}
                />
              </SimpleGrid>
            )}

            <Textarea
              label="About / Bio"
              name="about"
              placeholder={
                user?.role === "IRONHACKER"
                  ? "Tell us about your background..."
                  : "Describe your company culture..."
              }
              value={formData.about}
              onChange={handleChange}
              minRows={4}
              maxLength={3000}
              description={`${formData.about.length} / 3000 characters`}
            />

            {/* --- SECCIÓN: ESPECÍFICO POR ROL --- */}
            <Divider />

            {user?.role === "IRONHACKER" ? (
              <>
                <Title order={4} mb={-10}>
                  <IconBriefcase
                    size={18}
                    style={{ marginBottom: -3, marginRight: 8 }}
                  />{" "}
                  Education
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <Select
                    label="Bootcamp"
                    data={[
                      "Web Development",
                      "UX/UI Design",
                      "Cloud Engineering",
                      "Machine Learning",
                      "Data Analytics",
                      "AI Consultant",
                      "Cybersecurity",
                      "Data Engineering",
                    ]}
                    value={formData.bootcamp}
                    onChange={(val) => handleSelectChange("bootcamp", val)}
                  />
                  <Select
                    label="Campus"
                    data={["Madrid", "Barcelona", "Remote"]}
                    value={formData.campus}
                    onChange={(val) => handleSelectChange("campus", val)}
                  />
                </SimpleGrid>

                <Title order={4} mb={-10}>
                  <IconLink
                    size={18}
                    style={{ marginBottom: -3, marginRight: 8 }}
                  />{" "}
                  Links
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <TextInput
                    label="Portfolio URL"
                    name="portfolioUrl"
                    placeholder="https://..."
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                  />
                  <TextInput
                    label="LinkedIn URL"
                    name="linkedinUrl"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                  />
                </SimpleGrid>
              </>
            ) : (
              <>
                <Title order={4} mb={-10}>
                  <IconLink
                    size={18}
                    style={{ marginBottom: -3, marginRight: 8 }}
                  />{" "}
                  Links
                </Title>
                <TextInput
                  label="Official Website"
                  name="website"
                  placeholder="https://..."
                  value={formData.website}
                  onChange={handleChange}
                />
              </>
            )}

            <Group justify="flex-end" mt="xl">
              <Button type="submit" loading={loading} size="md" px="xl">
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default ProfilePage;

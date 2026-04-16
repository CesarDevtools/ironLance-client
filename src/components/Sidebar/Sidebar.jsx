import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { 
  Paper, Title, Text, Group, Stack, Box, Divider, 
  Button, ThemeIcon, Avatar, Progress 
} from "@mantine/core";
import { IconRocket } from "@tabler/icons-react";
import PromoCarousel from "../PromoCarousel/PromoCarousel";

function Sidebar() {
  const { user, isLoggedIn } = useContext(AuthContext);

  // Lógica de progreso 
  const calculateProgress = () => {
    if (!user) return 0;
    let score = 0;
    const totalFields = user.role === "IRONHACKER" ? 8 : 5; 
    
    if (user.role === "IRONHACKER") {
      if (user.firstName) score++;
      if (user.lastName) score++;
      if (user.about) score++;
      if (user.bootcamp) score++;
      if (user.campus) score++;
      if (user.linkedinUrl) score++;
      if (user.portfolioUrl) score++;
      if (user.logo) score++;
    } else {
      if (user.companyName) score++;
      if (user.about) score++;
      if (user.website) score++;
      if (user.logo) score++;
      if (user.email) score++;
    }

    return Math.round((score / totalFields) * 100);
  };

  return (
    <Stack style={{ top: 20 }}>
      <Paper withBorder p="lg" radius="md" shadow="sm">
        {!isLoggedIn ? (
          <Stack align="center" ta="center" py="md">
            <ThemeIcon size={50} radius="xl" variant="light" color="blue">
              <IconRocket size={30} />
            </ThemeIcon>
            <Title order={4}>Boost your career</Title>
            <Text size="sm" c="dimmed">Login to apply for jobs and track your applications.</Text>
            <Button fullWidth component={Link} to="/signup" mt="md" radius="md">Get Started</Button>
          </Stack>
        ) : user.role === "IRONHACKER" ? (
          <Stack align="center" ta="center">
            <Avatar size="xl" radius="xl" color="blue" src={user.logo} />
            <Box>
              <Text fw={700} size="lg">Hello, {user.firstName || "Ironhacker"}!</Text>
              <Text size="xs" c="dimmed">{user.bootcamp || "Student"}</Text>
            </Box>
            <Divider w="100%" />
            <Box w="100%">
              <Group justify="space-between" mb={5}>
                <Text size="xs" fw={700}>Profile Strength</Text>
                <Text size="xs" c="blue" fw={700}>{calculateProgress()}%</Text>
              </Group>
              <Progress value={calculateProgress()} size="sm" radius="xl" color={calculateProgress() === 100 ? "green" : "blue"} striped animated />
              {calculateProgress() < 100 && (
                <Text size="xs" c="dimmed" mt={8}>Complete your profile to stand out!</Text>
              )}
            </Box>
            <Button fullWidth variant="light" size="xs" component={Link} to="/profile">Edit Profile</Button>
          </Stack>
        ) : (
          <Stack align="center" ta="center">
            <Avatar src={user.logo} size="xl" radius="md" />
            <Box>
              <Text fw={700} size="lg">{user.companyName || "Company"}</Text>
              <Text size="xs" c="dimmed">Corporate Account</Text>
            </Box>
            <Divider w="100%" />
            <Button fullWidth component={Link} to="/profile" size="xs">Profile</Button>
            <Button fullWidth variant="light" component={Link} to="/my-jobs" size="xs">Manage My Jobs</Button>
          </Stack>
        )}
      </Paper>

      <Paper withBorder p="md" radius="md" bg="var(--mantine-color-blue-light)" style={{ borderStyle: 'dashed' }}>
        <Text size="xs" c="blue" fw={700} ta="center">Tip: Use skills in search to find specific roles!</Text>
      </Paper>

      <PromoCarousel />
    </Stack>
  );
}

export default Sidebar;
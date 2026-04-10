import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  SimpleGrid,
  Paper,
  ThemeIcon,
  SegmentedControl,
  Stack,
  Center,
  Box,
} from "@mantine/core";
import {
  IconCode,
  IconChartBar,
  IconPalette,
  IconShieldLock,
  IconDatabase,
  IconBrain,
  IconCloud,
  IconSearch,
  IconSend,
  IconCreditCard,
  IconPencilPlus,
  IconUsers,
  IconChecks,
  IconSparkles,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import classes from "./LandingPage.module.css";

const CATEGORIES = [
  { title: "Web Development", icon: IconCode, color: "blue" },
  { title: "Data Analytics", icon: IconChartBar, color: "cyan" },
  { title: "UX/UI Design", icon: IconPalette, color: "pink" },
  { title: "Cybersecurity", icon: IconShieldLock, color: "red" },
  { title: "Data Engineering", icon: IconDatabase, color: "orange" },
  { title: "Machine Learning", icon: IconBrain, color: "grape" },
  { title: "Cloud Engineering", icon: IconCloud, color: "indigo" },
  { title: "AI Consultant", icon: IconSparkles, color: "teal" },
];

function LandingPage() {
  const [userType, setUserType] = useState("IRONHACKER");

  const steps = {
    IRONHACKER: [
      {
        title: "Find clients and remote jobs",
        text: "Create your profile to highlight your best work and attract top clients.",
        icon: IconSearch,
      },
      {
        title: "Submit proposals for work",
        text: "Negotiate rates for the projects you want or reply to invites from clients.",
        icon: IconSend,
      },
      {
        title: "Get paid as you deliver work",
        text: "Land a contract, do the work you love, and get paid on time.",
        icon: IconCreditCard,
      },
    ],
    COMPANY: [
      {
        title: "Posting jobs is always free",
        text: "Create your own and filter talent matches instantly.",
        icon: IconPencilPlus,
      },
      {
        title: "Get proposals and hire",
        text: "Manage the state of your applicants and contact them directly.",
        icon: IconUsers,
      },
      {
        title: "Pay when work is done",
        text: "Release payments after approving work, by milestone or upon project completion.",
        icon: IconChecks,
      },
    ],
  };

  return (
    <Box>
      {/* SECTION 1: HERO */}
      <section className={classes.hero}>
        <Container size="md" py={100}>
          <Title className={classes.heroTitle} ta="center">
            The bridge between{" "}
            <Text
              span
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
              inherit
            >
              Ironhack Talent
            </Text>{" "}
            and the World
          </Title>
          <Text
            className={classes.heroDescription}
            ta="center"
            mt="xl"
            size="xl"
            c="dimmed"
          >
            Stop searching and start hiring graduates from one of the most
            recognized tech schools worldwide. For our fellow Ironhackers,
            IronLance offers the best opportunities to prove what we achieve at
            Ironhack—whether you are a fresh junior or a seasoned senior.
          </Text>
          <Center mt={40}>
            <Group justify="center">
              <Button size="lg" radius="md" component={Link} to="/jobs">
                Explore Opportunities
              </Button>
              <Button
                size="lg"
                radius="md"
                variant="default"
                component={Link}
                to="/signup"
              >
                Join the Community
              </Button>
            </Group>
          </Center>
        </Container>
      </section>

      {/* SECTION 2: CATEGORIES */}
      <section className={classes.sectionGrey}>
        <Container size="lg" py={80}>
          <Title ta="center" mb={50} fw={900}>
            Find freelancers for every type of work
          </Title>
          <SimpleGrid cols={{ base: 2, sm: 2, md: 4 }} spacing="lg">
            {CATEGORIES.map((cat) => (
              <Paper
                key={cat.title}
                withBorder
                p="md"
                radius="md"
                className={classes.categoryCard}
              >
                <ThemeIcon
                  variant="light"
                  size={50}
                  radius="md"
                  color={cat.color}
                >
                  <cat.icon size={30} />
                </ThemeIcon>
                <Text fw={700} mt="md">
                  {cat.title}
                </Text>
                <Text size="sm" c="dimmed" mt={5}>
                  Specialized Ironhackers ready to deliver.
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section>
        <Container size="lg" py={80}>
          <Stack align="center" mb={50}>
            <Title order={2} size="h1">
              How it works?
            </Title>
            <SegmentedControl
              size="md"
              radius="xl"
              value={userType}
              onChange={setUserType}
              data={[
                { label: "For Ironhackers", value: "IRONHACKER" },
                { label: "For Hiring", value: "COMPANY" },
              ]}
              color="blue"
            />
          </Stack>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing={50}>
            {steps[userType].map((step, index) => (
              <div key={index} className={classes.stepItem}>
                <ThemeIcon
                  size={60}
                  radius="xl"
                  variant="filled"
                  color="blue"
                  mb="md"
                >
                  <step.icon size={34} />
                </ThemeIcon>
                <Title order={3} size="h4" mb="sm">
                  {index + 1}. {step.title}
                </Title>
                <Text c="dimmed" lh={1.6}>
                  {step.text}
                </Text>
              </div>
            ))}
          </SimpleGrid>
        </Container>
      </section>
    </Box>
  );
}

export default LandingPage;

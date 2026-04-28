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
        title: "Build Your Professional Portfolio",
        text: "Create a detailed Ironhacker profile showcasing your bootcamp projects, certifications, and technical skills to attract top clients and companies.",
        icon: IconSearch,
      },
      {
        title: "Bid on Remote Jobs & Contracts",
        text: "Respond to job postings from verified companies seeking Ironhack graduates. Negotiate rates, project scope, and timelines directly with clients.",
        icon: IconSend,
      },
      {
        title: "Get Paid Securely",
        text: "Receive payments after delivering milestones. Build your freelance career and earn competitive rates for your Ironhack-certified expertise.",
        icon: IconCreditCard,
      },
    ],
    COMPANY: [
      {
        title: "Post Remote Tech Jobs Free",
        text: "Create detailed job postings targeting Ironhack graduates. Access a pre-screened talent pool of junior and senior developers ready to work.",
        icon: IconPencilPlus,
      },
      {
        title: "Review & Hire Top Talent",
        text: "Browse qualified Ironhacker profiles, compare proposals, and communicate directly with candidates. Make data-driven hiring decisions.",
        icon: IconUsers,
      },
      {
        title: "Manage & Pay Your Team",
        text: "Track project progress through our platform. Release secure payments by milestone or upon project completion. Scale your team globally.",
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
            The Exclusive Marketplace for{" "}
            <Text
              span
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
              inherit
            >
              Ironhack Graduates
            </Text>{" "}
            & Global Tech Companies
          </Title>
          <Text
            className={classes.heroDescription}
            ta="center"
            mt="xl"
            size="xl"
            c="dimmed"
          >
            Connect directly with vetted Ironhack alumni for remote tech jobs, freelance projects, and contract work. For Ironhackers: showcase your bootcamp expertise to leading companies worldwide. For companies: hire pre-screened tech talent with proven coding skills from the world's fastest-growing tech bootcamp.
          </Text>
          <Center mt={40}>
            <Group justify="center">
              <Button size="lg" radius="md" component={Link} to="/jobs">
                Browse Remote Tech Jobs
              </Button>
              <Button
                size="lg"
                radius="md"
                variant="default"
                component={Link}
                to="/signup"
              >
                Join as Ironhacker
              </Button>
            </Group>
          </Center>
        </Container>
      </section>

      {/* SECTION 2: CATEGORIES */}
      <section className={classes.sectionGrey}>
        <Container size="lg" py={80}>
          <Title ta="center" mb={50} fw={900}>
            Specialized Ironhack Expertise Across All Tech Disciplines
          </Title>
          <Text ta="center" size="md" c="dimmed" mb={50}>
            Browse Ironhack graduates by their bootcamp specialization. Each freelancer has completed an intensive, industry-standard training program.
          </Text>
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
                  Ironhack-certified professionals with production-ready skills.
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
              How IronLance Works: Your Path to Success
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

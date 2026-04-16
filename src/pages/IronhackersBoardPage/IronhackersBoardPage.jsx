import { useState, useEffect } from "react";
import usersService from "../../services/users.service";
import { 
  Container, Title, Text, TextInput, SimpleGrid, Paper, Badge, 
  Group, Stack, Box, Divider, Center, Loader, Button, 
  Avatar, Grid, Affix, Transition, ActionIcon, rem,
  Pagination, Tooltip
} from "@mantine/core";
import { useWindowScroll } from '@mantine/hooks'; 
import { 
  IconSearch, IconMapPin, IconArrowUp, IconBrandLinkedin, 
  IconExternalLink, IconSchool, IconUserSearch
} from "@tabler/icons-react";
import Sidebar from "../../components/Sidebar/Sidebar";

function IronhackersBoardPage() {
  const [ironhackers, setIronhackers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [scroll, scrollTo] = useWindowScroll();
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 6; // Un número par suele quedar mejor en rejilla

  useEffect(() => {
    usersService.getIronhackers()
      .then((res) => {
        setIronhackers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching ironhackers", err);
        setLoading(false);
      });
  }, []);

  const filteredIronhackers = ironhackers.filter((hacker) => {
    const searchLower = search.toLowerCase();
    return (
      hacker.firstName?.toLowerCase().includes(searchLower) ||
      hacker.lastName?.toLowerCase().includes(searchLower) ||
      hacker.bootcamp?.toLowerCase().includes(searchLower) ||
      hacker.about?.toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIronhackers = filteredIronhackers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIronhackers.length / itemsPerPage);

  useEffect(() => {
    setActivePage(1);
  }, [search]);

  if (loading) return <Center h="80vh"><Loader size="xl" /></Center>;

  return (
    <Container size="lg" py="xl">
      <Grid gutter="xl">
        
        {/* COLUMNA IZQUIERDA: BOARD DE TALENTO */}
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Stack mb={40}>
            <Group gap="xs">
                <IconUserSearch size={32} color="var(--mantine-color-blue-filled)" />
                <Title order={1} fw={900}>Ironhackers Board</Title>
            </Group>
            <Text c="dimmed" mt={-15}>Discover world-class talent from the Ironhack community.</Text>
            
            <TextInput
              placeholder="Search by name, bootcamp or skills..."
              leftSection={<IconSearch size={18} />}
              size="md"
              w="100%"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              radius="md"
            />
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            {currentIronhackers.length > 0 ? (
              currentIronhackers.map((hacker) => (
                <Paper key={hacker._id} withBorder p="xl" radius="md" shadow="sm" style={{
                  transition: 'transform 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <Stack gap="md">
                    <Group wrap="nowrap">
                      <Avatar src={hacker.logo} size="lg" radius="xl" color="blue">
                        {hacker.firstName?.[0]}
                      </Avatar>
                      <Box style={{ overflow: 'hidden' }}>
                        <Title order={4} lineClamp={1}>{hacker.firstName} {hacker.lastName}</Title>
                        <Group gap={4}>
                            <IconSchool size={14} color="gray" />
                            <Text size="xs" fw={700} c="blue.7">{hacker.bootcamp}</Text>
                        </Group>
                      </Box>
                    </Group>

                    <Text size="sm" c="dimmed" lineClamp={3} style={{ height: '3.6rem' }}>
                      {hacker.about || "No bio provided yet."}
                    </Text>

                    <Group gap="xs">
                        <Badge variant="dot" color="gray" size="sm">
                            <Group gap={4}><IconMapPin size={10} />{hacker.campus}</Group>
                        </Badge>
                    </Group>

                    <Divider variant="dotted" />

                    <Group justify="space-between">
                        <Group gap="sm">
                            {hacker.linkedinUrl && (
                                <Tooltip label="LinkedIn Profile">
                                    <ActionIcon 
                                        component="a" 
                                        href={hacker.linkedinUrl} 
                                        target="_blank" 
                                        variant="light" 
                                        color="blue" 
                                        radius="md"
                                    >
                                        <IconBrandLinkedin size={18} />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                            {hacker.portfolioUrl && (
                                <Tooltip label="Portfolio">
                                    <ActionIcon 
                                        component="a" 
                                        href={hacker.portfolioUrl} 
                                        target="_blank" 
                                        variant="light" 
                                        color="teal" 
                                        radius="md"
                                    >
                                        <IconExternalLink size={18} />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </Group>
                        
                        <Button 
                            variant="outline" 
                            size="xs" 
                            radius="xl"
                            onClick={() => window.location.href = `mailto:${hacker.email || ''}`}
                        >
                            Contact
                        </Button>
                    </Group>
                  </Stack>
                </Paper>
              ))
            ) : (
              <Grid.Col span={2}>
                <Center py="xl"><Text c="dimmed">No Ironhackers found matching your search.</Text></Center>
              </Grid.Col>
            )}
          </SimpleGrid>

          {totalPages > 1 && (
            <Center mt={40}>
              <Pagination 
                total={totalPages} 
                value={activePage} 
                onChange={(page) => {
                  setActivePage(page);
                  scrollTo({ y: 0 }); 
                }} 
                radius="md"
              />
            </Center>
          )}
        </Grid.Col>

        {/* COLUMNA DERECHA REUTILIZADA */}
        <Grid.Col span={3} visibleFrom="md">
          <Sidebar />
        </Grid.Col>

      </Grid>

      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <ActionIcon
              color="blue"
              size="xl"
              radius="xl"
              variant="filled"
              style={transitionStyles}
              onClick={() => scrollTo({ y: 0 })}
            >
              <IconArrowUp style={{ width: rem(16), height: rem(16) }} />
            </ActionIcon>
          )}
        </Transition>
      </Affix>

    </Container>
  );
}

export default IronhackersBoardPage;
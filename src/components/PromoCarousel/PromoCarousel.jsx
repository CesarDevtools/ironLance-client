import { useState, useEffect } from "react";
import { Paper, Text, Stack, Button, ThemeIcon, Transition, Box, useMantineColorScheme } from "@mantine/core";
import { IconSchool, IconQuote, IconArrowRight } from "@tabler/icons-react";

function PromoCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current === 0 ? 1 : 0));
    }, 8000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <Box 
      style={{ 
        height: 200, 
        position: 'relative', 
        overflow: 'hidden', 
        borderRadius: '12px',
        boxShadow: "var(--mantine-shadow-md)", 
        border: isDark ? "1px solid var(--mantine-color-dark-4)" : "none"
      }}
    >
      
      {/* SLIDE 1: BOOTCAMPS  */}
      <Transition mounted={activeSlide === 0} transition="slide-left" duration={1000}>
        {(styles) => (
          <Paper 
            p="xl" 
            withBorder
            style={{ 
              ...styles, 
              position: 'absolute', 
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Stack align="flex-start" gap={8}>
              <ThemeIcon 
                variant="light"
                color="cyan" 
                radius="md" 
                size="lg" 
                shadow="sm"
              >
                <IconSchool size={22} />
              </ThemeIcon>
              <Box>
                <Text size="md" fw={800} c={"cyan"} style={{ lineHeight: 1.2 }}>
                  Elevate your tech career
                </Text>
                <Text size="xs" c={isDark ? "gray.4" : "cyan"} fw={500} mt={4}>
                  Master the most in-demand skills with Ironhack's methodology.
                </Text>
              </Box>
              <Button 
                component="a" 
                href="https://www.ironhack.com" 
                target="_blank" 
                variant="light" 
                color="cyan"
                size="xs" 
                radius="md"
                rightSection={<IconArrowRight size={14} />}
                mt="xs"
                style={{ boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.05)' }}
              >
                View Programs
              </Button>
            </Stack>
          </Paper>
        )}
      </Transition>

      {/* SLIDE 2: MOTIVATIONAL */}
      <Transition mounted={activeSlide === 1} transition="slide-right" duration={1000}>
        {(styles) => (
          <Paper 
            p="xl" 
            style={{ 
              ...styles, 
              position: 'absolute', 
              inset: 0,
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              border: 'none'
            }}
          >
            <IconQuote 
              size={80} 
              style={{ position: 'absolute', right: -10, top: -10, opacity: 0.1, color: 'white' }} 
            />
            
            <Stack gap={10}>
              <Box style={{ borderLeft: '3px solid var(--mantine-color-blue-4)', paddingLeft: '15px' }}>
                <Text size="lg" fw={700} italic c="white" style={{ lineHeight: 1.3, letterSpacing: '-0.5px' }}>
                  "Success is the sum of small efforts, repeated day in and day out."
                </Text>
              </Box>
              <Box>
                <Text size="xs" c="blue.1" fw={600} opacity={0.8} tt="uppercase" lts={1}>
                  Keep pushing forward
                </Text>
                <Text size="xs" c="blue.2" opacity={0.6}>
                  Your next big opportunity is just one click away.
                </Text>
              </Box>
            </Stack>
          </Paper>
        )}
      </Transition>

    </Box>
  );
}

export default PromoCarousel;
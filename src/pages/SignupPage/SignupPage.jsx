import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/auth.service';
import { 
  TextInput, PasswordInput, SegmentedControl, Button, Paper, 
  Title, Text, Container, SimpleGrid, Box 
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'IRONHACKER',
    firstName: '',
    lastName: '',
    companyName: '',
    website: '',
    linkedinUrl: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.signup(formData);
      notifications.show({
        title: 'Success!',
        message: 'Account created correctly. Please login.',
        color: 'green',
      });
      navigate('/login');
    } catch (error) {
      const errorDescription = error.response?.data?.message || "Something went wrong";
      notifications.show({
        title: 'Error',
        message: errorDescription,
        color: 'red',
      });
    }
  };

  return (
    <Container size={460} my={40}>
      <Title ta="center" fw={900} style={{ color: '#203d54' }}>
        Join IronLance!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Text component={Link} to="/login" c="blue" fw={700}>
          Login here
        </Text>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Text size="sm" fw={500} mb={10}>How do you want to join?</Text>
        <SegmentedControl
          fullWidth
          value={formData.role}
          onChange={(value) => setFormData({ ...formData, role: value })}
          color="blue"
          data={[
            { label: 'Ironhacker', value: 'IRONHACKER' },
            { label: 'Company', value: 'COMPANY' },
          ]}
          mb="xl"
        />

        <form onSubmit={handleSubmit}>
          <SimpleGrid cols={formData.role === 'IRONHACKER' ? 2 : 1} mb="md">
            {formData.role === 'IRONHACKER' ? (
              <>
                <TextInput 
                  label="First Name" name="firstName" required
                  value={formData.firstName} onChange={handleChange} 
                />
                <TextInput 
                  label="Last Name" name="lastName" required
                  value={formData.lastName} onChange={handleChange} 
                />
              </>
            ) : (
              <TextInput 
                label="Company Name" name="companyName" required
                value={formData.companyName} onChange={handleChange} 
              />
            )}
          </SimpleGrid>

          <TextInput 
            label="Email" name="email" placeholder="hello@ironhack.com" required mb="md" 
            value={formData.email} onChange={handleChange}
          />
          <PasswordInput 
            label="Password" name="password" required mb="md" 
            value={formData.password} onChange={handleChange}
          />

          {formData.role === 'IRONHACKER' ? (
            <TextInput 
              label="LinkedIn Profile" name="linkedinUrl" placeholder="URL" mb="md" 
              value={formData.linkedinUrl} onChange={handleChange}
            />
          ) : (
            <TextInput 
              label="Website" name="website" placeholder="https://..." mb="md" 
              value={formData.website} onChange={handleChange}
            />
          )}

          <Button type="submit" fullWidth mt="xl" size="md" color="blue">
            Create Account
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default SignupPage;
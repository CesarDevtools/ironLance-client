import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import authService from '../../services/auth.service';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Paper, 
  Title, 
  Text, 
  Container, 
  Anchor 
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Llamada al servicio (POST /api/auth/login)
      const response = await authService.login({ email, password });
      
      // 2. Guardamos el token recibido
      storeToken(response.data.authToken);
      
      // 3. Validamos el token para cargar los datos del usuario en el Contexto
      await authenticateUser();
      
      notifications.show({
        title: 'Welcome back!',
        message: 'You have logged in successfully.',
        color: 'blue',
      });

      // 4. Redirigimos a la home
      navigate('/');
    } catch (error) {
      const errorDescription = error.response?.data?.message || "Unable to authenticate user";
      notifications.show({
        title: 'Login Error',
        message: errorDescription,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={80}>
      <Title ta="center" fw={900} style={{ color: '#203d54' }}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don't have an account yet?{' '}
        <Anchor component={Link} to="/signup" size="sm" fw={700}>
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput 
            label="Email" 
            placeholder="hello@ironhack.com" 
            name="email"
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput 
            label="Password" 
            placeholder="Your password" 
            name="password"
            required 
            mt="md" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button 
            type="submit" 
            fullWidth 
            mt="xl" 
            color="blue"
            loading={loading} // Feedback de carga
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginPage;
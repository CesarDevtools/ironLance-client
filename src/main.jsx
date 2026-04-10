import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/notifications/styles.css';

import App from "./App.jsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProviderWrapper } from "./context/auth.context.jsx";


const ironhackTheme = createTheme({
  primaryColor: 'cyan', 
  colors: {
    brand: ['#eef3f7', '#dbe6ee', '#b7cde0', '#8fb0cf', '#628db9', '#4672a1', '#37597d', '#203d54', '#1a3246', '#122331'],
  },
  defaultRadius: 'md',
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider theme={ironhackTheme}>
      <Notifications />
      <ModalsProvider>
        <Router>
          <AuthProviderWrapper>
            <App />
          </AuthProviderWrapper>
        </Router>
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>,
);

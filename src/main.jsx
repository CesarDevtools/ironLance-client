import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/notifications/styles.css';

import App from "./App.jsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProviderWrapper } from "./context/auth.context";


const theme = createTheme({
  primaryColor: "blue",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
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

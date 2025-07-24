import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationContextProvider } from "./reducers/notificationContext";
import { UserContextProvider } from "./reducers/userContext";
import { BrowserRouter } from "react-router-dom";

import { Container } from "@mui/material";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      <BrowserRouter>
        <UserContextProvider>
          <Container>
            <App />
          </Container>
        </UserContextProvider>
      </BrowserRouter>
    </NotificationContextProvider>
  </QueryClientProvider>,
);
<App />;

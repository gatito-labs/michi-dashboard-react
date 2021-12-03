// In ThemedCustomRouteNoLayout.js
import { ThemeProvider } from "@material-ui/core/styles";
import { Layout } from "react-admin";
import { theme } from "./theme";
import IframeEnv from "./iframeEnv";

const ThemedCustomRouteNoLayout = (props) => {
  return (
    <ThemeProvider theme={theme}>
    <Layout {...props} theme={theme}>
      <IframeEnv />
    </Layout>
    </ThemeProvider>
  );
};

export default ThemedCustomRouteNoLayout;
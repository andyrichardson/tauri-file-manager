import styled, { createGlobalStyle } from "styled-components";
import {View} from "./components/View";
import { AppProvider } from "./context";

export const App = () => (
  <AppProvider>
	<View />
	<GlobalStyle />
  </AppProvider>
);

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
	}
`;
const T = styled.p`
  background: red;
`;

import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { SourceProvider } from "./context/SourceContext";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/86674/ticketsubgraph/version/latest",
  cache: new InMemoryCache(),
});
function App() {
  return (
    <>
      <SourceProvider>
        <ApolloProvider client={client}>
          <RouterProvider router={router} />
        </ApolloProvider>
      </SourceProvider>
    </>
  );
}

export default App;

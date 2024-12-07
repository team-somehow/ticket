import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { SourceProvider } from "./context/SourceContext";

function App() {
  return (
    <SourceProvider>
      <RouterProvider router={router} />
    </SourceProvider>
  );
}

export default App;

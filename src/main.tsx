import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/theme.css";
import "./styles/typography.css";

createRoot(document.getElementById("root")!).render(<App />);

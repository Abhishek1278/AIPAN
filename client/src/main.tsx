import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import sample products utility
import './utils/addSampleProducts';

createRoot(document.getElementById("root")!).render(<App />);

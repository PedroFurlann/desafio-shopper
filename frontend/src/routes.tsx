import { Route, Routes as RoutesDOM } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";

export function Routes() {
  return (
    <RoutesDOM>
      <Route path="/" element={<Home />} />
      <Route path="/history" element={<History />} />
    </RoutesDOM>
  );
}
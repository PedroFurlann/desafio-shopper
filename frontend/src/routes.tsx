import { Route, Routes as RoutesDOM } from "react-router-dom";
import Home from "./pages/Home";

export function Routes() {
  return (
    <RoutesDOM>
      <Route path="/" element={<Home />} />
    </RoutesDOM>
  );
}
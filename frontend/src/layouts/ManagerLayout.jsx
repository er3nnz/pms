import { Outlet } from "react-router-dom";
import ManagerHeader from "../components/ManagerHeader";

export default function ManagerLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ManagerHeader/>
      <main style={{ flex: "1"}}>
        <Outlet />
      </main>
    </div>
  );
} 
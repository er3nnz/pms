import { Outlet } from "react-router-dom";
import EmployeeHeader from "../components/EmployeeHeader";

export default function EmployeeLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <EmployeeHeader/>
      <main style={{ flex: "1"}}> 
        <Outlet />
      </main>
    </div>
    
  );
}
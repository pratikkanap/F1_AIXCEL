import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./pages/Hero";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import Standings from "./pages/Standings";
import Schedule from "./pages/Schedule";
import Circuit from "./pages/Circuit";
import Summary from "./pages/Summary";
import LearnF1 from "./pages/LearnF1";
import Telemetry from "./pages/Telemetry";
import DriverDetail from "./pages/DriverDetail";
import TeamDetail from "./pages/TeamDetail";
import ChatPanel from "./components/ChatPanel";
import "./App.css";

function App() {
  return (
    <div className="f1-app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/results" element={<Dashboard />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/driver/:name" element={<DriverDetail />} />
<Route path="/team/:name" element={<TeamDetail />} />
        <Route path="/telemetry" element={<Telemetry />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/circuit" element={<Circuit />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/learn" element={<LearnF1 />} />
      </Routes>
      <ChatPanel />
    </div>
  );
}

export default App;
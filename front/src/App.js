import {HashRouter, Route, Routes} from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import AdminPanel from "./pages/AdminPanel";
import { useState } from "react";
import Settings from "./pages/Settings";
import Methods from "./pages/Methods";
import EditUser from "./pages/EditUser";

function App() {
    const [user, setUser] = useState({
        access: 0,
        admin: 0
    })
  return (
      <HashRouter>
          <Routes>
              <Route path="/" element={<Layout setGlobalUser={setUser} />}>
                  <Route index element={<Home user={user} />} />
                  <Route path="admin" element={<AdminPanel user={user} />} />
                  <Route path="methods" element={<Methods user={user} />} />
                  <Route path="settings" element={<Settings user={user} />} />
                  <Route path="edit/:id" element={<EditUser user={user} />} />
                  <Route path="*" element={<NoPage />} />
              </Route>
              <Route path="login" element={<Login />} />
              <Route path="logout" element={<Logout />} />
          </Routes>
      </HashRouter>
  );
}

export default App;

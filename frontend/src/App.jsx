import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { individualsRoutes } from "./pages/Individuals/individualsRoutes";
import { businessesRoutes } from "./pages/Businesses/businessesRoutes";

function App() {
  return (
    <>
      {/* ── Anti-Phishing Disclaimer Banner ──────────────────── */}
      <div
        style={{
          background: "#fef3c7",
          color: "#92400e",
          textAlign: "center",
          padding: "8px 16px",
          fontSize: "13px",
          fontWeight: 500,
          borderBottom: "1px solid #fde68a",
          position: "relative",
          zIndex: 9999,
        }}
      >
        This is a <strong>student educational project</strong> — not
        affiliated with Coinbase, Inc. No real transactions occur here.
      </div>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="cryptocurrencies" element={<Explore />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="register" element={<SignUp />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="login" element={<SignIn />} />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      {individualsRoutes.map((route, i) => (
        <Route
          key={`ind-${i}`}
          path={route.path === "" ? undefined : route.path}
          index={route.index}
          element={route.element}
        />
      ))}
      {businessesRoutes.map((route, i) => (
        <Route
          key={`bus-${i}`}
          path={route.path === "" ? undefined : route.path}
          index={route.index}
          element={route.element}
        />
      ))}
    </Routes>
    </>
  );
}

export default App;

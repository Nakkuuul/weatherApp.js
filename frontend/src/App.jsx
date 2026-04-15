import { useState } from "react";
import AuthPage from "./components/AuthPage";
import WeatherDashboard from "./components/WeatherDashboard";
import Toast from "./components/Toast";

export default function App() {
  const [auth, setAuth] = useState(null); // { token, email }
  const [toast, setToast] = useState(null); // { message, type }

  function showToast(message, type = "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleAuthSuccess({ token, email }) {
    setAuth({ token, email });
    showToast(`Welcome, ${email}`, "success");
  }

  function handleLogout() {
    setAuth(null);
  }

  return (
    <>
      {auth ? (
        <WeatherDashboard
          token={auth.token}
          email={auth.email}
          onLogout={handleLogout}
          showToast={showToast}
        />
      ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} showToast={showToast} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}

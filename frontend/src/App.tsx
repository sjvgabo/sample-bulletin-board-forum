import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Loading } from "./components/Loading";
import useInit from "./hooks/useInit";
import BoardPage from "./routes/BoardPage";
import ErrorPage from "./routes/ErrorPage";
import HomePage from "./routes/HomePage";
import LoginPage from "./routes/LoginPage";
import NavigationPage from "./routes/NavigationPage";
import ProfilePage from "./routes/ProfilePage";
import RegistrationPage from "./routes/RegistrationPage";
import ThreadPage from "./routes/ThreadPage";
import { StoreProvider } from "./stores";

function App() {
  const { ready, store } = useInit();

  if (!ready || !store) {
    return <Loading />;
  }

  return (
    <StoreProvider value={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavigationPage />}>
            <Route path="*" element={<ErrorPage />} />
            <Route path="/" element={<HomePage />} />
            <Route
              path="/topic/:topicPk/board/:boardPk"
              element={<BoardPage />}
            />
            <Route
              path="/topic/:topicPk/board/:boardPk/thread/:threadPk"
              element={<ThreadPage />}
            />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile/:userPk" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;

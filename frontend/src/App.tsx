import React from "react";

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useInit from "./hooks/useInit";
import { StoreProvider } from "./stores";
import { Loading } from "./components/Loading";
import ErrorPage from "./routes/errorpage";
import NavigationPage from "./routes/navigationpage";
import Homepage from "./routes/homepage";
import BoardPage from "./routes/boardpage";
import ThreadPage from "./routes/threadpage";
import RegistrationPage from "./routes/registrationpage";
import LoginPage from "./routes/loginpage";
import ProfilePage from "./routes/profilepage";

function App() {
  const { ready, store } = useInit();

  if (!ready || !store) {
    return <Loading />
  }

  return (
    <StoreProvider value={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavigationPage />}>
            <Route path="*" element={<ErrorPage />} />
            <Route path="/" element={<Homepage />} />
            <Route path="/topic/:topicPk/board/:boardPk" element={<BoardPage />} />
            <Route path="/topic/:topicPk/board/:boardPk/thread/:threadPk" element={<ThreadPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
        
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;

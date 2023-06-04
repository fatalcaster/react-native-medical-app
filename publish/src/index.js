import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import NotFoundPage from "./NotFound";
import Home from "./Home";
import Create from "./Create";
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="document/new" element={<Create />} />
        {/* TODO: Add loading screen and not found page for id */}
        <Route path="document/:id" element={<App />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* <Route index element={<Home />} /> */}
        {/* <Route path="teams" element={<Teams />}> */}
        {/* <Route path=":teamId" element={<Team />} /> */}
        {/* <Route path="new" element={<NewTeamForm />} /> */}
        {/* <Route index element={<LeagueStandings />} /> */}

        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

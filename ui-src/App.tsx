import React from "react";
import "./App.css";

import TestButton from "./components/TestButton";
import ResetImage from "./components/ResetImage";
import PluginInfo from "./components/PluginInfo";

export default function App() {
  onmessage = (event) => {
  }

  return (
    <main>
      {/* <TestButton /> */}
      <ResetImage />
      <PluginInfo />
    </main>
  );
}
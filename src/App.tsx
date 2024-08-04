import React from "react";
import SafeWordAI from "./SafeWordAI";
import { Analytics } from "@vercel/analytics/react";

const App: React.FC = () => {
  return (
    <div className="App">
      <SafeWordAI />
      <Analytics />
    </div>
  );
};

export default App;

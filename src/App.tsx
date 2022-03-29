import { FC } from "react";

import { PhoneNumbers } from "./PhoneNumbers";

import "antd/dist/antd.min.css";
import "./App.css";

const App: FC = () => {
  const addFunction = (value: boolean): void => {
    console.log("addFunction -> value", value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <PhoneNumbers addFunction={addFunction} />
      </header>
    </div>
  );
};

export default App;

import React from "react";
import { render, screen } from "@testing-library/react";

import App from "./App";

describe("App-component tests", () => {
  global.matchMedia = global.matchMedia || function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

  it("expect 1 + 1 to be 2", () => {
    const calcResult = 1 + 1;
    const expResult = 2;

    expect(calcResult).toBe(expResult);
  })
});

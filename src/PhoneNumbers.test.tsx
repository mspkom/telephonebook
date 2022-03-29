import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";
import { PhoneNumbers } from "./PhoneNumbers";

describe("PhoneNumbers-component tests", (): void => {
  global.matchMedia =
    global.matchMedia ||
    function () {
      return {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      };
    };

  const addFunction = jest.fn();

  it('expect to render correctly', () => {
    expect(<PhoneNumbers addFunction={addFunction} />).toMatchSnapshot();
  });

  it("expect form-wrapper to be in the document", () => {
    render(<PhoneNumbers addFunction={addFunction}  />);
    const formWrapper = screen.getByTestId("form-wrapper");

    expect(formWrapper).toBeInTheDocument();
  });

  it("renders headline", () => {
    render(<PhoneNumbers addFunction={addFunction} />);

    expect(screen.getByText("TelephoneBook")).toBeInTheDocument();
  });

  it("expect to find add button", () => {
    render(<PhoneNumbers addFunction={addFunction} />);
    const button = screen.getByTestId("add-button");

    expect(button).toBeInTheDocument();
  });

  it("expect add button to work", () => {
    render(<PhoneNumbers addFunction={addFunction} />);
    const button = screen.getByTestId("add-button");

    userEvent.click(button)

    expect(button).toBeDisabled();
    expect(addFunction).toBeCalled();
  });

  it("expect form-element to be in the document", () => {
    render(<PhoneNumbers addFunction={addFunction} />);
    const formElement = screen.getByTestId("form-element");

    expect(formElement).toBeInTheDocument();
  });
});

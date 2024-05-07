import { render, screen, fireEvent } from "@testing-library/react";
import { generateDate } from "./utils/index.ts";
import FlightContext from "./machines/flightMachine.ts";
import App from "./App";

const YESTERDAY = generateDate(-1);

describe("Experimenting", () => {
  it("renders headline", () => {
    render(
      <FlightContext.Provider>
        <App />
      </FlightContext.Provider>
    );
    const departInput = screen.getByLabelText("Depart Date");
    const bookButton = screen.getByRole("button");
    fireEvent.change(departInput, { target: { value: YESTERDAY } });
    expect(bookButton).toBeDisabled();
    screen.debug();
  });
});

describe("Experimenting 2", () => {
  it("renders headline 2", () => {
    render(
      <FlightContext.Provider>
        <App />
      </FlightContext.Provider>
    );
    const departInput = screen.getByLabelText("Depart Date");
    const bookButton = screen.getByRole("button");
    fireEvent.change(departInput, { target: { value: YESTERDAY } });
    expect(bookButton).toBeDisabled();
    screen.debug();
  });
});

describe("Experimenting 3", () => {
  it("renders headline 3", () => {
    render(
      <FlightContext.Provider>
        <App />
      </FlightContext.Provider>
    );
    const flightInput = screen.getByDisplayValue("one way flight");
    const returnInput = screen.getByLabelText("Return Date");
    const bookButton = screen.getByRole("button");
    fireEvent.change(flightInput, { target: { value: "round trip" } });
    fireEvent.change(returnInput, { target: { value: YESTERDAY } });
    expect(bookButton).toBeDisabled();
    screen.debug();
  });
});

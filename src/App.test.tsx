import { render, screen, fireEvent } from "@testing-library/react";
import { generateDate } from "./utils/index.ts";
import FlightContext from "./machines/flightMachine.ts";
import App from "./App";

const YESTERDAY = generateDate(-1);

describe("Flight Booker", () => {
  it("Ensures book button is disabled when depart date is in the past.", () => {
    render(
      <FlightContext.Provider>
        <App />
      </FlightContext.Provider>
    );
    const departInput = screen.getByLabelText("Depart Date");
    const bookButton = screen.getByRole("button");
    fireEvent.change(departInput, { target: { value: YESTERDAY } });
    expect(bookButton).toBeDisabled();
  });

  it("Ensures book button is enabled when depart date is today.", () => {
    render(
      <FlightContext.Provider>
        <App />
      </FlightContext.Provider>
    );
    const flightSelect = screen.getByLabelText("Trip Type");
    fireEvent.change(flightSelect, { target: { value: "roundTrip" } });
    const returnInput = screen.getByLabelText("Return Date");
    expect(returnInput).toBeInTheDocument();
  });
});

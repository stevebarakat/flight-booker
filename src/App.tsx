import FlightContext, { TODAY } from "./machines/flightMachine";
import { BookButton, Header } from "./components";
import { DateSelector, TripSelector } from "./components";
import { format } from "date-fns";

const dateFormat = "EEEE MMMM do, yyyy";

export default function App() {
  const { send } = FlightContext.useActorRef();
  const state = FlightContext.useSelector((state) => state);
  const { departDate, returnDate } = state.context;
  const isRoundTrip = state.context.tripType === "roundTrip";
  const isBooking = state.matches("booking");
  const isBooked = state.matches("booked");

  const isValidDepartDate = departDate >= TODAY;
  const isValidReturnDate = returnDate >= departDate;

  console.log("isRoundTrip", isRoundTrip);
  console.log("state.context", state.context.tripType);

  const successMessage = (
    <>
      <Header>Booked</Header>
      <p>You booked a {isRoundTrip ? "round trip" : "one way"} flight. </p>
      <p>
        <span>Departs:</span> {format(departDate, dateFormat)}
      </p>
      {isRoundTrip && (
        <p>
          <span>Returns:</span> {format(returnDate, dateFormat)}
        </p>
      )}
    </>
  );

  const ui = (
    <>
      <Header>Book Flight</Header>
      <TripSelector
        id="Trip Type"
        isBooking={isBooking}
        isBooked={isBooked}
        tripType={isRoundTrip ? "roundTrip" : "oneWay"}
      />
      <DateSelector
        id="Depart Date"
        value={departDate}
        isValidDate={isValidDepartDate}
        disabled={isBooking}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          send({
            type: "CHANGE_DEPART_DATE",
            value: e.currentTarget.value,
          })
        }
      />
      {isRoundTrip && (
        <DateSelector
          id="Return Date"
          value={returnDate}
          isValidDate={isValidReturnDate}
          disabled={!isRoundTrip || isBooking}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            send({
              type: "CHANGE_RETURN_DATE",
              value: e.currentTarget.value,
            })
          }
        />
      )}
      <BookButton
        eventType={isRoundTrip ? "BOOK_RETURN" : "BOOK_DEPART"}
        isBooking={isBooking}
        isBooked={isBooked}
      />
    </>
  );

  return <main>{isBooked ? successMessage : ui}</main>;
}

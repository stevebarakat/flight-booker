import { setup, assign, assertEvent, fromPromise } from "xstate";
import { createActorContext } from "@xstate/react";
import { generateDate } from "../utils";
import { sleep } from "../utils";

export const TODAY = generateDate(0);
const TOMORROW = generateDate(1);

export const flightBookerMachine = setup({
  types: {
    context: {} as FlightData,
    events: {} as
      | { type: "BOOK_DEPART" }
      | { type: "BOOK_RETURN" }
      | { type: "CHANGE_TRIP_TYPE"; tripType: "oneWay" | "roundTrip" }
      | { type: "CHANGE_DEPART_DATE"; value: string }
      | { type: "CHANGE_RETURN_DATE"; value: string },
  },
  actions: {
    setDepartDate: assign(({ event }) => {
      assertEvent(event, "CHANGE_DEPART_DATE");
      return { departDate: event.value };
    }),
    setReturnDate: assign(({ event }) => {
      assertEvent(event, "CHANGE_RETURN_DATE");
      return { returnDate: event.value };
    }),
    setTripType: assign(({ event }) => {
      assertEvent(event, "CHANGE_TRIP_TYPE");
      return { tripType: event.tripType };
    }),
  },
  actors: {
    Booker: fromPromise(() => {
      return sleep(1000);
    }),
  },
  guards: {
    "isValidDepartDate?": ({ context: { departDate } }) => {
      return departDate >= TODAY;
    },
    "isValidReturnDate?": ({ context: { departDate, returnDate } }) => {
      return departDate >= TODAY && returnDate > departDate;
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDMA2BLKALALgIQHsCBrMAJwFkBDAYy3QDswA6WOyAVwwamYKYDqVAJ4BiAMIAJAIIA5AOIBRAPoAVAEoBJAApqAmtsUBtAAwBdRKAAOBWOhzp+lkAA9EARgBMAVgDMzAHZfABZPAM8ATgD3EwjPTwAaEGFEX08ANmZvaPiIiODvYIDg9ICAXzKktExcQhJyajpGFjYsTm4oUTwAeW6AaWUAEUVtaXVVUwskEBs7BydptwR3CJMs728faPT3AoAOYL2klIRPEuZfPa8fbz3vCN8A7wqqjGx8IlJKWnomVnYIFxGLwyAQOAwIKoyOgrBIZAoVBodPpDJNnLN7I4GM4luk-Mx8rsTLs9iZgsF3O5jqkMlkcpF8oViqUXiBqu86l9Gr8WgCgTxmKDwZDobCpHIlMp1IpVABVdSyIbSVTGczo2yYhagJYBdL+Xy3EzpK5FGIBI7JRAbPZ0655ApFIqs9m1T4NH7Nf5tQEdLq9AbSuUKtHTDHzbGLRB7AIRZilAImPa+ZMpg3U5YmXzuQLRorW+6PZ6VNlvV31b5NP6tdrAuESlTDUbjJUqkPWDXhnGIdImdPmzzO0sfcvcz0AI0+tYg-BYjAAbvVmC7h1yPX8JyRgQh5wQaFRw5M2zMO1iuwhvO4AhdUzfk9505SMoOaiv3ZWWBviLXyKCyMwrKg+7IAQZAALZLkOnJvjyzCfluO57ge5hHmGp6Ruel7MEmt6pveloIKSEQVMWDAEBAcDOMuUEVjy6pzGh2oeIk+EALQ2qE0YJiYhSbH49zPhybo0Z61Y+sCdGahGjEID23gEhSwTEocZIUlS+G7MEtq5IyjrpMEAllqu75ejWAozkIJztvRWquFGcQXIaxq7NEJi6umnghFpDIOsy+nFlRQmjlWfIdIKYIQlCMISZ26F7BE2YGqSTmmq56TpiUmTZHaOnMuU-mQYFa4fpOPDRQxtkYb2+FxAO+UvtRQXFfUEBlTZSyFBED6eLsxFlEAA */
  id: "flightBookerMachine",
  context: {
    departDate: TODAY,
    returnDate: TOMORROW,
    tripType: "oneWay",
  },
  initial: "scheduling",
  states: {
    scheduling: {
      initial: "oneWay",
      on: {
        CHANGE_DEPART_DATE: {
          actions: {
            type: "setDepartDate",
          },
        },

        BOOK_DEPART: {
          target: "booking",
          guard: {
            type: "isValidDepartDate?",
          },
        },

        BOOK_RETURN: {
          target: "booking",
          guard: {
            type: "isValidReturnDate?",
          },
        }
      },
      states: {
        oneWay: {
          on: {
            CHANGE_TRIP_TYPE: {
              target: "roundTrip",
              actions: {
                type: "setTripType",
                tripType: "roundTrip",
              },
            }
          },
        },
        roundTrip: {
          on: {
            CHANGE_TRIP_TYPE: {
              target: "oneWay",
              actions: {
                type: "setTripType",
                tripType: "oneWay",
              },
            },

            CHANGE_RETURN_DATE: {
              actions: {
                type: "setReturnDate",
              },
            }
          },
        },
      },
    },
    booking: {
      invoke: {
        src: "Booker",
        onDone: {
          target: "booked",
        },
        onError: {
          target: "scheduling",
        },
      },
    },
    booked: {
      type: "final",
    },
  },
});

export default createActorContext(flightBookerMachine);

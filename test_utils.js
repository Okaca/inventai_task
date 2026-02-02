import { faker } from "@faker-js/faker";

export function createBookingPayload() {
  const checkinDate = faker.date.soon({ days: 30 });
  const checkoutDate = faker.date.soon({ days: 5, refDate: checkinDate });

  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 500 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: {
      checkin: checkinDate.toISOString().split("T")[0],
      checkout: checkoutDate.toISOString().split("T")[0],
    },
    additionalneeds: faker.helpers.arrayElement([
      "Breakfast",
      "Lunch",
      "Dinner",
      "Baby crib",
      "Late checkout",
    ]),
  };
}

// JSON Schema for validating booking responses
export const bookingSchema = {
  type: "object",
  required: [
    "firstname",
    "lastname",
    "totalprice",
    "depositpaid",
    "bookingdates",
  ],
  properties: {
    firstname: {
      type: "string",
      minLength: 1,
    },
    lastname: {
      type: "string",
      minLength: 1,
    },
    totalprice: {
      type: "number",
      minimum: 0,
    },
    depositpaid: {
      type: "boolean",
    },
    bookingdates: {
      type: "object",
      required: ["checkin", "checkout"],
      properties: {
        checkin: {
          type: "string",
          pattern: "^\\d{4}-\\d{2}-\\d{2}$", // YYYY-MM-DD format
        },
        checkout: {
          type: "string",
          pattern: "^\\d{4}-\\d{2}-\\d{2}$",
        },
      },
    },
    additionalneeds: {
      type: "string",
    },
  },
};

/**
 * Comprehensive validator that checks BOTH data types AND values
 * @param {Object} responseData - The API response body
 * @param {Object} expectedPayload - The original payload sent to create the booking
 * @returns {Object} Validation result with details
 */
export function validateBookingResponse(responseData, expectedPayload) {
  const errors = [];
  const typeErrors = [];
  const valueErrors = [];

  // ===== DATA TYPE VALIDATION =====

  // Validate firstname type and value
  if (typeof responseData.firstname !== "string") {
    typeErrors.push("firstname must be a string");
  }
  if (responseData.firstname !== expectedPayload.firstname) {
    valueErrors.push(
      `firstname value mismatch: expected "${expectedPayload.firstname}", got "${responseData.firstname}"`,
    );
  }

  // Validate lastname type and value
  if (typeof responseData.lastname !== "string") {
    typeErrors.push("lastname must be a string");
  }
  if (responseData.lastname !== expectedPayload.lastname) {
    valueErrors.push(
      `lastname value mismatch: expected "${expectedPayload.lastname}", got "${responseData.lastname}"`,
    );
  }

  // Validate totalprice type and value
  if (typeof responseData.totalprice !== "number") {
    typeErrors.push("totalprice must be a number");
  }
  if (responseData.totalprice !== expectedPayload.totalprice) {
    valueErrors.push(
      `totalprice value mismatch: expected ${expectedPayload.totalprice}, got ${responseData.totalprice}`,
    );
  }

  // Validate depositpaid type and value
  if (typeof responseData.depositpaid !== "boolean") {
    typeErrors.push("depositpaid must be a boolean");
  }
  if (responseData.depositpaid !== expectedPayload.depositpaid) {
    valueErrors.push(
      `depositpaid value mismatch: expected ${expectedPayload.depositpaid}, got ${responseData.depositpaid}`,
    );
  }

  // Validate bookingdates object type
  if (
    !responseData.bookingdates ||
    typeof responseData.bookingdates !== "object"
  ) {
    typeErrors.push("bookingdates must be an object");
  } else {
    // Validate checkin type and value
    if (typeof responseData.bookingdates.checkin !== "string") {
      typeErrors.push("bookingdates.checkin must be a string");
    }
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(responseData.bookingdates.checkin)) {
      typeErrors.push("bookingdates.checkin must be in YYYY-MM-DD format");
    }
    if (
      responseData.bookingdates.checkin !== expectedPayload.bookingdates.checkin
    ) {
      valueErrors.push(
        `checkin value mismatch: expected "${expectedPayload.bookingdates.checkin}", got "${responseData.bookingdates.checkin}"`,
      );
    }

    // Validate checkout type and value
    if (typeof responseData.bookingdates.checkout !== "string") {
      typeErrors.push("bookingdates.checkout must be a string");
    }
    if (!datePattern.test(responseData.bookingdates.checkout)) {
      typeErrors.push("bookingdates.checkout must be in YYYY-MM-DD format");
    }
    if (
      responseData.bookingdates.checkout !==
      expectedPayload.bookingdates.checkout
    ) {
      valueErrors.push(
        `checkout value mismatch: expected "${expectedPayload.bookingdates.checkout}", got "${responseData.bookingdates.checkout}"`,
      );
    }
  }

  // Validate additionalneeds type and value (optional field)
  if (responseData.additionalneeds !== undefined) {
    if (typeof responseData.additionalneeds !== "string") {
      typeErrors.push("additionalneeds must be a string");
    }
    if (responseData.additionalneeds !== expectedPayload.additionalneeds) {
      valueErrors.push(
        `additionalneeds value mismatch: expected "${expectedPayload.additionalneeds}", got "${responseData.additionalneeds}"`,
      );
    }
  }

  // Combine all errors
  errors.push(...typeErrors, ...valueErrors);

  return {
    valid: errors.length === 0,
    errors,
    typeErrors,
    valueErrors,
    summary: {
      totalErrors: errors.length,
      typeErrorCount: typeErrors.length,
      valueErrorCount: valueErrors.length,
    },
  };
}

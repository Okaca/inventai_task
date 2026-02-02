import dotenv from "dotenv";
import request from "supertest";
import {
  createBookingPayload,
  validateBookingResponse,
} from "../../test_utils.js";

dotenv.config({ path: ".env.test" });

describe("Booking API - Full Lifecycle", () => {
  let token;
  let bookingId;
  let bookingPayload;

  // ---------- AUTH ----------
  test("Auth: should generate token", async () => {
    const res = await request(process.env.BASE_URL)
      .post("/auth")
      .send({
        username: process.env.AUTH_USERNAME,
        password: process.env.AUTH_PASSWORD,
      })
      .set("Content-Type", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");

    token = res.body.token;
  });

  // ---------- CREATE ----------
  test("Create: should create a new booking", async () => {
    bookingPayload = createBookingPayload();

    const res = await request(process.env.BASE_URL)
      .post("/booking")
      .send(bookingPayload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // 1. Status and Structure Checks
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("bookingid");
    expect(typeof res.body.bookingid).toBe("number");

    // 2. Data Integrity Checks (Matching Request to Response)
    const actualBooking = res.body.booking;

    expect(actualBooking.firstname).toBe(bookingPayload.firstname);
    expect(actualBooking.lastname).toBe(bookingPayload.lastname);
    expect(actualBooking.totalprice).toBe(bookingPayload.totalprice);
    expect(actualBooking.depositpaid).toBe(bookingPayload.depositpaid);
    expect(actualBooking.additionalneeds).toBe(bookingPayload.additionalneeds);

    bookingId = res.body.bookingid;
  });

  // ---------- GET WITH JSON SCHEMA VALIDATION ----------
  test("Get: should validate JSON schema (types AND values)", async () => {
    const res = await request(process.env.BASE_URL)
      .get(`/booking/${bookingId}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);

    // ✅ COMPREHENSIVE VALIDATION: Checks BOTH data types AND values in one function!
    const validation = validateBookingResponse(res.body, bookingPayload);

    // Log detailed validation results
    if (!validation.valid) {
      console.error("❌ Validation failed!");
      console.error("Type errors:", validation.typeErrors);
      console.error("Value errors:", validation.valueErrors);
    } else {
      console.log("✅ All validations passed!");
      console.log(
        `- Data type checks: ${validation.summary.typeErrorCount === 0 ? "✓" : "✗"}`,
      );
      console.log(
        `- Value checks: ${validation.summary.valueErrorCount === 0 ? "✓" : "✗"}`,
      );
    }

    // Assert validation passed
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
    expect(validation.typeErrors).toHaveLength(0);
    expect(validation.valueErrors).toHaveLength(0);

    console.log(
      "✅ Schema validation passed! All data types and values are correct.",
    );
  });

  // ---------- UPDATE ----------
  test("Update: should update booking (auth required)", async () => {
    const updatePayload = createBookingPayload();

    const res = await request(process.env.BASE_URL)
      .put(`/booking/${bookingId}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("Cookie", `token=${token}`)
      .send(updatePayload);

    // 1. Verify success status
    expect(res.statusCode).toBe(200);

    // 2. Comprehensive check: Verify response matches the NEW payload
    expect(res.body).toMatchObject({
      firstname: updatePayload.firstname,
      lastname: updatePayload.lastname,
      totalprice: updatePayload.totalprice,
      depositpaid: updatePayload.depositpaid,
      bookingdates: {
        checkin: updatePayload.bookingdates.checkin,
        checkout: updatePayload.bookingdates.checkout,
      },
      additionalneeds: updatePayload.additionalneeds,
    });

    // 3. Negative check: Ensure it is NOT the old data anymore
    expect(res.body.firstname).not.toBe(bookingPayload.firstname);
  });

  // ---------- DELETE ----------
  test("Delete: should delete booking (auth required)", async () => {
    const res = await request(process.env.BASE_URL)
      .delete(`/booking/${bookingId}`)
      .set("Cookie", `token=${token}`);

    expect(res.statusCode).toBe(201);
  });

  // ---------- VERIFY DELETE ----------
  test("Verify: booking should no longer exist", async () => {
    const res = await request(process.env.BASE_URL).get(
      `/booking/${bookingId}`,
    );

    expect(res.statusCode).toBe(404);
  });
});

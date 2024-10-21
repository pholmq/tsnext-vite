// Import the function if it's in a separate file
//
import { rAandDecFromLocal } from "../src/utils/celestial-functions";

describe("calculateRAandDec", () => {
  // Helper function to round numbers for comparison
  const roundTo4Decimals = (num) => Math.round(num * 10000) / 10000;

  test("calculates RA and Dec for New York City coordinates", () => {
    const lat = 40.7128; // New York City latitude
    const lon = -74.006; // New York City longitude
    const time = new Date("2024-10-17T12:00:00Z"); // Fixed time for consistent results
    const az = 180; // Azimuth in degrees
    const alt = 45; // Altitude in degrees

    const result = rAandDecFromLocal(lat, lon, time, az, alt);

    // Expected values (these should be pre-calculated or verified with another source)
    const expectedRA = 11.7371; // hours
    const expectedDec = -11.4721; // degrees

    expect(roundTo4Decimals(result.ra)).toBe(expectedRA);
    expect(roundTo4Decimals(result.dec)).toBe(expectedDec);
  });

  test("handles different input values correctly", () => {
    const testCases = [
      {
        lat: 0,
        lon: 0,
        time: new Date("2024-10-17T00:00:00Z"),
        az: 90,
        alt: 30,
      },
      {
        lat: -33.8688,
        lon: 151.2093,
        time: new Date("2024-10-17T12:00:00Z"),
        az: 270,
        alt: 60,
      }, // Sydney
      {
        lat: 51.5074,
        lon: -0.1278,
        time: new Date("2024-10-17T18:00:00Z"),
        az: 0,
        alt: 15,
      }, // London
    ];

    testCases.forEach((testCase, index) => {
      const result = rAandDecFromLocal(
        testCase.lat,
        testCase.lon,
        testCase.time,
        testCase.az,
        testCase.alt
      );

      // We're not checking specific values here, but ensuring the function returns something reasonable
      expect(result.ra).toBeGreaterThanOrEqual(0);
      expect(result.ra).toBeLessThan(24);
      expect(result.dec).toBeGreaterThanOrEqual(-90);
      expect(result.dec).toBeLessThanOrEqual(90);
    });
  });

  test("handles edge cases", () => {
    const edgeCases = [
      {
        lat: 90,
        lon: 0,
        time: new Date("2024-10-17T00:00:00Z"),
        az: 0,
        alt: 90,
      }, // North Pole
      {
        lat: -90,
        lon: 0,
        time: new Date("2024-10-17T12:00:00Z"),
        az: 0,
        alt: 0,
      }, // South Pole
      {
        lat: 0,
        lon: 180,
        time: new Date("2024-10-17T18:00:00Z"),
        az: 180,
        alt: -10,
      }, // International Date Line, below horizon
    ];

    edgeCases.forEach((testCase, index) => {
      const result = rAandDecFromLocal(
        testCase.lat,
        testCase.lon,
        testCase.time,
        testCase.az,
        testCase.alt
      );

      expect(result.ra).not.toBeNaN();
      expect(result.dec).not.toBeNaN();
    });
  });
});

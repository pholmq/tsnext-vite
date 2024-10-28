// Import the function if it's in a separate file
//
import { azEl2RaDec } from "../src/utils/celestial-functions";

describe("azEl2RaDec", () => {
  // Helper function to round numbers to a specified number of decimal places
  const round = (value, decimals) =>
    Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);

  test("should convert Az/El to RA/Dec correctly for the worked example", () => {
    const [RA, DEC] = azEl2RaDec(
      210.8250667,
      23.8595052,
      39.007,
      -104.883,
      "1994/05/14 13:11:20.59856"
    );
    expect(round(RA, 4)).toBeCloseTo(294.9891, 4);
    expect(round(DEC, 4)).toBeCloseTo(20.8235, 4);
  });

  test("should handle 0 degree inputs", () => {
    const [RA, DEC] = azEl2RaDec(0, 0, 0, -104, "1992/08/20 12:14:00");
    expect(RA).toBeDefined();
    expect(DEC).toBeDefined();
    expect(isNaN(RA)).toBe(false);
    expect(isNaN(DEC)).toBe(false);
  });

  test("should handle negative latitude", () => {
    const [RA, DEC] = azEl2RaDec(45, 30, -35.3, 149.1, "2023/01/01 00:00:00");
    expect(RA).toBeDefined();
    expect(DEC).toBeDefined();
    expect(isNaN(RA)).toBe(false);
    expect(isNaN(DEC)).toBe(false);
  });

  test("should handle Az > 180 degrees", () => {
    const [RA, DEC] = azEl2RaDec(270, 45, 51.5, -0.1, "2023/06/21 12:00:00");
    expect(RA).toBeDefined();
    expect(DEC).toBeDefined();
    expect(isNaN(RA)).toBe(false);
    expect(isNaN(DEC)).toBe(false);
  });

  test("should handle El = 90 degrees (zenith)", () => {
    const [RA, DEC] = azEl2RaDec(0, 90, 40, -75, "2023/12/31 23:59:59");
    expect(round(DEC, 4)).toBeCloseTo(40, 4); // DEC should be close to latitude
    expect(RA).toBeDefined();
    expect(isNaN(RA)).toBe(false);
  });

  test("should return RA between 0 and 360 degrees", () => {
    const [RA, DEC] = azEl2RaDec(135, 60, 20, 100, "2024/03/15 18:30:00");
    expect(RA).toBeGreaterThanOrEqual(0);
    expect(RA).toBeLessThan(360);
  });

  test("should return DEC between -90 and 90 degrees", () => {
    const [RA, DEC] = azEl2RaDec(225, 15, -10, -150, "2024/09/01 06:45:00");
    expect(DEC).toBeGreaterThanOrEqual(-90);
    expect(DEC).toBeLessThanOrEqual(90);
  });
});

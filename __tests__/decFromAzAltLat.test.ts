//
import { decFromAzAltLat } from "../src/utils/celestial-functions";

describe("calculateDeclination", () => {
  // Helper function to round to 4 decimal places for comparison
  const round = (num: number) => Number(num.toFixed(4));

  test("calculates declination correctly for standard inputs", () => {
    expect(round(decFromAzAltLat(225, 30, 40))).toBe(round(-14.4775));
  });

  test("handles azimuth of 0 degrees (North)", () => {
    expect(round(decFromAzAltLat(0, 45, 50))).toBe(round(85.0225));
  });

  test("handles azimuth of 180 degrees (South)", () => {
    expect(round(decFromAzAltLat(180, 45, 50))).toBe(round(5.0225));
  });

  test("handles altitude of 0 degrees (horizon)", () => {
    expect(round(decFromAzAltLat(90, 0, 40))).toBe(round(0));
  });

  test("handles altitude of 90 degrees (zenith)", () => {
    expect(round(decFromAzAltLat(0, 90, 40))).toBe(40);
  });

  test("handles negative latitude (Southern hemisphere)", () => {
    expect(round(decFromAzAltLat(225, 30, -40))).toBe(round(14.4775));
  });

  test("handles edge case: North celestial pole", () => {
    expect(round(decFromAzAltLat(0, 90, 90))).toBe(90);
  });

  test("handles edge case: South celestial pole", () => {
    expect(round(decFromAzAltLat(0, 90, -90))).toBe(-90);
  });

  test("handles edge case: Celestial equator", () => {
    expect(round(decFromAzAltLat(90, 0, 0))).toBe(0);
  });

  test("throws error for invalid altitude (> 90)", () => {
    expect(() => decFromAzAltLat(0, 91, 0)).toThrow();
  });

  test("throws error for invalid altitude (< -90)", () => {
    expect(() => decFromAzAltLat(0, -91, 0)).toThrow();
  });

  test("throws error for invalid latitude (> 90)", () => {
    expect(() => decFromAzAltLat(0, 0, 91)).toThrow();
  });

  test("throws error for invalid latitude (< -90)", () => {
    expect(() => decFromAzAltLat(0, 0, -91)).toThrow();
  });
});

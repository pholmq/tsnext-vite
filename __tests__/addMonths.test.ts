import { addMonths } from "../src/utils/time-date-functions";

test("addMonths should correctly add months to a date string", () => {
  expect(addMonths("2021-09-10", 1)).toBe("2021-10-10");
  expect(addMonths("2021-09-10", 3)).toBe("2021-12-10");
  expect(addMonths("2021-09-10", 12)).toBe("2022-09-10");
  expect(addMonths("2021-09-10", -1)).toBe("2021-08-10");
  expect(addMonths("2021-09-10", -3)).toBe("2021-06-10");
  expect(addMonths("2021-09-10", -17)).toBe("2020-04-10");
  expect(addMonths("-2021-09-10", 1)).toBe("-2021-10-10");
  expect(addMonths("-2021-09-10", 3)).toBe("-2021-12-10");
  expect(addMonths("-1-04-27", 5)).toBe("-1-09-27");
  expect(addMonths("-100-09-24", -6)).toBe("-100-03-24");
  expect(addMonths("2024-01-06", -1)).toBe("2023-12-06");
  expect(addMonths("2021-12-06", 1)).toBe("2022-01-06");
});

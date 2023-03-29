export function radToRa(rad) {
  if (rad < 0) {
    rad = rad + Math.PI * 2;
  }
  const raDec = (rad * 12) / Math.PI;
  const hours = Math.floor(raDec);
  const minutesSeconds = (raDec - hours) * 60;
  const minutes = Math.floor((raDec - hours) * 60);
  const seconds = (minutesSeconds - minutes) * 60;
  return (
    leadZero(hours) +
    "h" +
    leadZero(minutes) +
    "m" +
    leadZero(Number(seconds.toFixed(0))) +
    "s"
  );
}

export function radToDec(rad) {
  if (rad <= 0) {
    rad = rad + Math.PI / 2;
  } else {
    rad = Math.PI / 2 - rad;
  }
  var degDec = (rad * 180) / Math.PI;
  var degreesSign = "";

  if (degDec < 0) {
    degDec *= -1.0;
    degreesSign = "-";
  }

  const degrees = Math.floor(degDec);
  const minutesSeconds = (degDec - degrees) * 60;
  const minutes = Math.floor((degDec - degrees) * 60);
  const seconds = (minutesSeconds - minutes) * 60;
  return (
    leadZero(Number(degreesSign + degrees), true) +
    "\xB0" +
    leadZero(minutes) +
    "'" +
    leadZero(Number(seconds.toFixed(0))) +
    '"'
  );
}

function leadZero(n: number, plus?: boolean) {
  let sign;
  n < 0 ? (sign = "-") : (sign = "");
  if (sign === "" && plus) {
    sign = "+";
  }
  n = Math.abs(n);
  return n > 9 ? sign + n : sign + "0" + n;
}


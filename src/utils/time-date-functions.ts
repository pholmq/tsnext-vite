//TIME CONSTANTS
const yearLength = 365.2425;
const earthRotations = 366.2425;

const sDay = 1 / yearLength;
const sYear = sDay * 365;
const sMonth = sDay * 30;
const sWeek = sDay * 7;
const sHour = sDay / 24;
const sMinute = sHour / 60;
const sSecond = sMinute / 60;

export const speedFactOptions = [
  {
    label: "1 second",
    value: sSecond
  },
  {
    label: "1 minute",
    value: sMinute
  },
  {
    label: "1 hour",
    value: sHour
  },
  {
    label: "1 day",
    value: sDay
  },
  {
    label: "1 week",
    value: sWeek
  },
  {
    label: "1 month",
    value: sMonth
  },
  {
    label: "1 year",
    value: sYear
  },
  {
    label: "10 years",
    value: sYear * 10
  },
  {
    label: "100 years",
    value: sYear * 100
  },
  {
    label: "1000 years",
    value: sYear * 1000
  }

  // '10 years': sYear*10,
  // '100 years': sYear*100,
  // '1000 years': sYear*1000,
];

//Note: Julian day and Julian Date are two different terms easily confused. Julian Day is used in astronomy. Julian Date are dates before the Gregorian calendar.

export function getDefaultSpeedFact() {
  return sWeek;
}

export function posToDays(pos: number) {
  pos += sHour * 12; //Set the clock to tweleve for pos 0
  return Math.floor(pos / sDay);
}

export function posToDate(pos: number) {
  return daysToDate(posToDays(pos));
}

export function posToJulianDay(pos: number) {
  return daysToJulianDays(posToDays(pos));
}

export function posToTime(pos: number) {
  pos += sHour * 12; //Set the clock to tweleve for pos 0
  let days = pos / sDay - Math.floor(pos / sDay);
  let hours = Math.floor(days * 24);
  let minutes = Math.floor((days * 24 - hours) * 60);
  let seconds = Math.round(((days * 24 - hours) * 60 - minutes) * 60);

  if (seconds === 60) {
    seconds = 0;
    minutes += 1;
  }

  if (minutes === 60) {
    minutes = 0;
    hours += 1;
  }

  let hh = ("0" + hours).slice(-2);
  let mm = ("0" + minutes).slice(-2);
  let ss = ("0" + seconds).slice(-2);

  return hh + ":" + mm + ":" + ss;
}

export function timeToPos(value: string) {
  let aTime: any = value.split(":");
  let pos = aTime[0] * sHour + aTime[1] * sMinute + aTime[2] * sSecond;
  return (pos -= sHour * 12); //Set the clock to tweleve for pos 0
}

export function daysToDate(g: number) {
  if (g < -152556) return julianCalDayToDate(g); //Julian dates earlier than 1582-10-15
  g += 730597;
  let y = Math.floor((10000 * g + 14780) / 3652425);
  let ddd =
    g -
    (365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400));
  if (ddd < 0) {
    y = y - 1;
    ddd =
      g -
      (365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400));
  }
  let mi = Math.floor((100 * ddd + 52) / 3060);
  let mm: any = ((mi + 2) % 12) + 1;
  y = y + Math.floor((mi + 2) / 12);
  let dd: any = ddd - Math.floor((mi * 306 + 5) / 10) + 1;

  mm = ("0" + mm).slice(-2);
  dd = ("0" + dd).slice(-2);

  return y + "-" + mm + "-" + dd;
}

export function daysToJulianDays(days: number) {
  return (days + 2451717).toString();
}

export function julianDayTimeToPos(julianDays: number, time: string) {
  return sDay * (julianDays - 2451717) + timeToPos(time);
  //return (days + 2451717).toString();
}

export function isValidTime(value: string) {
  //check input
  let aTime: any = value.split(":");
  if (aTime.length > 3) {
    //Only hh:mm:ss
    return false;
  }
  //Check with regex that we only have numbers and a valid time
  if (!/^\d+$/.test(aTime[0]) || aTime[0].length !== 2) return false;
  if (aTime[0] > 24) return false;
  if (!/^\d+$/.test(aTime[1]) || aTime[1].length !== 2) return false;
  if (aTime[1] > 59) return false;
  if (!/^\d+$/.test(aTime[2]) || aTime[2].length !== 2) return false;
  if (aTime[2] > 59) return false;

  return true;
}

export function isValidDate(value: string) {
  //check input
  let aDate: any = value.split("-");
  if (aDate.length > 3) {
    //Assume we have a minus sign first
    aDate.shift();
  }
  if (aDate.length > 3) {
    //Only year-month-day allowed
    return false;
  }
  //Check with regex that we only have numbers and a (probably) valid date
  if (!/^\d+$/.test(aDate[0]) || aDate[0].length > 20) {
    return false;
  }
  if (!/^\d+$/.test(aDate[1]) || aDate[1].length !== 2) {
    return false;
  }
  if (aDate[1] > 12 || aDate[1] < 1) {
    return false;
  }
  if (!/^\d+$/.test(aDate[2]) || aDate[2].length !== 2) {
    return false;
  }
  if (aDate[2] > 31 || aDate[2] < 1) {
    return false;
  }
  // if (Number(aDate[0]) === 0) return false; //Year 0 is not allowed
  if (Number(aDate[0]) === 1582 && Number(aDate[1]) === 10) {
    if (aDate[2] > 4 && aDate[2] < 15) return false; //Day 5-14, oct 1582 are not dates
  }

  return true;
}

export function dateTimeToPos(date: string, time: string) {
  return sDay * dateToDays(date) + timeToPos(time);
}
// o.pos = sDay * dateToDays(o.Date) + timeToPos(o.Time);

//console.log(dateToDays("2000-06-20"))

export function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function dateToDays(sDate: string) {
  //Calculates the number of days passed since 2000-06-21 for a date. Positive or negative
  //Taken from https://alcor.concordia.ca/~gpkatch/gdate-algorithm.html
  let aDate = sDate.split("-");
  let y, m, d;
  if (aDate.length > 3) {
    //We had a minus sign first (a BC date)
    y = -Number(aDate[1]);
    m = Number(aDate[2]);
    d = Number(aDate[3]);
  } else {
    y = Number(aDate[0]);
    m = Number(aDate[1]);
    d = Number(aDate[2]);
  }

  if (y < 1582) return julianDateToDays(sDate);
  if (y === 1582 && m < 10) return julianDateToDays(sDate);
  if (y === 1582 && m === 10 && d < 15) return julianDateToDays(sDate);

  m = (m + 9) % 12;
  y = y - Math.floor(m / 10);
  return (
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) +
    Math.floor((m * 306 + 5) / 10) +
    (d - 1) -
    730597
  );
}

function julianDateToDays(sDate: string) {
  //Calculates the number of days passed since 2000-06-21 for a date. Positive or negative
  //Taken from https://alcor.concordia.ca/~gpkatch/gdate-algorithm.html
  let aDate = sDate.split("-");
  let y, m, d, jd;
  if (aDate.length > 3) {
    //We had a minus sign first (a BC date)
    y = -Number(aDate[1]);
    m = Number(aDate[2]);
    d = Number(aDate[3]);
  } else {
    y = Number(aDate[0]);
    m = Number(aDate[1]);
    d = Number(aDate[2]);
  }

  // if (y < 0 ) y += 1;
  //if (y === -1) y -= 1;

  if (m < 3) {
    m += 12;
    y -= 1;
  }
  //Math.trunc(x)
  jd =
    Math.trunc(365.25 * (y + 4716)) + Math.trunc(30.6001 * (m + 1)) + d - 1524;

  return jd - 2451717;
}

function addYears(sDate: string, year: string) {
  let aDate = sDate.split("-");
  let y, date;
  if (aDate.length > 3) {
    //We had a minus sign first = a BC date
    y = -Number(aDate[1]);
    date = y + year + "-" + aDate[2] + "-" + aDate[3];
  } else {
    y = Number(aDate[0]);
    date = y + year + "-" + aDate[1] + "-" + aDate[2];
  }
  return date;
}

//console.log(daysToDate(0))

function julianCalDayToDate(g: number) {
  let jDay = g + 2451717; //+ 10;
  let z = Math.floor(jDay - 1721116.5);
  let r = jDay - 1721116.5 - z;
  let year = Math.floor((z - 0.25) / 365.25);
  let c = z - Math.floor(365.25 * year);
  let month: any = Math.trunc((5 * c + 456) / 153);
  let day: any = c - Math.trunc((153 * month - 457) / 5) + r - 0.5;
  if (month > 12) {
    year = year + 1;
    month = month - 12;
  }
  month = ("0" + month).slice(-2);
  day = ("0" + day).slice(-2);
  // if (year <= 0) year -= 1;
  return year + "-" + month + "-" + day;
}

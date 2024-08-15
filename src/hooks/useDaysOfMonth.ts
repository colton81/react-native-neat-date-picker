import { useState, useEffect } from "react";

export type DaysArray = {
  date: number;
  disabled: boolean;
  isCurrentMonth: boolean;
  month: number;
  year: number;
};

/**
 * input date
 *
 * inputYear:
 * inputMonth: 0-base
 * dateArray: An array that contains same amount of number as how many days in inputMonth, inputYear.
 *  Also contain last few days of the previous month and first few days of the next month.
 *  eg. 2021Feb starts from Monday and ends on Saturday,  dateArray = [1,2,3,4,...,27,28]
 *
 *
 */
const useDaysOfMonth = (
  inputYear: number,
  inputMonth: number,
  minTime?: number,
  maxTime?: number
): DaysArray[] => {
  const [dateArray, setDateArray] = useState<DaysArray[]>([]);

  const days = new Date(inputYear, inputMonth + 1, 0).getDate();

  const firstDay = new Date(inputYear, inputMonth, 1).getDay();

  const prevMonthDays = new Date(inputYear, inputMonth, 0).getDate();

  const createDateArray = () => {
    let arr = Array.from(Array(days), (_, i) => {
      return {
        year: inputYear,
        month: inputMonth,
        date: i + 1,
        isCurrentMonth: true,
        disabled: false,
      };
    });

    // 補上個月的日期
    let daysShouldInsert = firstDay;
    let insertedNumber = prevMonthDays;
    while (daysShouldInsert > 0 && daysShouldInsert < 7) {
      const insertingTime = {
        year: inputYear,
        month: inputMonth - 1,
        date: insertedNumber,
        isCurrentMonth: false,
        disabled: false,
      };
      arr.unshift(insertingTime);
      insertedNumber--;
      daysShouldInsert--;
    }

    // Fill in the dates for the next month
    let blankInEnd = arr.length % 7; // The number of remaining empty slots in the last row
    if (blankInEnd !== 0) blankInEnd = blankInEnd - 7; // If there is a remainder, subtract 7 to get the number of dates that need to be filled in
    let i = -1;
    while (i >= blankInEnd) {
      const insertingTime = {
        year: inputYear,
        month: inputMonth + 1, // Next month
        date: i * -1, // Filling dates backward from the last day
        isCurrentMonth: false, // Not part of the current month
        disabled: false, // Not disabled
      };

      arr.push({ ...insertingTime }); // Add the date object to the array
      i--;
    }

    // If there are upper and lower limits, disable the buttons that are outside the range.
    if (minTime || maxTime) {
      const checkShouldDisabled = (day: DaysArray) => {
        const thisKeyTime = new Date(day.year, day.month, day.date).getTime();
        let shouldDisableKey = false;
        if (maxTime && thisKeyTime > maxTime) shouldDisableKey = true;
        if (minTime && thisKeyTime < minTime) shouldDisableKey = true;
        const disableKey = !!shouldDisableKey;
        return { ...day, disabled: disableKey };
      };
      arr = arr.map(checkShouldDisabled);
    }

    return arr;
  };

  useEffect(() => {
    setDateArray(createDateArray());
  }, [inputYear, inputMonth, minTime, maxTime]);

  return dateArray;
};

export default useDaysOfMonth;

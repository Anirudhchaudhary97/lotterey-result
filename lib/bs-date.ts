import NepaliDate from "nepali-date-converter"; // npm i nepali-date-converter

const BS_MONTHS = [
  "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra",
];

/**
 * Converts a JS Date (AD/Gregorian) to a display string like "24 Shrawan 2083".
 * Pure function — safe to import from both client and server code.
 */
export function toBsDisplay(adDate: Date): string {
  const bs = new NepaliDate(adDate);
  const day = bs.getDate();
  const month = BS_MONTHS[bs.getMonth()];
  const year = bs.getYear();
  return `${day} ${month} ${year}`;
}

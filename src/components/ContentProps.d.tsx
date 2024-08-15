import { Dispatch, SetStateAction } from "react";
import { DaysArray } from "../hooks/useDaysOfMonth";
import { i18nLanguages } from "../lib/lib";
import { Mode, Output } from "./Key";
import { ColorOptions } from "./NeatDatePicker.d";

/**
 * Props for the Content component of the NeatDatePicker.
 */
export interface ContentProps {
  /**
   * Language for localization of the date picker content.
   *
   * This prop determines the language used for month names, weekday names, and button text.
   * If not provided, English will be used as the default language.
   *
   * @example
   * language="fr" // Set language to French
   */
  language?: i18nLanguages;

  /**
   * Mode of date selection.
   *
   * Determines how dates can be selected in the picker:
   * - 'single': Allow selection of a single date.
   * - 'range': Enable selection of a date range (start and end dates).
   * - 'multi': Permit selection of multiple individual dates.
   *
   * @example
   * mode="range" // Enable date range selection
   */
  mode: Mode;

  /**
   * Callback function to navigate to the previous month or year.
   *
   * This function is called when the user presses the left navigation button.
   *
   * @example
   * onPrev={() => console.log('Navigating to previous month/year')}
   */
  onPrev: () => void;

  /**
   * Callback function to navigate to the next month or year.
   *
   * This function is called when the user presses the right navigation button.
   *
   * @example
   * onNext={() => console.log('Navigating to next month/year')}
   */
  onNext: () => void;

  /**
   * Callback function when date selection is confirmed.
   *
   * This function is called when the user presses the confirm button.
   *
   * @example
   * onConfirmPress={() => console.log('Date selection confirmed')}
   */
  onConfirmPress: (date: Output) => void;

  /**
   * Callback function when date selection is canceled.
   *
   * This function is called when the user presses the cancel button.
   *
   * @example
   * onCancelPress={() => console.log('Date selection canceled')}
   */
  onCancelPress: () => void;

  /**
   * Color options for customizing the appearance of the date picker.
   *
   * This object allows customization of various color aspects of the picker.
   * It will be merged with default color options.
   *
   * @example
   * colorOptions={{
   *   primaryColor: '#007AFF',
   *   backgroundColor: '#FFFFFF',
   *   textColor: '#000000',
   *   selectedTextColor: '#FFFFFF',
   *   selectedBackgroundColor: '#007AFF'
   * }}
   */
  colorOptions?: ColorOptions;

  /**
   * Whether to show the year selection modal first.
   *
   * If true, the year selection modal will appear when the date picker is opened,
   * allowing users to quickly jump to a specific year before selecting a date.
   *
   * @default false
   *
   * @example
   * chooseYearFirst={true} // Show year selection modal on open
   */
  chooseYearFirst?: boolean;

  /**
   * Array of day objects representing the current month.
   *
   * This array contains information about each day in the current month view,
   * including date information and selection states.
   *
   * @example
   * daysArray={[
   *   { year: 2023, month: 5, date: 1, day: 1, isCurrentMonth: true, isToday: false, isSelected: false, isInRange: false, isRangeStart: false, isRangeEnd: false },
   *   // ... more day objects
   * ]}
   */
  daysArray: DaysArray[];

  /**
   * The currently displayed date in the picker.
   *
   * This Date object represents the month and year currently shown in the picker.
   *
   * @example
   * displayTime={new Date(2023, 5, 1)} // Display June 2023
   */
  displayTime: Date;

  /**
   * Function to update the displayed date.
   *
   * This function is used to change the month/year view of the picker.
   *
   * @example
   * setDisplayTime={(newDate) => console.log('Changing display to:', newDate)}
   */
  setDisplayTime: Dispatch<SetStateAction<Date>>;

  /**
   * Current output of the date picker.
   *
   * This represents the currently selected date(s) in the picker.
   * The structure depends on the `mode` prop:
   * - 'single': A single Date object
   * - 'range': An object with 'startDate' and 'endDate' properties
   * - 'multi': An array of Date objects
   *
   * @example
   * output={new Date(2023, 5, 15)} // For 'single' mode
   * output={{ startDate: new Date(2023, 5, 1), endDate: new Date(2023, 5, 7) }} // For 'range' mode
   * output={[new Date(2023, 5, 1), new Date(2023, 5, 15)]} // For 'multi' mode
   */
  output: any;
}

/**
 * Content component for the NeatDatePicker.
 *
 * This component renders the main content of the date picker, including
 * the header with navigation, the calendar grid, and the footer with action buttons.
 */
declare const Content: React.FC<ContentProps>;

export default Content;

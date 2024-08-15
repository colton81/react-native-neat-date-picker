import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DaysArray } from "../hooks/useDaysOfMonth";
import { getTranslation } from "../lib/lib";
import ChangeYearModal from "./ChangeYearModal";
import Key from "./Key";
import { ColorOptions } from "./NeatDatePicker.d";
import Icon from "react-native-vector-icons/Ionicons";
import { ContentProps } from "./ContentProps.d";
/**
 * Renders the main content of the date picker, including the header with navigation,
 * the calendar grid, and the footer with action buttons.
 *
 * @property {i18nLanguages} language - Language for localization.
 * @property {Mode} mode - Mode of date selection ('single', 'range', or 'multi').
 * @property {() => void} onPrev - Called when navigating to the previous month/year.
 * @property {() => void} onNext - Called when navigating to the next month/year.
 * @property {() => void} onConfirmPress - Called when the selection is confirmed.
 * @property {() => void} onCancelPress - Called when the selection is canceled.
 * @property {ColorOptions} colorOptions - Color customization options.
 * @property {boolean} chooseYearFirst - Whether to show year selection modal first.
 * @property {DaysArray[]} daysArray - Array of day objects for the current month.
 * @property {boolean} btnDisabled - Whether navigation buttons are disabled.
 * @property {Date} displayTime - The currently displayed date.
 * @property {Dispatch<SetStateAction<Date>>} setDisplayTime - Function to update displayed date.
 * @property {any} output - Current output of the date picker.
 * @property {(output: any) => void} setOutput - Function to update the output.
 *
 * @example Basic usage:
 * ```
 * <Content
 *   language="en"
 *   mode="single"
 *   onPrev={() => {}}
 *   onNext={() => {}}
 *   onConfirmPress={() => {}}
 *   onCancelPress={() => {}}
 *   colorOptions={{
 *     primaryColor: '#007AFF',
 *     backgroundColor: '#FFFFFF',
 *     textColor: '#000000',
 *     selectedTextColor: '#FFFFFF',
 *     selectedBackgroundColor: '#007AFF'
 *   }}
 *   daysArray={[...]} // Array of DaysArray objects
 *   btnDisabled={false}
 *   displayTime={new Date()}
 *   setDisplayTime={setDisplayTime}
 *   output={null}
 *   setOutput={setOutput}
 * />
 * ```
 *
 * @example With year selection modal:
 * ```
 * <Content
 *   {...otherProps}
 *   chooseYearFirst={true}
 * />
 * ```
 */
const Content: React.FC<ContentProps> = ({
  language,
  mode,
  onPrev,
  onNext,
  onConfirmPress,
  onCancelPress,
  colorOptions,
  chooseYearFirst,
  daysArray,

  displayTime,
  setDisplayTime,
  output,
}) => {
  const [showChangeYearModal, setShowChangeYearModal] = useState(
    chooseYearFirst || false
  );

  const {
    primaryColor,
    backgroundColor,
    textColor,
    selectedTextColor,
    selectedBackgroundColor,
  } = { ...defaultColorOptions, ...(colorOptions as ColorOptions) };

  const sevenDays = language
    ? getTranslation(language).weekDays
    : getTranslation("en").weekDays;

  const chunkIntoFixedWeeks = (arr: DaysArray[]): (DaysArray | null)[][] => {
    const weeks: (DaysArray | null)[][] = [];
    let dayIndex = 0;

    for (let i = 0; i < 6; i++) {
      const week: (DaysArray | null)[] = [];
      for (let j = 0; j < 7; j++) {
        if (dayIndex < arr.length) {
          week.push(arr[dayIndex]);
          dayIndex++;
        } else {
          week.push(null);
        }
      }
      weeks.push(week);
    }

    return weeks;
  };

  const weeks = chunkIntoFixedWeeks(daysArray);

  const onSelection = (value: any) => {
    onConfirmPress(value);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.changeMonthTO} onPress={onPrev}>
          <Icon name="chevron-back" size={24} color={primaryColor} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowChangeYearModal(true)}
          style={styles.monthYearButton}
        >
          <Text style={[styles.monthYearText, { color: textColor }]}>
            {daysArray.length !== 0 &&
              `${
                language
                  ? (getTranslation(language).months as any)[
                      daysArray[10].month
                    ]
                  : (getTranslation("en").months as any)[daysArray[10].month]
              } ${daysArray[10].year}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.changeMonthTO} onPress={onNext}>
          <Icon name="chevron-forward" size={24} color={primaryColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.calendar_container}>
        <View style={styles.weekDaysContainer}>
          {sevenDays.map((weekDay: string, index: number) => (
            <Text key={index} style={[styles.weekDays, { color: textColor }]}>
              {weekDay.charAt(0)}
            </Text>
          ))}
        </View>

        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((Day: DaysArray | null, dayIndex: number) => (
              <View key={dayIndex} style={styles.dayCell}>
                {Day ? (
                  <Key
                    Day={Day}
                    mode={mode}
                    output={output}
                    setOutput={(value) => {
                      onSelection(value);
                    }}
                    colorOptions={{
                      dateTextColor: textColor,
                      backgroundColor,
                      selectedDateTextColor: selectedTextColor,
                      selectedDateBackgroundColor: selectedBackgroundColor,
                    }}
                  />
                ) : (
                  <View style={styles.emptyCell} />
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
      <ChangeYearModal
        isVisible={showChangeYearModal}
        dismiss={() => setShowChangeYearModal(false)}
        displayTime={displayTime}
        setDisplayTime={setDisplayTime}
        colorOptions={{
          primary: primaryColor,
          backgroundColor,
        }}
      />
    </View>
  );
};

export default Content;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  monthYearButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: "600",
  },
  calendar_container: {
    paddingHorizontal: 12,
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekDays: {
    fontSize: 12,
    fontWeight: "600",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  dayCell: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCell: {
    width: 36,
    height: 36,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.1)",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  btn_text: {
    fontSize: 16,
    fontWeight: "600",
  },
  changeMonthTO: {
    padding: 8,
  },
});

const defaultColorOptions = {
  primaryColor: "#007AFF",
  backgroundColor: "#FFFFFF",
  textColor: "#000000",
  selectedTextColor: "#FFFFFF",
  selectedBackgroundColor: "#007AFF",
};

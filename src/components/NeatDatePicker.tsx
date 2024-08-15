import { Output } from "./Key";
import Modal from "react-native-modal";
import { useState, useEffect, useCallback } from "react";
import { StyleSheet, Dimensions, Platform, I18nManager } from "react-native";
import Content from "./Content";
import useDaysOfMonth from "../hooks/useDaysOfMonth";
import format from "../dateformat";
import { NeatDatePickerProps } from "./NeatDatePicker.d";

I18nManager.allowRTL(false);
/**
 * Change window height to screen height due to an issue in android.
 *
 * @issue https://github.com/react-native-modal/react-native-modal/issues/147#issuecomment-610729725
 */
const winY = Dimensions.get("screen").height;
/**
 * NeatDatePicker is a customizable date picker component for React Native applications.
 * It supports single date, date range, and multi-date selection modes.
 *
 * @property {ColorOptions} colorOptions - Customization options for colors.
 * @property {string} dateStringFormat - Format for the date string output (default: "yyyy-mm-dd").
 * @property {Date} endDate - End date for range selection mode.
 * @property {Date} initialDate - Initial date to display when the picker opens.
 * @property {boolean} isVisible - Controls the visibility of the date picker modal.
 * @property {string} language - Language for localization.
 * @property {Date} maxDate - Maximum selectable date.
 * @property {Date} minDate - Minimum selectable date.
 * @property {ViewStyle} modalStyles - Custom styles for the modal (default: { justifyContent: "center" }).
 * @property {'single' | 'range' | 'multi'} mode - Date selection mode.
 * @property {() => void} onBackButtonPress - Callback for back button press (Android).
 * @property {() => void} onBackdropPress - Callback for backdrop press.
 * @property {() => void} onCancel - Callback when date selection is canceled.
 * @property {(output: Output) => void} onConfirm - Callback when date selection is confirmed.
 * @property {Date} startDate - Start date for range selection mode.
 * @property {boolean} chooseYearFirst - Whether to show year selection modal first.
 * @property {boolean} withoutModal - Render picker content without a modal.
 *
 * @example Import component:
 * ```
 * import NeatDatePicker from './path-to-neat-date-picker';
 * ```
 *
 * @example Basic usage:
 * ```
 * <NeatDatePicker
 *   isVisible={isDatePickerVisible}
 *   mode="single"
 *   onCancel={() => setDatePickerVisible(false)}
 *   onConfirm={(output) => {
 *     console.log('Selected date:', output.dateString);
 *     setDatePickerVisible(false);
 *   }}
 *   colorOptions={{
 *     primaryColor: '#007AFF',
 *     backgroundColor: '#FFFFFF',
 *     textColor: '#000000',
 *     selectedTextColor: '#FFFFFF',
 *     selectedBackgroundColor: '#007AFF'
 *   }}
 * />
 * ```
 *
 * @example Range selection:
 * ```
 * <NeatDatePicker
 *   isVisible={isDatePickerVisible}
 *   mode="range"
 *   onCancel={() => setDatePickerVisible(false)}
 *   onConfirm={(output) => {
 *     console.log('Start date:', output.startDateString);
 *     console.log('End date:', output.endDateString);
 *     setDatePickerVisible(false);
 *   }}
 *   startDate={new Date()}
 *   endDate={new Date(new Date().setDate(new Date().getDate() + 7))}
 * />
 * ```
 */
const NeatDatePicker = ({
  colorOptions,
  dateStringFormat = "yyyy-mm-dd",
  endDate,
  initialDate,
  isVisible,
  language,
  maxDate,
  minDate,
  modalStyles = { justifyContent: "center" },
  mode,
  onBackButtonPress,
  onBackdropPress,
  onCancel,
  onConfirm,
  startDate,
  chooseYearFirst,
  withoutModal,
}: NeatDatePickerProps) => {
  // displayTime defines which month is going to be shown onto the screen
  // For 'single' mode, displayTime is also the initial selected date when opening DatePicker at the first time.
  const [displayTime, setDisplayTime] = useState(initialDate ?? new Date());
  const year = displayTime.getFullYear();
  const month = displayTime.getMonth(); // 0-base
  const date = displayTime.getDate();
  const TODAY = new Date(year, month, date);

  // output decides which date should be active.
  const [output, setOutput] = useState<Output>(
    mode === "single"
      ? { date: TODAY, startDate: null, endDate: null }
      : { date: null, startDate: startDate || null, endDate: endDate || null }
  );

  // If user presses cancel, reset 'output' state to this 'originalOutput'
  const [originalOutput, setOriginalOutput] = useState(output);

  const minTime = minDate?.getTime();
  const maxTime = maxDate?.getTime();

  // useDaysOfMonth returns an array that having several objects,
  //  representing all the days that are going to be rendered on screen.
  // Each object contains five properties, 'year', 'month', 'date', 'isCurrentMonth' and 'disabled'.
  const daysArray = useDaysOfMonth(year, month, minTime, maxTime);

  const onCancelPress = () => {
    onCancel();
    setTimeout(() => {
      // reset output to originalOutput
      setOutput(originalOutput);

      // originalOutput.startDate will be null only when the user hasn't picked any date using RANGE DatePicker.
      // If that's the case, don't reset displayTime to originalOutput but initialDate/new Date()
      if (mode === "range" && !originalOutput.startDate)
        return setDisplayTime(initialDate || new Date());

      // reset displayTime
      return mode === "single"
        ? setDisplayTime(originalOutput.date as Date)
        : setDisplayTime(originalOutput.startDate as Date);
    }, 300);
  };

  const autoCompleteEndDate = () => {
    // set endDate to startDate
    output.endDate = output.startDate;

    // After successfully passing arguments in onConfirm, in next life cycle set endDate to null.
    // Therefore, next time when user opens DatePicker he can start from selecting endDate.
    setOutput({ ...output, endDate: null });
  };

  const onConfirmPress = (selectedDate: any) => {
    if (mode === "single") {
      const dateString = format(selectedDate.date as Date, dateStringFormat);
      const newOutput = {
        ...selectedDate,
        dateString,
        startDate: null,
        startDateString: null,
        endDate: null,
        endDateString: null,
      };
      onConfirm(newOutput);
      setOutput(newOutput);
    } else if (mode === "range") {
      if (!output.startDate) {
        // First date selection in range mode
        const newOutput = {
          ...output,
          startDate: selectedDate.date,
          startDateString: format(selectedDate.date as Date, dateStringFormat),
        };
        setOutput(newOutput);
      } else if (!output.endDate) {
        // Second date selection in range mode
        const endDate = selectedDate.date;
        const startDate = output.startDate as Date;
        const [finalStartDate, finalEndDate] =
          startDate <= endDate ? [startDate, endDate] : [endDate, startDate];

        const newOutput = {
          startDate: finalStartDate,
          endDate: finalEndDate,
          startDateString: format(finalStartDate, dateStringFormat),
          endDateString: format(finalEndDate, dateStringFormat),
          date: null,
          dateString: null,
        };
        onConfirm(newOutput);
        setOutput({ ...newOutput, endDate: null }); // Reset for next selection
      }
    }
    setTimeout(() => {
      return mode === "single"
        ? setDisplayTime(selectedDate.date as Date)
        : setDisplayTime(selectedDate.startDate as Date);
    }, 300);
  };

  const [isNavigating, setIsNavigating] = useState(false);
  const navigateMonth = useCallback(
    (direction: "prev" | "next") => {
      if (isNavigating) return;

      setIsNavigating(true);
      setDisplayTime((prevTime) => {
        const newDate = new Date(prevTime);
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        return newDate;
      });

      // Reset the navigation lock after a short delay
      setTimeout(() => setIsNavigating(false), 300);
    },
    [isNavigating]
  );
  const onPrev = useCallback(() => navigateMonth("prev"), [navigateMonth]);
  const onNext = useCallback(() => navigateMonth("next"), [navigateMonth]);

  useEffect(() => {
    const [y, m, d] = [
      initialDate?.getFullYear() ?? 0,
      initialDate?.getMonth() ?? 0,
      initialDate?.getDate() ?? 0,
    ];
    const updatedInitalDate = initialDate && new Date(y, m, d);

    const newOutput =
      mode === "single"
        ? { date: updatedInitalDate ?? TODAY, startDate: null, endDate: null }
        : {
            date: null,
            startDate: updatedInitalDate ?? startDate ?? TODAY,
            endDate: endDate || null,
          };

    setOutput(newOutput);
    setOriginalOutput({ ...newOutput });
  }, [mode, initialDate]);

  if (withoutModal)
    return (
      <Content
        {...{
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
        }}
      />
    );

  return (
    <Modal
      isVisible={isVisible}
      animationIn={"zoomIn"}
      animationOut={"zoomOut"}
      useNativeDriver
      hideModalContentWhileAnimating
      onBackButtonPress={onBackButtonPress || onCancelPress}
      onBackdropPress={onBackdropPress || onCancelPress}
      style={[styles.modal, modalStyles]}
      /** This two lines was added to make the modal use all the phone screen height, this is the solucion related to the issue in android:
       * @issue https://github.com/react-native-modal/react-native-modal/issues/147#issuecomment-610729725
       */
      coverScreen={false}
      deviceHeight={winY}
      backdropColor={"rgba(0, 0, 0, 0.0)"}
    >
      <Content
        {...{
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
          setOutput,
        }}
      />
    </Modal>
  );
};

export default NeatDatePicker;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    //height: winY,
    alignItems: "center",
    padding: 0,
    paddingBottom: Platform.OS == "android" ? 20 : 0,
    margin: 0,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

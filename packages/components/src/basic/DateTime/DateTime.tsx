import React, { FC } from "react";
import dayjs from "dayjs";
import locale from "antd/locale/en_US";
import { DatePicker, ConfigProvider } from "antd";
import type { dateTime } from "@genfhi/fhir-types/r4/types";

type Props = FhirWidgetProps<dateTime>

// Taken from FHIR standard: https://www.hl7.org/fhir/datatypes.html#dateTime
const validRegex =
  /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]{1,9})?)?)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)?)?)?$/;

const Invalid = () => <div>(invalid)</div>;

export const Datetime: FC<Props> = ({ value = "", onChange }) => {
  let parsed: dayjs.Dayjs | undefined;
  if (validRegex.test(value)) {
    // "The format is YYYY, YYYY-MM, YYYY-MM-DD or YYYY-MM-DDThh:mm:ss+zz:zz,"
    // Per https://www.hl7.org/fhir/datatypes.html#dateTime
    const formats = [
      "YYYY-MM-DDThh:mm:ss+zz:zz",
      "YYYY-MM-DD",
      "YYYY-MM",
      "YYYY",
    ];

    for (const format of formats) {
      const contender = dayjs(value, format);
      if (contender.isValid()) {
        parsed = contender;
        break;
      }
    }
  }

  const invalid = !parsed

  return (
    <ConfigProvider locale={locale}>
      <DatePicker
        defaultValue={parsed}
        showTime
        status={invalid ? 'error' : ''}
        onChange={(value) => {
          if (!value) {
            onChange(null);
            return;
          }
          const newVal = value.format("YYYY-MM-DD[T]hh:mm:ssZ");
          onChange(newVal);
        }}
      />
    </ConfigProvider>
  );
};

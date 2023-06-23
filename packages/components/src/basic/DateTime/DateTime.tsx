import React from "react";
import dayjs from 'dayjs';
import locale from 'antd/locale/en_US';
import { DatePicker, ConfigProvider } from "antd"
import type { dateTime } from '@genfhi/fhir-types/r4/types'

interface Props {
  value: dateTime
  onChange: (newValue: dateTime | null) => void
}

const validRegex =
  /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]{1,9})?)?)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)?)?)?$/;

const Invalid = () => <div>(invalid)</div>

export const Datetime = ({ value = "",  onChange, ...props }: Props) => {
  if (!validRegex.test(value)) {
    // TODO
    return <Invalid />
  }

  const formats = [
    'YYYY-MM-DDThh:mm:ss+zz:zz',
    'YYYY-MM-DD',
    'YYYY-MM',
    'YYYY',
  ]

  let parsed: dayjs.Dayjs | undefined
  for (const format of formats) {
    const contender = dayjs(value, format)
    if (contender.isValid()) {
      parsed = contender
      break
    }
  }
  if (!parsed) {
    return <Invalid />
  }

  return (
      <ConfigProvider locale={locale}>
        <DatePicker
          defaultValue={parsed}
          showTime
          onChange={(value) => {
            if (!value) {
              onChange(null)
              return
            }
            const newVal = value.format('YYYY-MM-DD[T]hh:mm:ssZ')
            onChange(newVal)
          }}
        />
      </ConfigProvider>
  );
};

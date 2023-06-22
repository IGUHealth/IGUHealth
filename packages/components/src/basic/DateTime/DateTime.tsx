import React, { useState } from "react";
import styled from "styled-components";
import { SingleDatePicker } from "react-dates";
import moment from "moment";
import type { Moment } from "moment";
import type { dateTime } from '@genfhi/fhir-types/r4/types'

interface Props {
  value: dateTime
  onChange: (newValue: dateTime) => void
}

const Main = styled.div`
  color: red;
`;

const validRegex =
  /([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]{1,9})?)?)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)?)?)?/;



export const Datetime = ({ value = "",  onChange, ...props }: Props) => {
  const [focused, setFocused] = useState(false);

  if (!validRegex.test(value)) {
    // TODO
    return <div>(Invalid: {value})</div>;
  }

  const m = moment(value);

  return (
    <Main>
      <SingleDatePicker
        date={m}
        onDateChange={(date: Moment | null) => date ? onChange(date.format('YYYY-MM-DDThh:mm:ss+zz:zz')) : null}
        focused={focused}
        onFocusChange={({ focused }: { focused: boolean }) =>
          setFocused(focused)
        }
        id="Foo"
      />
    </Main>
  );
};

import React, { FC } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const String: FC<Props> = ({ onChange, value }) => {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
};

export default String;

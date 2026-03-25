import React from "react";

import TextField from "@mui/material/TextField";

export function CustomizedTextField({
  label,
  name,
  type,
  style,
  placeholder,
  value,
  register,
  errors,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  value?: string;
  style?: any;
  register: any;
  errors: any;
}) {
  return (
    <>
      <TextField
        size="small"
        fullWidth
        type={type}
        label={label}
        style={style}
        value={value}
        placeholder={placeholder}
        {...register(name, { required: `${label} is required` })}
        error={!!errors[name]}
      />
      {errors[name] && (
        <p
          style={{ color: "red", fontSize: "small" }}
        >{`${errors[name].message}`}</p>
      )}
    </>
  );
}

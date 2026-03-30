import React from 'react'

import { Controller } from 'react-hook-form'
import type { Control, FieldErrors, FieldValues, Path } from 'react-hook-form'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import CustomTextField from '@/@core/components/mui/TextField'
import DatePickerWrapper from '@/@core/styles/libs/react-datepicker'

interface CustomizedDatePickerProps<T extends FieldValues = FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  errors: FieldErrors<T>
  popperPlacement?: 'top' | 'bottom' | 'left' | 'right' | 'bottom-start'
}

export function CustomizedDatePicker<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  errors,
  popperPlacement = 'bottom-start'
}: CustomizedDatePickerProps<T>) {
  return (
    <DatePickerWrapper>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            showTimeSelect // Enable time selection
            timeIntervals={30} // Set time intervals (e.g., 30 minutes)
            dateFormat='MMMM d, yyyy h:mm aa' // Customize date and time format
            timeCaption='Time' // Caption for the time dropdown
            minDate={new Date()} // Restrict past dates
            maxDate={new Date(new Date().setMonth(new Date().getMonth() + 3))} // Restrict to 3 months ahead
            selected={field.value ? new Date(field.value) : null} // Convert string to Date
            id={`picker-${name}`}
            name={name}
            popperPlacement={popperPlacement}
            onChange={date => field.onChange(date ? date.toISOString() : '')} // Convert Date to ISO string
            placeholderText='Select date & time'
            customInput={
              <CustomTextField
                label={label}
                fullWidth
                variant='standard' // Use Material-UI's "standard" variant for bottom border only
                InputProps={{
                  style: {
                    border: 'none', // Remove all borders
                    borderBottom: '1px solid #ccc', // Add only bottom border
                    borderRadius: 0, // Remove border radius
                    boxShadow: 'none'
                  }
                }}
                error={Boolean(errors[name])}
                helperText={errors[name]?.message?.toString() || ''}
              />
            }
          />
        )}
      />
    </DatePickerWrapper>
  )
}

'use client'

import React from 'react'
import type { ComponentProps } from 'react'

import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import type { BoxProps } from '@mui/material/Box'

type Props = ComponentProps<typeof ReactDatePicker> & {
  boxProps?: BoxProps
}

const StyledDatePickerWrapper = styled(Box)<BoxProps>(() => ({
  width: '100%',
  '.react-datepicker-wrapper': {
    width: '100%'
  },

  '.react-datepicker__input-container': {
    width: '100%'
  },
  '.react-datepicker': {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '12px',
    fontFamily: 'sans-serif',
    padding: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  '.react-datepicker__header': {
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee',
    paddingBottom: '8px'
  },
  '.react-datepicker__current-month': {
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '10px'
  },
  '.react-datepicker__day-name, .react-datepicker__day': {
    width: '2rem',
    height: '2rem',
    lineHeight: '2rem',
    margin: '0.2rem',
    borderRadius: '50%',
    textAlign: 'center',
    transition: 'all 0.2s ease'
  },
  '.react-datepicker__day': {
    color: '#333'
  },
  '.react-datepicker__day--selected, .react-datepicker__day--keyboard-selected': {
    backgroundColor: '#1976d2',
    color: '#fff'
  },
  '.react-datepicker__day--today': {
    border: '1px solid #1976d2'
  },
  '.react-datepicker__navigation-icon::before': {
    borderColor: '#555'
  },
  '.react-datepicker__day:hover': {
    backgroundColor: '#f0f0f0'
  },
  '.react-datepicker__triangle': {
    display: 'none' /* Hide the default triangle */
    // left: '50% !important' /* Moves the arrow to left edge of the calendar */,
    // top: '' /* Center it vertically (you can adjust this) */,
    // transform: 'rotate(-90deg)' /* Rotate the arrow to point left */
  },
  '.react-datepicker__year-dropdown': {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '4px 0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'sans-serif',
    width: '100px',
    maxHeight: '200px', // 👈 Set a fixed height
    overflowY: 'auto' // 👈 Enable vertical scroll
  },

  '.react-datepicker__year-option': {
    padding: '6px 12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s ease'
  },

  '.react-datepicker__year-option:hover': {
    backgroundColor: '#e3f2fd'
  },

  '.react-datepicker__year-option--selected': {
    // fontWeight: 'bold',
    // backgroundColor: '#1976d2',
    // color: 'white',
    // borderRadius: '4px'
  },
  '.react-datepicker__year-dropdown::-webkit-scrollbar': {
    width: '6px'
  },
  '.react-datepicker__year-dropdown::-webkit-scrollbar-thumb': {
    backgroundColor: '#bbb',
    borderRadius: '3px'
  },
  '.react-datepicker__navigation--years-upcoming, .react-datepicker__navigation--years-previous': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  },
  '.react-datepicker__navigation--years-upcoming:hover, .react-datepicker__navigation--years-previous:hover': {
    // backgroundColor: '#e0e0e0'
  }
}))

const DatePicker = ({ boxProps, ...props }: Props) => {
  return (
    <StyledDatePickerWrapper {...boxProps}>
      <ReactDatePicker
        {...props}
        wrapperClassName='custom-datepicker-wrapper'
        popperClassName='custom-datepicker-popper'
        popperPlacement='bottom-start' // Adjust placement as needed
      />
    </StyledDatePickerWrapper>
  )
}

export default DatePicker

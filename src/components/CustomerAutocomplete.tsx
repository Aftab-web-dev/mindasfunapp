'use client'
import { useMemo, useState } from 'react'

import { Autocomplete, Box, TextField, Typography } from '@mui/material'
import { useController,type Control,type FieldValues,type Path } from 'react-hook-form'

// Customer data type matching your backend response
export interface Customer {
  ledgerId: number
  ledgerCode: string | null
  ledgerName: string
  accountGroupId: number
  iCardNo: string | null
  srlNoCurrent: number
  telephone: string | null
  mobile: string | null
  ledgerAddress: string | null
  tinNo: string | null
  emailId: string | null
  remarks: string | null
  discountPer: number
  discountAmt: number
  creditDays: number
  creditLimit: number
  branchId: number
  interestPerDay: number
  bankId: number
  bankAccountNo: string | null
  bankBranch: string | null
  bankIFSC: string | null
  pan: string | null
  gstNo: string | null
  companyRegNo: string | null
  hsnCode: string | null
  state: number
  photo: string | null
  cardBalance: number
  membId: number
  gender: number
  memberShip: string | null
  cashBonusBalance: number
  tokenBalance: number
  pointBalance: number
  lastName: string | null
  cpId: number
  timePlayDur: number
  tpSingleGamePlay: number
  tpIntervelBWGame: number
  duration: number
  timePlayStatus: number
  cType: number
  [key: string]: any
}

interface CustomerAutocompleteProps<T extends FieldValues> {
  customers: Customer[]
  control: Control<T>
  name: Path<T>
  label?: string
  required?: boolean
  onCustomerSelect?: (customer: Customer) => void
  error?: boolean
  helperText?: string
  disabled?: boolean
}

/**
 * Custom Autocomplete component for searching and selecting customers
 * Automatically populates form fields with selected customer data
 * 
 * Usage:
 * <CustomerAutocomplete
 *   customers={customerList}
 *   control={control}
 *   name="selectedCustomer"
 *   label="Search Customer"
 *   onCustomerSelect={(customer) => {
 *     // Auto-fill form fields
 *     setValue('name.first', customer.ledgerName.split(' ')[0])
 *     setValue('name.last', customer.ledgerName.split(' ').slice(1).join(' '))
 *     setValue('phone_number', customer.mobile)
 *     setValue('email', customer.emailId)
 *     setValue('address', customer.ledgerAddress)
 *   }}
 * />
 */
const CustomerAutocomplete = <T extends FieldValues>({
  customers,
  control,
  name,
  label = 'Search Customer',
  required = false,
  
  // defaultValue = null,
  onCustomerSelect,
  error = false,
  helperText = '',
  disabled = false
}: CustomerAutocompleteProps<T>) => {
  const { field } = useController({
    control,
    name
  })

  const [inputValue, setInputValue] = useState('')

  // Filter customers based on search input
  const filteredCustomers = useMemo(() => {
    if (!inputValue.trim()) return customers

    const lowerInput = inputValue.toLowerCase()

    return customers.filter(customer => {
      const ledgerName = customer.ledgerName?.toLowerCase() || ''
      const mobile = customer.mobile?.toLowerCase() || ''
      const email = customer.emailId?.toLowerCase() || ''
      const address = customer.ledgerAddress?.toLowerCase() || ''

      return (
        ledgerName.includes(lowerInput) ||
        mobile.includes(lowerInput) ||
        email.includes(lowerInput) ||
        address.includes(lowerInput)
      )
    })
  }, [inputValue, customers])

  const selectedCustomer = customers.find(c => c.ledgerId === field.value?.ledgerId) || null

  return (
    <Autocomplete<Customer | null>
      disabled={disabled}
      options={filteredCustomers}
      getOptionLabel={option => {

        if (!option) return ''

        return `${option.ledgerName} ${option.mobile ? `(${option.mobile})` : ''}`
      }}
      value={selectedCustomer}
      isOptionEqualToValue={(option, value) => option?.ledgerId === value?.ledgerId}
      onChange={(_, newValue) => {

        field.onChange(newValue)

        if (newValue && onCustomerSelect) {
          onCustomerSelect(newValue)
        }
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue)
      }}
      fullWidth
      noOptionsText={
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant='body2' color='textSecondary'>
            No customers found
          </Typography>
          {inputValue && (
            <Typography variant='caption' color='textSecondary' sx={{ mt: 1, display: 'block' }}>
              Try searching with customer name, phone, email, or address
            </Typography>
          )}
        </Box>
      }
      renderInput={params => (
        <TextField
          {...params}
          label={required ? `${label} *` : label}
          error={error}
          helperText={helperText}
          placeholder='Name, Phone, Email, Address...'
        />
      )}
      renderOption={(props, option) => (
        <Box
          component='li'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            py: 1
          }}
          {...props}
        >
          <Typography variant='body2' sx={{ fontWeight: 500 }}>
            {option?.ledgerName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {option?.mobile && <Typography variant='caption'>📱 {option.mobile}</Typography>}
            {option?.emailId && <Typography variant='caption'>📧 {option.emailId}</Typography>}
            {option?.gstNo && <Typography variant='caption'>GST: {option.gstNo}</Typography>}
          </Box>
        </Box>
      )}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            '& .MuiAutocomplete-listbox': {
              maxHeight: '300px'
            }
          }
        }
      }}
    />
  )
}

export default CustomerAutocomplete
export type { CustomerAutocompleteProps }

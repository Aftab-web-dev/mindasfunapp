import type { UseFormSetValue, FieldValues, Path } from 'react-hook-form'

import type { Customer } from '@/components/CustomerAutocomplete'


/**
 * Utility function to auto-fill form fields with customer data
 * Maps customer object to form fields
 */
export const populateFormWithCustomer = <T extends FieldValues>(
  customer: Customer | null,
  setValue: UseFormSetValue<T>,
  fieldMappings?: {
    firstNameField?: Path<T>
    lastNameField?: Path<T>
    phoneField?: Path<T>
    emailField?: Path<T>
    addressField?: Path<T>
  }
) => {
  if (!customer) return

  // Default field names (adjust based on your form structure)
  const defaults = {
    firstNameField: 'name.first' as Path<T>,
    lastNameField: 'name.last' as Path<T>,
    phoneField: 'phone_number' as Path<T>,
    emailField: 'email' as Path<T>,
    addressField: 'address' as Path<T>,
    ...fieldMappings
  }

  // Split customer name into first and last
  const nameParts = customer.ledgerName?.trim().split(/\s+/) || []
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ')

  // Populate form fields
  if (customer.ledgerName) {
    setValue(defaults.firstNameField, firstName as any, { shouldValidate: true })

    if (lastName) {
      setValue(defaults.lastNameField, lastName as any, { shouldValidate: true })
    }
  }

  if (customer.mobile) {
    setValue(defaults.phoneField, customer.mobile as any, { shouldValidate: true })
  }

  if (customer.emailId) {
    setValue(defaults.emailField, customer.emailId as any, { shouldValidate: true })
  }

  if (customer.ledgerAddress) {
    setValue(defaults.addressField, customer.ledgerAddress as any, { shouldValidate: true })
  }
}

/**
 * Simple helper to get customer display name with additional info
 */
export const getCustomerDisplayName = (customer: Customer): string => {
  const parts = [customer.ledgerName]

  if (customer.mobile) {
    parts.push(`(${customer.mobile})`)
  }

  if (customer.gstNo) {
    parts.push(`[GST: ${customer.gstNo}]`)
  }

  return parts.filter(Boolean).join(' ')
}

/**
 * Helper to search customers with multiple field support
 */
export const searchCustomers = (customers: Customer[], searchTerm: string): Customer[] => {
  if (!searchTerm.trim()) return customers

  const lowerSearch = searchTerm.toLowerCase()

  return customers.filter(customer => {
    return (
      customer.ledgerName?.toLowerCase().includes(lowerSearch) ||
      customer.mobile?.toLowerCase().includes(lowerSearch) ||
      customer.emailId?.toLowerCase().includes(lowerSearch) ||
      customer.ledgerAddress?.toLowerCase().includes(lowerSearch) ||
      customer.gstNo?.toLowerCase().includes(lowerSearch) ||
      customer.pan?.toLowerCase().includes(lowerSearch)
    )
  })
}

/**
 * Validate if customer has required fields filled
 */
export const isCustomerDataComplete = (customer: Customer): boolean => {
  return !!(customer.ledgerName && (customer.mobile || customer.emailId))
}

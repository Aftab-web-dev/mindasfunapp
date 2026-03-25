/**
 * INTEGRATION GUIDE: Using CustomerAutocomplete in CheckIn.tsx
 * 
 * This file shows how to integrate the CustomerAutocomplete component
 * into your existing CheckIn form to enable customer search and auto-fill functionality.
 */

// ============================================
// 1. ADD IMPORTS (at the top of CheckIn.tsx)
// ============================================

// Add these imports:
// import CustomerAutocomplete from '@/components/CustomerAutocomplete'
// import { populateFormWithCustomer } from '@/utils/customerUtils'

// ============================================
// 2. UPDATE THE FORM TYPE
// ============================================

// Modify your FormData type to include selectedCustomer:
// type FormData = z.infer<ReturnType<typeof getSchema>> & {
//   selectedCustomer?: TCustomer
// }

// ============================================
// 3. UPDATE THE SCHEMA (if needed)
// ============================================

// Optionally add selectedCustomer to your validation schema:
// In getSchema function, add:
// baseFields['selectedCustomer'] = z.object({
//   ledgerId: z.number(),
//   ledgerName: z.string(),
//   mobile: z.string().optional(),
// }).optional()

// ============================================
// 4. UPDATE THE FORM JSX
// ============================================

// Add this BEFORE the existing name/phone/email fields:

// <div className='grid grid-cols-1 gap-4'>
//   <CustomerAutocomplete
//     customers={customers}
//     control={control}
//     name="selectedCustomer"
//     label="Search & Select Customer"
//     required={false}
//     onCustomerSelect={(customer) => {
//       // Auto-fill form fields when customer is selected
//       populateFormWithCustomer(customer, setValue)
//     }}
//   />
// </div>

// ============================================
// 5. COMPLETE EXAMPLE - CheckIn form structure
// ============================================

/* 
Complete form section would look like:

<form onSubmit={handleSubmit(onSubmit)}>
  <div className='bg-black w-full h-full py-40'>
    <Box className='~p-2/6 bg-[#ffffff] rounded-lg shadow-md w-[70%]' sx={{ mx: 'auto' }}>
      
      {/* Logo and Title */}
      <div className='py-10 flex flex-col items-center'>
        {data.file && (
          <div className='w-[10rem] h-[10rem] relative'>
            <Image src={data.file} alt={'Logo'} fill className='object-fill' />
          </div>
        )}
        <Typography variant='h4' gutterBottom textAlign='center'>
          {data.titile}
        </Typography>
      </div>

      {/* CUSTOMER SEARCH SECTION */}
      <div className='grid grid-cols-1 gap-4 mb-6 px-4'>
        <CustomerAutocomplete
          customers={customers}
          control={control}
          name="selectedCustomer"
          label="Search & Select Existing Customer"
          onCustomerSelect={(customer) => {
            populateFormWithCustomer(customer, setValue)
            toast.success(`Customer ${customer.ledgerName} selected`)
          }}
        />
      </div>

      {/* OTHER FORM FIELDS */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* ... existing form fields ... */}
      </div>

      <Button type='submit' disabled={isSubmitting || isLoading} variant='contained' sx={{ mt: 5 }}>
        Submit
      </Button>
    </Box>
  </div>
</form>
*/

// ============================================
// 6. ADDITIONAL FEATURES YOU CAN ADD
// ============================================

/*
A. Show customer details summary after selection:

const [selectedCustomer, setSelectedCustomer] = useState<TCustomer | null>(null)

<Card sx={{ mt: 3, mb: 3, bgcolor: 'primary.light' }}>
  <CardContent>
    <Typography variant='h6'>Selected Customer Details</Typography>
    {selectedCustomer && (
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
        <Typography><strong>Name:</strong> {selectedCustomer.ledgerName}</Typography>
        <Typography><strong>Mobile:</strong> {selectedCustomer.mobile}</Typography>
        <Typography><strong>Email:</strong> {selectedCustomer.emailId}</Typography>
        <Typography><strong>Address:</strong> {selectedCustomer.ledgerAddress}</Typography>
      </Box>
    )}
  </CardContent>
</Card>

B. Add GST/Tax info if customer has it:

{selectedCustomer?.gstNo && (
  <Alert severity="info">
    GST Number on file: {selectedCustomer.gstNo}
  </Alert>
)}

C. Conditional required fields based on customer:

onCustomerSelect={(customer) => {
  // If customer exists, make signature optional
  // If no customer, make signature required
  // You can adjust validation dynamically if needed
}}

*/

// ============================================
// 7. TIPS FOR CUSTOMIZATION
// ============================================

/*
- Field Mapping: Modify populateFormWithCustomer to map different customer fields
- Search Fields: Edit CustomerAutocomplete to search on different customer properties
- Display Format: Customize renderOption in CustomerAutocomplete to show different info
- Auto-fill Logic: Call populateFormWithCustomer with custom fieldMappings parameter
*/

export {}

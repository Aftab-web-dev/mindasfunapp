import { useEffect, useState } from 'react'

import { Button, TextField } from '@mui/material'

// import toast from 'react-hot-toast'

type FormValues = {
  barcode: string
  product: string
  price: string
  quantity: string
  amount: string
  tax: string
  tax_type: string
  tax_per: string
  tax_amount: string
  net_amount: string
}

export const FoodFormRepeater = ({ onSubmitCallback, defaultValues }: any) => {
  const [formValues, setFormValues] = useState<FormValues>({
    barcode: '',
    product: '',
    price: '',
    quantity: '',
    amount: '',
    tax: '',
    tax_type: '',
    tax_per: '',
    tax_amount: '',
    net_amount: ''
  })

  const onSubmit = async () => {
    // if (formValues.productName && !formValues.product?.startsWith('www.')) {
    //   // toast.error("URL must start with 'www.'")
    //   return
    // }
    onSubmitCallback(formValues, defaultValues?.index)
    setFormValues({
      barcode: '',
      product: '',
      price: '',
      quantity: '',
      amount: '',
      tax: '',
      tax_type: '',
      tax_per: '',
      tax_amount: '',
      net_amount: ''
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }))
  }

  // const handleFileChange = (productName: string) => {
  //   setFormValues(prevValues => ({
  //     ...prevValues,
  //     productName
  //   }))
  // }

  useEffect(() => {
    if (defaultValues?.data) {
      setFormValues({
        barcode: defaultValues.data.barcode || '',
        product: defaultValues.data.product || '',
        price: defaultValues.data.price || '',
        quantity: defaultValues.data.quantity || '',
        amount: defaultValues.data.amount || '',
        tax: defaultValues.data.tax || '',
        tax_type: defaultValues.data.tax_type || '',
        tax_per: defaultValues.data.tax_per || '',
        tax_amount: defaultValues.data.tax_amount || '',
        net_amount: defaultValues.data.net_amount || ''
      })
    }
  }, [defaultValues])

  return (
    <>
      {/* product Input */}
      <div className='grid grid-cols-2 gap-5 mt-3'>
        <TextField
          size='small'
          fullWidth
          variant='standard'
          placeholder='Barcode'
          name='barcode'
          className='pt-2'
          value={formValues.barcode}
          onChange={handleInputChange}
        />

        <TextField
          size='small'
          fullWidth
          variant='standard'
          placeholder='Product'
          name='product'
          className='pt-2'
          value={formValues.product}
          onChange={handleInputChange}
        />
        <TextField
          size='small'
          fullWidth
          variant='standard'
          placeholder='Price'
          name='price'
          className='pt-2'
          value={formValues.price}
          onChange={handleInputChange}
        />
        <TextField
          size='small'
          fullWidth
          variant='standard'
          placeholder='Quantity'
          name='quantity'
          className='pt-2'
          value={formValues.quantity}
          onChange={handleInputChange}
        />
        <TextField
          size='small'
          fullWidth
          variant='standard'
          placeholder='Amount'
          name='amount'
          className='pt-2'
          value={formValues.amount}
          onChange={handleInputChange}
        />
        <TextField
          size='small'
          fullWidth
          variant='standard'
          placeholder='Tax'
          name='tax'
          className='pt-2'
          value={formValues.tax}
          onChange={handleInputChange}
        />
        <TextField
          size='small'
          fullWidth
          variant='standard'
          placeholder='Tax Type'
          name='tax_type'
          className='pt-2'
          value={formValues.tax_type}
          onChange={handleInputChange}
        />
        <TextField
          size='small'
          fullWidth
          variant='standard'
          placeholder='Tax Per'
          name='tax_per'
          className='pt-2'
          value={formValues.tax_per}
          onChange={handleInputChange}
        />
        <TextField
          size='small'
          fullWidth
          variant='standard'
          placeholder='Tax Amount'
          name='tax_amount'
          className='pt-2'
          value={formValues.tax_amount}
          onChange={handleInputChange}
        />
        <TextField
          size='small'
          fullWidth
          variant='standard'
          placeholder='Net Amount'
          name='net_amount'
          className='pt-2'
          value={formValues.net_amount}
          onChange={handleInputChange}
        />
      </div>

      {/* Submit Button */}
      <Button variant='tonal' color='success' type='button' onClick={onSubmit} style={{ marginTop: '25px' }}>
        {defaultValues?.data ? 'Update' : 'Add'}
      </Button>
    </>
  )
}

export default FoodFormRepeater

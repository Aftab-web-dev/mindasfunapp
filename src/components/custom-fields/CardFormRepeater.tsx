import { useEffect, useState } from 'react'

import { Button, TextField } from '@mui/material'

// import toast from 'react-hot-toast'

type FormValues = {
  product: string
  price: string
  quantity: string
  amount: string
  tax: string
  tax_type: string
  tax_per: string
  tax_amount: string
  net_amount: string
  cash_balance: string
  bonus_balance: string
  token_balance: string
  point_balance: string
}

export const CardFormRepeater = ({ onSubmitCallback, defaultValues }: any) => {
  const [formValues, setFormValues] = useState<FormValues>({
    product: '',
    price: '',
    quantity: '',
    amount: '',
    tax: '',
    tax_type: '',
    tax_per: '',
    tax_amount: '',
    net_amount: '',
    cash_balance: '',
    bonus_balance: '',
    token_balance: '',
    point_balance: ''
  })

  const onSubmit = async () => {
    // if (formValues.productName && !formValues.product?.startsWith('www.')) {
    //   // toast.error("URL must start with 'www.'")
    //   return
    // }
    onSubmitCallback(formValues, defaultValues?.index)
    setFormValues({
      product: '',
      price: '',
      quantity: '',
      amount: '',
      tax: '',
      tax_type: '',
      tax_per: '',
      tax_amount: '',
      net_amount: '',
      cash_balance: '',
      bonus_balance: '',
      token_balance: '',
      point_balance: ''
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
        product: defaultValues.data.product || '',
        price: defaultValues.data.price || '',
        quantity: defaultValues.data.quantity || '',
        amount: defaultValues.data.amount || '',
        tax: defaultValues.data.tax || '',
        tax_type: defaultValues.data.tax_type || '',
        tax_per: defaultValues.data.tax_per || '',
        tax_amount: defaultValues.data.tax_amount || '',
        net_amount: defaultValues.data.net_amount || '',
        cash_balance: defaultValues.data.cash_balance || '',
        bonus_balance: defaultValues.data.bonus_balance || '',
        token_balance: defaultValues.data.token_balance || '',
        point_balance: defaultValues.data.point_balance || ''
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
        <TextField
          size='small'
          fullWidth
          variant='standard'
          placeholder='Cash Balance'
          name='cash_balance'
          className='pt-2'
          value={formValues.cash_balance}
          onChange={handleInputChange}
        />
        <TextField
          size='small'
          fullWidth
          variant='standard'
          placeholder='Bonus Balance'
          name='bonus_balance'
          className='pt-2'
          value={formValues.bonus_balance}
          onChange={handleInputChange}
        />
        <TextField
          size='small'
          fullWidth
          variant='standard'
          placeholder='Token Balance'
          name='token_balance'
          className='pt-2'
          value={formValues.token_balance}
          onChange={handleInputChange}
        />
        <TextField
          size='small'
          fullWidth
          variant='standard'
          placeholder='Point Balance'
          name='point_balance'
          className='pt-2'
          value={formValues.point_balance}
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

export default CardFormRepeater

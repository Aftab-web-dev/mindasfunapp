'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, MenuItem, Box, Typography, Button } from '@mui/material'

import classNames from 'classnames'

import toast from 'react-hot-toast'

import KanbanBoard from '@/views/apps/kanban-edit/KanbanBoard'

import CustomStepper from './ProgressBar'
import { CustomizedDatePicker } from '@/components/CustomizedDatePicker'
import Preview from './Preview'
import Details from './Details'
import EventDetail from './EventDetail'
import { eventsApi } from '@/api/events-api'
import { getUser } from '@/utils/authStorage'

// Styles Imports
import styles from '@views/apps/kanban/styles.module.css'

// type FoodType = [
//   {
//     barcode: number
//     product: number
//     price: number
//     quantity: number
//     amount: number
//     tax: number
//     tax_type: number
//     tax_percentage: number
//     tax_amount: number
//     net_amount: number
//   }
// ]

const eventFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().nonempty('Phone Number is required').min(10, 'Phone must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
  event_date: z.string().min(1, 'Event date is required'),
  event: z.string().min(1, 'Event type is required'),
  venue: z.string().min(1, 'Venue is required'),
  venue_cost: z.number().min(0, 'Venue cost must be a positive number'),
  no_of_attendees: z.number().min(1, 'Number of attendees must be at least 1'),
  food: z
    .array(
      z.object({
        product: z.string().optional(),
        price: z.number().optional(),
        quantity: z.number().optional()
      })
    )
    .optional(),
  card: z
    .array(
      z.object({
        product: z.string().optional(),
        price: z.number().optional(),
        quantity: z.number().optional()
      })
    )
    .optional(),
  gift: z
    .array(
      z.object({
        product: z.string().optional(),
        quantity: z.number().optional(),
        price: z.number().optional()
      })
    )
    .optional(),
  cake: z
    .object({
      name: z.string().optional(),
      cake_per_kg: z.number().optional(),
      cake_weight: z.number().optional(),
      cake_amount: z.number().optional(),
      writing_on_cake: z.string().optional()
    })
    .optional(),
  catering_food: z
    .object({
      menu: z.string().optional(),
      no_of_plates: z.number().optional(),
      food_cost_per_plate: z.number().optional(),
      food_amount: z.number().optional()
    })
    .optional(),
  other: z
    .object({
      arrangement: z.string().optional(),
      amount: z.number().optional()
    })
    .optional(),
  remarks: z.string(),
  net_amount: z.number()
})

type EventFormValues = z.infer<typeof eventFormSchema>

const steps = ['', '', '', '']

const EventAddForm = ({ data }: { data: any }) => {
  const [tabIndex, setTabIndex] = useState(0)

  const [eventData, setEventData] = useState<any>([
    {
      title: 'Food',
      data: []
    },
    {
      title: 'Card',
      data: []
    },
    {
      title: 'Gift',
      data: []
    },
    {
      title: 'Cake',
      data: {}
    },
    {
      title: 'Catering Food',
      data: {}
    },
    {
      title: 'Other',
      data: {}
    }
  ])

  // Initialize useForm with zodResolver
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isLoading, isSubmitting },
    trigger // <-- add this
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      event_date: data.event_date,
      event: data.event,
      venue: data.venue,
      venue_cost: data.venue_cost,
      no_of_attendees: data.no_of_attendees,
      food: data.food,
      card: data.card,
      gift: data.gift,
      cake: {
        name: data.cake.name,
        cake_per_kg: data.cake.cake_per_kg,
        cake_weight: data.cake.cake_weight,
        cake_amount: data.cake.cake_amount,
        writing_on_cake: data.cake.writing_on_cake
      },
      catering_food: {
        menu: data.catering_food.menu,
        no_of_plates: data.catering_food.no_of_plates,
        food_cost_per_plate: data.catering_food.food_cost_per_plate,
        food_amount: data.catering_food.food_amount
      },
      other: {
        arrangement: data.other.arrangement,
        amount: data.other.amount
      },
      remarks: data.remarks,
      net_amount: data.net_amount
    }
  })

  useEffect(() => {
    if (data) {
      setEventData([
        {
          title: 'Food',
          data: data.food || []
        },
        {
          title: 'Card',
          data: data.card || []
        },
        {
          title: 'Gift',
          data: data.gift || []
        },
        {
          title: 'Cake',
          data: data.cake || {}
        },
        {
          title: 'Catering Food',
          data: data.catering_food || {}
        },
        {
          title: 'Other',
          data: data.other || {}
        }
      ])
    }
  }, [data])

  const handleNext = async () => {
    let fieldsToValidate: (keyof EventFormValues)[] = []

    if (tabIndex === 0) {
      fieldsToValidate = ['name', 'phone', 'email', 'address']
    } else if (tabIndex === 1) {
      fieldsToValidate = ['event', 'event_date', 'venue', 'venue_cost', 'no_of_attendees']
    }

    // Add more if needed for other steps

    const isValid = await trigger(fieldsToValidate)

    if (tabIndex === 2) {
      setValue('food', eventData[0].data)
      setValue('card', eventData[1].data)
      setValue('gift', eventData[2].data)
      setValue('cake', eventData[3].data)
      setValue('catering_food', eventData[4].data)
      setValue('other', eventData[5].data)

      // const food = getValues('food')
      // const card = getValues('card')
      // const cake = getValues('cake')
      // const gift = getValues('gift')
      // const CFood = getValues('catering_food')
      // const othr = getValues('other')
    }

    if (isValid && tabIndex < steps.length - 1) {
      setTabIndex(tabIndex + 1)
    }
  }

  const handlePrevi = () => {
    if (tabIndex < steps.length + 1) {
      setTabIndex(tabIndex - 1)
    }
  }

  const router = useRouter()

  const onSubmit = async (formValues: EventFormValues) => {
    try {
      const storedUser = getUser()

      const items = [
        ...(formValues.food ?? []).map(item => ({ ...item, productType: 3 })),
        ...(formValues.card ?? []).map(item => ({ ...item, productType: 2 })),
        ...(formValues.gift ?? []).map(item => ({ ...item, productType: 6 }))
      ]

      // Backend treats `AddEditEventBooking` as both add (id=0) and edit (id=existing).
      // Per the requirements sheet the team confirmed this behaviour relies on the Event Id being passed.
      const existingId = (data as any)?.id

      if (!existingId) {
        toast.error('Missing event id — cannot update')

        return
      }

      const formData: any = {
        id: existingId,
        name: formValues.name,
        phone: formValues.phone,
        email: formValues.email,
        address: formValues.address,
        eventDate: formValues.event_date,
        event: formValues.event,
        eventDescription: (formValues as any).eventDescription,
        noOfAttendees: formValues.no_of_attendees,
        venu: formValues.venue,
        venuCost: formValues.venue_cost,
        cakeKg: formValues.cake?.cake_weight,
        cakePerKg: formValues.cake?.cake_per_kg,
        cakeAmt: formValues.cake?.cake_amount,
        writingsOnCake: formValues.cake?.writing_on_cake,
        cateringMeanu: formValues.catering_food?.menu,
        foodCostPerPlate: formValues.catering_food?.food_cost_per_plate,
        noOfPlates: formValues.catering_food?.no_of_plates,
        cateringFoodAmt: formValues.catering_food?.food_amount,
        otherArrangement: formValues.other?.arrangement,
        otherArrangementAmt: formValues.other?.amount,
        remarks: (formValues as any).remarks,
        netAmt: (formValues as any).net_amount,
        status: 1,
        branchId: storedUser?.branchId,
        Item: items,
        createdBy: (data as any)?.createdBy ?? storedUser?.employeeId,
        modifiedBy: storedUser?.employeeId,
        createdOn: (data as any)?.createdOn ?? new Date(),
        modifiedOn: new Date(),
        cake: (formValues.cake as any)?.cake_id,
        cakeData: formValues.cake,
        foodAmt: 0,
        cardAmt: 0,
        giftAmt: 0,
        discountPer: 0,
        discountAmt: 0,
        otherAdd: 0,
        otherAddDesc: '',
        otherDed: 0,
        otherDedDesc: '',
        terms: '',
        payId: 0,
        advancePay: 0,
        ledgerId: (data as any)?.ledgerId ?? 0
      }

      const response = await eventsApi.addEvent({ body: formData })

      if (response.status === 200) {
        toast.success('Booking Edited Successfully')
        router.push('/admin/events')
      }
    } catch (err) {
      toast.error('Error updating event')
    }
  }

  return (
    <>
      <div className='p-6 bg-[#ffffff] rounded-lg mb-5 shadow-md'>
        {' '}
        <CustomStepper currentStep={tabIndex} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex justify-between items-center text-center'>
          <Typography
            variant='h5'
            align='left'
            gutterBottom
            className='font-bold text-[#4b41ba] leading-[0%] text-base sm:text-lg md:text-xl lg:text-2xl'
          >
            EVENT BOOKING
          </Typography>
          {/* Next Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4, paddingBottom: '10px' }}>
            {tabIndex > 0 && (
              <Button variant='contained' color='primary' onClick={handlePrevi} disabled={tabIndex < 1}>
                Back
              </Button>
            )}
            {tabIndex < 3 && (
              <Button variant='contained' color='primary' onClick={handleNext} disabled={tabIndex === steps.length - 1}>
                Next
              </Button>
            )}
            {tabIndex == 3 && (
              <Button variant='contained' color='primary' type='submit' disabled = {isSubmitting || isLoading}>
                Submit
              </Button>
            )}
          </Box>
        </div>
        {tabIndex === 0 && (
          <>
            <div className='p-6 bg-[#ffffff] rounded-lg shadow-md mt-2'>
              <div className='grid grid-cols-2 gap-6 mb-6 mt-10'>
                <Controller
                  name='name'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Name'
                      fullWidth
                      variant='standard'
                      size='small'
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
                <Controller
                  name='phone'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Phone'
                      fullWidth
                      variant='standard'
                      size='small'
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  )}
                />
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Email'
                      fullWidth
                      variant='standard'
                      size='small'
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
                <Controller
                  name='address'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Address'
                      fullWidth
                      variant='standard'
                      size='small'
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  )}
                />
              </div>
            </div>
          </>
        )}

        {tabIndex === 1 && (
          <>
            <div className='p-6 bg-[#ffffff] rounded-lg shadow-md mt-2'>
              <div className='grid grid-cols-2 gap-6 mb-6 mt-10'>
                <Controller
                  name='event'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''} // Ensure controlled
                      style={{ marginTop: '10px' }}
                      label='Event'
                      select
                      fullWidth
                      size='small'
                      variant='standard'
                      error={!!errors.event}
                      helperText={errors.event?.message}
                    >
                      <MenuItem value=''>--Select--</MenuItem>
                      <MenuItem value='Wedding'>Wedding</MenuItem>
                      <MenuItem value='Birthday'>Birthday</MenuItem>
                    </TextField>
                  )}
                />
                <Controller
                  name='event_date'
                  control={control}
                  render={({ field }) => (
                    <CustomizedDatePicker {...field} control={control} label='Event Date' errors={errors} />
                  )}
                />

                <Controller
                  name='venue'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''} // Ensure controlled
                      label='Venue'
                      select
                      fullWidth
                      size='small'
                      variant='standard'
                      error={!!errors.venue}
                      helperText={errors.venue?.message}
                    >
                      <MenuItem value=''>--Select--</MenuItem>
                      <MenuItem value='Hall A'>Hall A</MenuItem>
                    </TextField>
                  )}
                />

                <Controller
                  name='venue_cost'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      style={{ marginTop: '3px' }}
                      label='Venue Cost'
                      type='number'
                      fullWidth
                      variant='standard'
                      size='small'
                      error={!!errors.venue_cost}
                      helperText={errors.venue_cost?.message}
                      onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      value={field.value}
                    />
                  )}
                />
                <Controller
                  name='no_of_attendees'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='No Of Attendees'
                      type='number'
                      fullWidth
                      variant='standard'
                      size='small'
                      error={!!errors.no_of_attendees}
                      helperText={errors.no_of_attendees?.message}
                      onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      value={field.value}
                    />
                  )}
                />
              </div>
            </div>
          </>
        )}

        {tabIndex === 2 && (
          <>
            <div className='p-6 bg-[#ffffff] rounded-lg shadow-md mt-2'>
              <div className={classNames(styles.scroll, 'w-full overflow-auto pis-2 -mis-2')}>
                <KanbanBoard setEventData={setEventData} eventData={eventData} />
              </div>
            </div>
          </>
        )}

        {tabIndex === 3 && (
          <>
            {/*
              Define personalInfo from form values to pass to Preview.
            */}
            {(() => {
              const personalInfo = {
                name: getValues('name'),
                phone: getValues('phone'),
                email: getValues('email'),
                address: getValues('address')
              }

              const eventInfo = {
                event_date: getValues('event_date'),
                event: getValues('event'),
                venue: getValues('venue'),
                venue_cost: getValues('venue_cost'),
                no_of_attendees: getValues('no_of_attendees')
              }

              return (
                <div className='grid grid-cols-12 '>
                  <div className='col-span-8 '>
                    <Details
                      control={control}
                      errors={errors}
                      setTabIndex={setTabIndex}
                      data={eventData || ''}
                      setValue={setValue}
                      venue_cost={getValues('venue_cost')}
                    />
                  </div>
                  <div className='col-span-4 mr-4'>
                    <Preview setTabIndex={setTabIndex} data={personalInfo} />
                    <EventDetail setTabIndex={setTabIndex} data={eventInfo} />
                  </div>
                </div>
              )
            })()}
          </>
        )}
      </form>
    </>
  )
}

export default EventAddForm

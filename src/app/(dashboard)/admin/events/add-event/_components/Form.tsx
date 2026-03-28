'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, MenuItem, Box, Typography, Button, CircularProgress } from '@mui/material'

import classNames from 'classnames'
import toast from 'react-hot-toast'

import KanbanBoard from '@/views/apps/kanban/KanbanBoard'

import CustomStepper from './ProgressBar'
import { CustomizedDatePicker } from '@/components/CustomizedDatePicker'
import Preview from './Preview'
import Details from './Details'
import EventDetail from './EventDetail'

// Styles Imports
import styles from '@views/apps/kanban/styles.module.css'
import { dropdownApi } from '@/api/drop-down-api'
import { getUser } from '@/utils/authStorage'
import { eventsApi } from '@/api/events-api'

const eventFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().nonempty('Phone Number is required').min(10, 'Phone must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  eventDescription: z.string().min(1, 'Event Description required'),
  address: z.string().min(1, 'Address is required'),
  event_date: z.string().min(1, 'Event date is required'),
  event: z.number().min(1, 'Event type is required'),
  venue: z.number().min(1, 'Venue is required'),
  venue_cost: z
    .number({
      required_error: 'Venue cost is required',
      invalid_type_error: 'Venue cost is required'
    })
    .min(1, 'Venue cost must be greater than 0'),
  no_of_attendees: z
    .number({
      required_error: 'Number of attendees is required',
      invalid_type_error: 'Number of attendees is required'
    })
    .min(1, 'Number of attendees must be at least 1'),
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
      name: z.coerce.number().optional(),
      cake_per_kg: z.number().optional(),
      cake_weight: z.number().optional(),
      cake_amount: z.number().optional(),
      writing_on_cake: z.string().optional(),
      cake_id: z.string().optional()
    })
    .optional(),
  catering_food: z
    .object({
      menu: z.string().optional(),
      no_of_plates: z.number().optional(),
      food_cost_per_plate: z.coerce.number().optional(),
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

const EventAddForm = () => {
  const storedUser = getUser()

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

  const [loading, setLoading] = useState(true)

  const [events, setEvents] = useState([])
  const [venues, setVenues] = useState([])

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
      name: '',
      phone: '',
      eventDescription: '',
      email: '',
      address: '',
      event_date: '',
      event: undefined,
      venue: undefined,
      venue_cost: 0,
      no_of_attendees: 1,
      food: [],
      card: [],
      gift: [],
      cake: {
        name: undefined,
        cake_per_kg: 0,
        cake_weight: 0,
        cake_amount: 0,
        writing_on_cake: ''
      },
      catering_food: {
        menu: '',
        no_of_plates: 0,
        food_cost_per_plate: 0,
        food_amount: 0
      },
      other: {
        arrangement: '',
        amount: 0
      },
      remarks: '',
      net_amount: 0
    }
  })

  const handleNext = async () => {
    let fieldsToValidate: (keyof EventFormValues)[] = []

    if (tabIndex === 0) {
      fieldsToValidate = ['name', 'phone', 'email', 'address']
    } else if (tabIndex === 1) {
      fieldsToValidate = ['event', 'event_date', 'venue', 'venue_cost', 'no_of_attendees', 'eventDescription']
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

  const api = async () => {
    try {
      setLoading(true)

      if (!storedUser) {
        toast.error('Please Log in')
        router.push('/login')
      }

      const branchId = storedUser?.branchId

      // if (!branchId) throw new Error('Branch ID missing')

      const [eventsRes, venuesRes] = await Promise.all([
        dropdownApi.event({ branchId }),
        dropdownApi.venue({ branchId })
      ])

      if (eventsRes.data.status === 'success') {
        setEvents(eventsRes.data.data)
      }

      if (venuesRes.data.status === 'success') {
        setVenues(venuesRes.data.data)
      }
    } catch (error) {
      toast.error('Error occurred while loading data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    api()
  }, [])


  const onSubmit = async (data: EventFormValues) => {
    try {
      const items = [
        ...(data.food ?? []).map(item => ({
          ...item,
          productType: 3 // food
        })),
        ...(data.card ?? []).map(item => ({
          ...item,
          productType: 2 // card
        })),
        ...(data.gift ?? []).map(item => ({
          ...item,
          productType: 6 // gift
        }))
      ]

      const formData = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        eventDate: data.event_date,
        event: data.event,
        eventDescription: data.eventDescription,
        noOfAttendees: data.no_of_attendees,
        venu: data.venue,
        venuCost: data.venue_cost,

        cakeKg: data.cake?.cake_weight,
        cakePerKg: data.cake?.cake_per_kg,
        cakeAmt: data.cake?.cake_amount,
        writingsOnCake: data.cake?.writing_on_cake,
        cateringMeanu: data.catering_food?.menu,
        foodCostPerPlate: data.catering_food?.food_cost_per_plate,
        noOfPlates: data.catering_food?.no_of_plates,
        cateringFoodAmt: data.catering_food?.food_amount,
        otherArrangement: data.other?.arrangement,
        otherArrangementAmt: data.other?.amount,
        remarks: data.remarks,
        netAmt: data.net_amount,
        status: 1,
        branchId: storedUser?.branchId,
        Item: items,
        createdBy: storedUser?.employeeId,
        modifiedBy: storedUser?.employeeId,
        createdOn: new Date(),
        modifiedOn: new Date(),
        cake: data.cake?.cake_id,
        cakeData: data.cake,

        // TODO
        foodAmt: 10,
        cardAmt: 10,
        giftAmt: 10,
        discountPer: 10,
        discountAmt: 10,

        // ! Dummy
        id: 0,
        otherAdd: 0,
        otherAddDesc: '',
        otherDed: 0,
        otherDedDesc: '',
        terms: '',
        payId: 0,
        advancePay: 0,
        ledgerId: 0
      }

      const response = await eventsApi.addEvent({ body: formData })

      if (response.status === 200) {
        toast.success('Booked Successfully')
        router.push('/admin/events')
      }
    } catch (error) {
      toast.error('error adding event')
    }
  }

  return (
    <div className='max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-6'>
      {/* Page Header */}
      <div className='mb-4 sm:mb-8 px-1'>
        <h1 className='text-xl sm:text-2xl font-bold text-[#1E293B]'>Event Booking</h1>
        <p className='text-xs sm:text-sm text-[#94A3B8] font-medium mt-0.5'>
          {tabIndex === 0 && 'Fill in customer details'}
          {tabIndex === 1 && 'Configure event details'}
          {tabIndex === 2 && 'Set up arrangements'}
          {tabIndex === 3 && 'Review and submit'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {tabIndex === 0 && (
          <div className='rounded-none sm:rounded-2xl border-0 sm:border sm:border-[rgba(0,0,0,0.06)] bg-white overflow-hidden'>
            <div className='px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-[rgba(0,0,0,0.06)]'>
              <CustomStepper currentStep={tabIndex} />
            </div>
            <div className='px-3 py-4 sm:p-6 md:p-8'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
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
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        onWheel: e => (e.currentTarget as HTMLInputElement).blur(),
                        className: 'no-spinner' // custom class to remove spinners
                      }}
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
              <Box sx={{ display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-end' }, mt: 3, pt: 2.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <Button variant='contained' fullWidth onClick={handleNext} disableElevation sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem', backgroundColor: '#523F99', color: '#FFFFFF', height: { xs: 48, sm: 40 }, maxWidth: { sm: 'fit-content' }, px: 3.5, '&:hover': { backgroundColor: '#6B52C4' } }}>
                  Next
                </Button>
              </Box>
            </div>
          </div>
        )}

        {tabIndex === 1 && (
          <div className='rounded-none sm:rounded-2xl border-0 sm:border sm:border-[rgba(0,0,0,0.06)] bg-white overflow-hidden'>
            <div className='px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-[rgba(0,0,0,0.06)]'>
              <CustomStepper currentStep={tabIndex} />
            </div>
            <div className='px-3 py-4 sm:p-6 md:p-8'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
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
                      {events.map((event: { id: string; value: string }) => (
                        <MenuItem key={event.id} value={event.id}>
                          {event.value}
                        </MenuItem>
                      ))}
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
                      {venues.map((venue: { id: string; value: string }) => (
                        <MenuItem key={venue.id} value={venue.id}>
                          {venue.value}
                        </MenuItem>
                      ))}
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
                      onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      value={field.value}
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        onWheel: e => (e.currentTarget as HTMLInputElement).blur(),
                        className: 'no-spinner' // custom class to remove spinners
                      }}
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
                      onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      value={field.value}
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        onWheel: e => (e.currentTarget as HTMLInputElement).blur(),
                        className: 'no-spinner' // custom class to remove spinners
                      }}
                    />
                  )}
                />
                <Controller
                  name='eventDescription'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Event Description'
                      fullWidth
                      variant='standard'
                      size='small'
                      error={!!errors.eventDescription}
                      helperText={errors.eventDescription?.message}
                    />
                  )}
                />
              </div>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: { sm: 'flex-end' }, gap: 1.5, mt: 3, pt: 2.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <Button variant='outlined' onClick={handlePrevi} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem', height: { xs: 48, sm: 40 }, px: 3.5, borderColor: 'rgba(0,0,0,0.12)', color: '#475569', '&:hover': { borderColor: '#523F99', color: '#523F99' } }}>Back</Button>
                <Button variant='contained' onClick={handleNext} disableElevation sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem', backgroundColor: '#523F99', color: '#FFFFFF', height: { xs: 48, sm: 40 }, px: 3.5, '&:hover': { backgroundColor: '#6B52C4' } }}>Next</Button>
              </Box>
            </div>
          </div>
        )}

        {tabIndex === 2 && (
          <div className='rounded-none sm:rounded-2xl border-0 sm:border sm:border-[rgba(0,0,0,0.06)] bg-white overflow-hidden'>
            <div className='px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-[rgba(0,0,0,0.06)]'>
              <CustomStepper currentStep={tabIndex} />
            </div>
            <div className='px-3 py-4 sm:p-6 md:p-8'>
              <div className={classNames(styles.scroll, 'w-full overflow-auto pis-2 -mis-2')}>
                <KanbanBoard setEventData={setEventData} eventData={eventData} />
              </div>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: { sm: 'flex-end' }, gap: 1.5, mt: 3, pt: 2.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <Button variant='outlined' onClick={handlePrevi} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem', height: { xs: 48, sm: 40 }, px: 3.5, borderColor: 'rgba(0,0,0,0.12)', color: '#475569', '&:hover': { borderColor: '#523F99', color: '#523F99' } }}>Back</Button>
                <Button variant='contained' onClick={handleNext} disableElevation sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem', backgroundColor: '#523F99', color: '#FFFFFF', height: { xs: 48, sm: 40 }, px: 3.5, '&:hover': { backgroundColor: '#6B52C4' } }}>Next</Button>
              </Box>
            </div>
          </div>
        )}

        {tabIndex === 3 && (
          <div className='rounded-none sm:rounded-2xl border-0 sm:border sm:border-[rgba(0,0,0,0.06)] bg-white overflow-hidden'>
            <div className='px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-[rgba(0,0,0,0.06)]'>
              <CustomStepper currentStep={tabIndex} />
            </div>
            <div className='px-3 py-4 sm:p-6 md:p-8'>
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
                  <div className='grid grid-cols-1 xl:grid-cols-12 gap-6'>
                    <div className='xl:col-span-8'>
                      <Details
                        control={control}
                        errors={errors}
                        setTabIndex={setTabIndex}
                        data={eventData || ''}
                        setValue={setValue}
                        venue_cost={getValues('venue_cost')}
                      />
                    </div>
                    <div className='xl:col-span-4'>
                      <Preview setTabIndex={setTabIndex} data={personalInfo} />
                      <EventDetail setTabIndex={setTabIndex} data={eventInfo} />
                    </div>
                  </div>
                )
              })()}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: { sm: 'flex-end' }, gap: 1.5, mt: 3, pt: 2.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <Button variant='outlined' onClick={handlePrevi} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem', height: { xs: 48, sm: 40 }, px: 3.5, borderColor: 'rgba(0,0,0,0.12)', color: '#475569', '&:hover': { borderColor: '#523F99', color: '#523F99' } }}>Back</Button>
                <Button variant='contained' type='submit' disabled={isSubmitting || isLoading} disableElevation sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem', backgroundColor: '#523F99', color: '#FFFFFF', height: { xs: 48, sm: 40 }, px: 3.5, '&:hover': { backgroundColor: '#6B52C4' } }}>Submit</Button>
              </Box>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default EventAddForm

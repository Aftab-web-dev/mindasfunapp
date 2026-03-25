'use client'
import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextField, Button, MenuItem } from '@mui/material'
import toast from 'react-hot-toast'
import { MdOutlineAccessTime } from 'react-icons/md'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const timeSlots = [
  { time: '10:00 AM - 11:00 AM', booked: false },
  { time: '11:00 AM - 12:00 PM', booked: false },
  { time: '12:00 PM - 1:00 PM', booked: true },
  { time: '1:00 PM - 2:00 PM', booked: false },
  { time: '2:00 PM - 3:00 PM', booked: false },
  { time: '3:00 PM - 4:00 PM', booked: true },
  { time: '4:00 PM - 5:00 PM', booked: false },
  { time: '5:00 PM - 6:00 PM', booked: false },
  { time: '6:00 PM - 7:00 PM', booked: false },
  { time: '7:00 PM - 8:00 PM', booked: false }
]

// Zod Schema
const bookingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Phone is required'),
  email: z.string().email('Invalid email'),
  address: z.string().min(1, 'Address is required'),
  event: z.string().min(1, 'Please select an event'),
  venue: z.string().min(1, 'Please select an Venue'),
  venue_cost: z.string().min(1, 'Please select an Venue Cost'),
  number_of_attendees: z.string().min(1, 'Enter A number'),
  event_date: z.date({
    required_error: 'Event Date is required',
    invalid_type_error: 'Invalid date format'
  }),
  slot: z.string().min(1, 'Please select a slot')
})

type BookingFormData = z.infer<typeof bookingSchema>

export default function AddBooking() {
  const [selectedSlot, setSelectedSlot] = useState('')

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isLoading, isSubmitting }
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      event: '',
      event_date: undefined,
      slot: '',
      venue: '',
      venue_cost: '',
      number_of_attendees: ''
    }
  })

  const router = useRouter()

  const onSubmit = (data: BookingFormData) => {
    console.log('Booking submitted:', data)
    toast.success('Booking Submitted!')
    router.push('/customer/home')
  }

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot)
    setValue('slot', slot)
  }

  return (
    <div className='max-w-4xl mx-auto mt-10 border border-yellow-400 rounded-xl p-6 bg-white shadow'>
      <h1 className='text-2xl font-semibold text-purple-600 flex items-center gap-2 mb-6'>
        <MdOutlineAccessTime className='text-3xl' />
        Event Booking
      </h1>

      {/* Form Fields */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <TextField fullWidth label='Name' {...field} error={!!errors.name} helperText={errors.name?.message} />
          )}
        />

        <Controller
          name='phone'
          control={control}
          render={({ field }) => (
            <TextField fullWidth label='Phone' {...field} error={!!errors.phone} helperText={errors.phone?.message} />
          )}
        />

        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <TextField fullWidth label='Email' {...field} error={!!errors.email} helperText={errors.email?.message} />
          )}
        />

        <Controller
          name='address'
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              multiline
              label='Address'
              {...field}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          )}
        />

        <Controller
          name='number_of_attendees'
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              label='Number Of Attendees'
              {...field}
              error={!!errors.number_of_attendees}
              helperText={errors.number_of_attendees?.message}
            />
          )}
        />
        <Controller
          name='event'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? ''} // Ensure controlled
              label='Event'
              select
              fullWidth
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
          rules={{ required: 'Event Date is required' }}
          render={({ field }) => (
            <AppReactDatepicker
              showYearDropdown
              showMonthDropdown
              className='w-full'
              dateFormat='dd/MM/yyyy'
              selected={field.value}
              onChange={field.onChange}
              placeholderText='DD/MM/YYYY'
              customInput={
                <TextField
                  fullWidth
                  label='Event Date'
                  placeholder='DD-MM-YYYY'
                  error={!!errors.event_date}
                  helperText={typeof errors.event_date?.message === 'string' ? errors.event_date.message : undefined}
                />
              }
            />
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
              error={!!errors.venue}
              helperText={errors.venue?.message}
            >
              <MenuItem value=''>--Select--</MenuItem>
              <MenuItem value='hall_a'>Hall A</MenuItem>
              <MenuItem value='hall_b'>Hall B</MenuItem>
            </TextField>
          )}
        />

        <Controller
          name='venue_cost'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? '3000'} // Ensure controlled
              label='Venue Cost'
              fullWidth
              disabled
              error={!!errors.venue_cost}
              helperText={errors.venue_cost?.message}
            />
          )}
        />

        {/* Time Slot Selector */}
        <h2 className='text-lg font-medium mb-2 flex items-center gap-2 text-purple-600'>
          <MdOutlineAccessTime />
          Available Time Slots
        </h2>
        <div className='grid grid-cols-2 gap-3'>
          {timeSlots.map((slot, index) => (
            <div
              key={index}
              onClick={() => !slot.booked && handleSlotSelect(slot.time)}
              className={`flex items-center justify-between px-4 py-2 border rounded-md transition cursor-pointer ${
                slot.booked
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : selectedSlot === slot.time
                    ? 'bg-purple-100 border-purple-400'
                    : 'hover:bg-purple-50'
              }`}
            >
              <span className='flex items-center gap-2'>
                <MdOutlineAccessTime className='text-lg' />
                {slot.time}
              </span>
              {slot.booked && <span className='text-xs text-red-500 bg-red-100 px-2 py-0.5 rounded-full'>Booked</span>}
            </div>
          ))}
        </div>
        {errors.slot && <p className='text-sm text-red-500'>{errors.slot.message}</p>}

        <Button type='submit' disabled = {isSubmitting || isLoading} variant='contained' color='primary' className='mt-4'>
          Submit Booking
        </Button>
      </form>
    </div>
  )
}

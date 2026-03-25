'use client'
import Preview from './Preview'
import Details from './Details'
import EventDetail from './EventDetail'

const EventView = ({ data }: { data: any }) => {
  if (!data) {
    return <div>Loading...</div>
  }

  const personalInfo = {
    _id: data?._id || '',
    name: data?.name || '',
    phone: data?.phone || '',
    email: data?.email || '',
    address: data?.address || ''
  }

  const eventInfo = {
    _id: data?._id || '',

    event_date: data?.event_date || '',
    event: data?.event || '',
    venue: data?.venue || '',
    venue_cost: data?.venue_cost || 0,
    no_of_attendees: data?.no_of_attendees || 0
  }

  const eventData = [
    {
      title: 'Food',
      data: data?.food || []
    },
    {
      title: 'Card',
      data: data?.card || []
    },
    {
      title: 'Gift',
      data: data?.gift || []
    },
    {
      title: 'Cake',
      data: data?.cake || {}
    },
    {
      title: 'Catering Food',
      data: data?.catering_food || {}
    },
    {
      title: 'Other',
      data: data?.other || {}
    }
  ]

  const remarks =
    data?.remarks ||
    'Hello, this is a sample remark for the event. Please ensure to check all details before proceeding with the booking. Thank you!'

  const id = data?._id || ''
  const venue_cost = data?.venue_cost || 0

  return (
    <>
      <div>
        <div className='grid grid-cols-12  '>
          <div className='col-span-8 hidden lg:block'>
            <Details data={eventData || ''} remarks={remarks} venue_cost={venue_cost} id={id} />
          </div>
          <div className='col-span-4 mr-4 hidden lg:block'>
            <Preview data={personalInfo} />
            <EventDetail data={eventInfo} />
          </div>
          <div className='col-span-6 mr-4  lg:hidden'>
            <Preview data={personalInfo} />
          </div>
          <div className='col-span-6 mr-4 lg:hidden'>
            <EventDetail data={eventInfo} />
          </div>{' '}
          <div className='col-span-12  lg:hidden '>
            <Details data={eventData || ''} remarks={remarks} venue_cost={venue_cost} id={id} />
          </div>
        </div>
      </div>
    </>
  )
}

export default EventView

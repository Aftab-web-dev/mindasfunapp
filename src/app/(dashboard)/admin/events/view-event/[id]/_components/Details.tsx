import React from 'react'

import { useRouter } from 'next/navigation'

interface ProductItem {
  product: string
  price: number | string
  quantity: number | string
  id: string
}

interface CakeData {
  name: string
  cake_weight: string
  writing_on_cake: string
  cake_per_kg: number
  cake_amount: number
  id: string
}

interface CateringFoodData {
  menu: string
  no_of_plates: string
  food_cost_per_plate: number
  food_amount: number
  id: string
}

interface OtherData {
  arrangement: string
  amount: string
  id: string
}

type ItemData = ProductItem[] | CakeData | CateringFoodData | OtherData

interface OrderItem {
  title: string
  data: ItemData
}

function Details({
  data,
  remarks,

  id,
  venue_cost
}: {
  data: any
  remarks: string

  id: string
  venue_cost: number | string
}) {
  const router = useRouter()

  const subtotal = (data as OrderItem[]).reduce((sum, item) => {
    if (Array.isArray(item.data)) {
      // Sum for array of data
      return sum + item.data.reduce((s, p) => s + Number(p.price) * Number(p.quantity), 0)
    } else if (item.title === 'Cake' && (item.data as CakeData)?.cake_amount) {
      return sum + Number((item.data as CakeData).cake_amount)
    } else if (item.title === 'Catering Food' && (item.data as CateringFoodData)?.food_amount) {
      return sum + Number((item.data as CateringFoodData).food_amount)
    } else if (item.title === 'Other' && (item.data as OtherData)?.amount) {
      return sum + Number((item.data as OtherData).amount)
    }

    return sum
  }, 0)

  const discount = subtotal === 0 ? 0 : 2
  const tax = subtotal === 0 ? 0 : 28
  const total = subtotal - discount + tax + Number(venue_cost)

  return (
    <div className='bg-white rounded-xl shadow p-6 w-full mt-2'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold'>Order details</h2>
        <div className='text-gray-500 text-sm'>
          <button
            className='text-indigo-500 text-[15px] bg-transparent cursor-pointer'
            onClick={() => router.push(`/admin/events/edit-event/${id}`)}
          >
            Edit
          </button>
          {''} / {''}
          <button
            className='text-indigo-500 text-[15px] bg-transparent cursor-pointer'
            onClick={() => router.push(`/admin/events`)}
          >
            Back to Events
          </button>
        </div>
      </div>
      <table className='w-full text-left'>
        <thead>
          <tr className='text-gray-500 text-sm'>
            <th className='py-2 px-2 font-medium'>ITEMS</th>
            <th className='py-2 px-2 font-medium'>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: OrderItem, idx: number) => (
            <tr key={idx} className=''>
              <td className='py-2 px-2 border-b border-gray-200'>
                <div className='flex items-center gap-2'>
                  <div>
                    <h3 className='text-sm font-medium'>{item.title}</h3>
                    {Array.isArray(item.data) ? (
                      (item.data as ProductItem[]).map((product: ProductItem, index: number) => (
                        <p key={index} className='text-xs text-gray-500'>
                          {product.product} - ₹{product.price} x {product.quantity}
                        </p>
                      ))
                    ) : item.data ? (
                      <>
                        {item.title === 'Cake' && (item.data as CakeData)?.name && (
                          <p className='text-xs text-gray-500'>
                            {(item.data as CakeData).name} ({(item.data as CakeData).cake_weight}kg) - ₹
                            {(item.data as CakeData).cake_amount}
                          </p>
                        )}
                        {item.title === 'Catering Food' && (item.data as CateringFoodData)?.menu && (
                          <p className='text-xs text-gray-500'>
                            {(item.data as CateringFoodData).menu} - {(item.data as CateringFoodData).no_of_plates}{' '}
                            plates - ₹{(item.data as CateringFoodData).food_amount}
                          </p>
                        )}
                        {item.title === 'Other' && (item.data as OtherData)?.arrangement && (
                          <p className='text-xs text-gray-500'>
                            {(item.data as OtherData).arrangement} - ₹{(item.data as OtherData).amount}
                          </p>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>
              </td>
              <td className='py-2 px-2 border-b border-gray-200'>
                {Array.isArray(item.data)
                  ? (item.data as ProductItem[]).length > 0
                    ? `₹${(item.data as ProductItem[]).reduce((sum: number, p: ProductItem) => sum + Number(p.price) * Number(p.quantity), 0)}`
                    : '-'
                  : item.title === 'Cake' && (item.data as CakeData)?.cake_amount
                    ? `₹${(item.data as CakeData).cake_amount}`
                    : item.title === 'Catering Food' && (item.data as CateringFoodData)?.food_amount
                      ? `₹${(item.data as CateringFoodData).food_amount}`
                      : item.title === 'Other' && (item.data as OtherData)?.amount
                        ? `₹${(item.data as OtherData).amount}`
                        : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex justify-between items-center'>
        <div className='text-gray-500 text-sm mt-4 w-full'>
          <p className=''>
            Remarks:
            <br />
            {remarks || 'No remarks provided'}
          </p>
        </div>
        <div className='flex flex-col items-end mt-6 gap-1 text-sm w-full'>
          <div>
            Subtotal: <span className='font-medium'>₹{subtotal}</span>
          </div>
          <div>
            Venue Cost: <span className='font-medium'>₹{venue_cost}</span>
          </div>
          <div>
            Discount: <span className='font-medium'>₹{discount}</span>
          </div>
          <div>
            Tax: <span className='font-medium'>₹{tax}</span>
          </div>
          <div className='font-semibold text-base'>
            Total: <span className='font-medium'>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details

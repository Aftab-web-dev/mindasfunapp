'use client'
import React, { useEffect, useRef, useState } from 'react'

import Link from 'next/link'

import { FaGamepad, FaWallet, FaCalendarAlt, FaClock,  FaMoneyBillAlt, FaFileSignature } from 'react-icons/fa'

import { customerModuleApi } from '@/api/customer-module-api'

const Home = () => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [cardCount, setCardCount] = useState(1)
  const [customer, setCustomer] = useState<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const ledgerId = sessionStorage.getItem('cusLedgerId')

    if (!ledgerId) return

    customerModuleApi.getCustomerData({ ledgerId }).then(res => {
      setCustomer(res.data?.data ?? res.data)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const updateCardCount = () => {
      const width = window.innerWidth

      if (width < 640) {
        setCardCount(1) // max-sm
      } else if (width < 768) {
        setCardCount(2) // sm to md
      } else {
        setCardCount(0) // grid mode
      }
    }

    updateCardCount()
    window.addEventListener('resize', updateCardCount)

    return () => window.removeEventListener('resize', updateCardCount)
  }, [])

  useEffect(() => {
    if (cardCount === 0) return

    const interval = setInterval(() => {
      const container = carouselRef.current

      if (!container) return

      const cardWidth = container.offsetWidth / cardCount
      const isAtEnd = container.scrollLeft + container.offsetWidth >= container.scrollWidth - 1

      if (isAtEnd) {
        container.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        container.scrollBy({ left: cardWidth, behavior: 'smooth' })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [cardCount])

  const cards = [
    {
      href: '/customer/event-booking',
      icon: <FaCalendarAlt className='text-2xl mb-2' />,
      title: 'Booking',
      desc: 'Book Event',
      gradient: 'from-sky-500 to-blue-600'
    },
    {
      href: '/customer/recharge',
      icon: <FaMoneyBillAlt className='text-2xl mb-2' />,
      title: 'Recharge',
      desc: 'Add funds',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      href: '/customer/history',
      icon: <FaClock className='text-2xl mb-2' />,
      title: 'History',
      desc: 'View transactions',
      gradient: 'from-violet-500 to-fuchsia-500'
    },
    {
      href: '/customer/waiver',
      icon: <FaFileSignature className='text-2xl mb-2' />,
      title: 'Waiver',
      desc: 'Sign waiver',
      gradient: 'from-pink-500 to-rose-500'
    }
  ]

  return (
    <div className='p-4 max-w-6xl mx-auto'>
      {/* Welcome Banner */}
      <div className='bg-gradient-to-r from-purple-600 to-blue-500 text-white p-6 rounded-xl flex justify-between items-center mb-6 shadow-md'>
        <div>
          <p className='text-2xl max-md:text-lg font-bold mb-1'>Welcome back, {customer?.ledgerName || customer?.name || 'Gamer'}!</p>
          <p className='text-sm max-md:text-xs'>Ready for your next gaming session?</p>
        </div>
        <FaGamepad className='text-4xl opacity-50' />
      </div>

      {/* Top Stats */}
      <div className=' mb-6 '>
        <div className='bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 rounded-xl flex justify-between items-center shadow'>
          <div>
            <p className='text-sm'>Balance</p>
            <h3 className='text-2xl font-bold'>₹{customer?.cashBalance ?? customer?.cardBalance ?? 0}</h3>
          </div>
          <FaWallet className='text-2xl max-sm:hidden' />
        </div>


      </div>

      {/* Cards Section */}
      <div>
        {/* Mobile Carousel (max-md) */}
        <div
          ref={carouselRef}
          className='flex gap-4 overflow-x-auto scroll-smooth md:hidden'
          style={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none'
          }}
        >
          {cards.map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className='scroll-snap-start shrink-0'
              style={{
                width: `${100 / cardCount}%`,
                minWidth: `${100 / cardCount}%`
              }}
            >
              <div
                className={`bg-gradient-to-r ${card.gradient} text-white p-6 rounded-xl shadow flex flex-col items-start h-full`}
              >
                {card.icon}
                <h4 className='text-lg font-semibold'>{card.title}</h4>
                <p className='text-sm'>{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className='hidden md:grid md:grid-cols-2 gap-4'>
          {cards.map((card, index) => (
            <Link href={card.href} key={index}>
              <div
                className={`bg-gradient-to-r ${card.gradient} text-white p-6 rounded-xl shadow flex flex-col items-start`}
              >
                {card.icon}
                <h4 className='text-lg font-semibold'>{card.title}</h4>
                <p className='text-sm'>{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

   

    </div>
  )
}

export default Home

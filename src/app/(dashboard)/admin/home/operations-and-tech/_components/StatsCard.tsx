import React from 'react'

import { Box, Card, CardContent, Typography } from '@mui/material'

type Props = {
  item: {
    title: string
    revenue: string
    status: boolean
    status_content: string
    icon: string
  }
  selected: boolean
}

const StatsCard = ({ item, selected }: Props) => {
  return (
    <Card className={`rounded-xl ${selected && 'bg-[#523F99]'} cursor-pointer`}>
      <CardContent className='flex justify-between items-start ~py-[0.5rem]/[1rem] ~px-[1rem]/[1.5rem]'>
        <Box>
          <Typography
            className={`~text-[0.9375rem]/[1.2rem] font-normal text-[#523F99] sm:leading-[1.375rem] ~pb-[0.125rem]/[0.25rem]  ${selected ? 'text-white' : 'text-[#2F2B3DE5]/90'}`}
          >
            {item.title}
          </Typography>
          <div className='flex items-center gap-3'>
            <Typography
              className={`~text-[0.7rem]/[1.3rem]  font-[500] leading-[2.375rem] ${selected ? 'text-white' : 'text-[#2F2B3DE5]/90'}`}
            >
              {item.revenue}
            </Typography>
            <div
              className={`${item.status ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'} rounded-sm ~text-[0.3rem]/[0.6rem] px-1 pt-[2px] pb-[1px] font-medium`}
            >
              {item.status_content}
            </div>
          </div>
        </Box>
        <Box
          className={` rounded-md flex justify-center items-center w-[42px] h-[42px] max-sm:hidden ${selected ? 'bg-[#8638E5]' : 'bg-[#8638E5]/[16%]'} ${selected ? 'text-white' : 'text-[#8638E5]'}`}
        >
          <i className={item.icon} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatsCard

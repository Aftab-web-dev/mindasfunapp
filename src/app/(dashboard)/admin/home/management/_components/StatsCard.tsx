import React from 'react'

import { Box, Card, CardContent, Typography } from '@mui/material'

type Props = {
  item: {
    title: string
    revenue: string
    icon: string
  }
  selected?: boolean
}

const StatsCard = ({ item, selected }: Props) => {
  return (
    <Card className={`rounded-xl ${selected && 'bg-[#523F99]'} cursor-pointer`}>
      <CardContent className='flex justify-between items-start py-[1rem] px-[1.5rem]'>
        <Box>
          <Typography
            className={`text-[0.9375rem] max-sm:text-[0.625rem] font-[400] text-[#523F99] sm:leading-[1.375rem] pb-[0.25rem] max-sm:pb-[2px]  ${selected ? 'text-white' : 'text-[#2F2B3DE5]/90'}`}
          >
            {item.title}
          </Typography>
          <Typography
            className={`text-[1.5rem] max-sm:text-[1.25rem] font-[500] leading-[2.375rem] ${selected ? 'text-white' : 'text-[#2F2B3DE5]/90'}`}
          >
            {item.revenue}
          </Typography>
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

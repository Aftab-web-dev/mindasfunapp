import { useState } from 'react'

import { Button, ButtonGroup, Menu, MenuItem } from '@mui/material'
import { ArrowDropDown } from '@mui/icons-material'

export default function SplitButtonDropdown({
  menuItems,
  title,
  onSelectionChange,
  selectedButton,
  setSelectedButton
}: {
  menuItems: string[]
  title: string
  selectedButton?: string
  setSelectedButton?: (button: string) => void
  onSelectionChange?: (selected: string) => void
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined)

  const open = Boolean(anchorEl)

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number | undefined) => {
    setSelectedIndex(index)
    setAnchorEl(null)

    if (setSelectedButton) {
      setSelectedButton('game')
    }

    const selectedValue = index === undefined ? 'None' : menuItems[index]

    if (onSelectionChange) {
      onSelectionChange(selectedValue)
    }
  }

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className='flex items-center justify-center w-full '>
      <ButtonGroup className='rounded-lg' style={{ border: 'none' }}>

        <Button
          onClick={() => {}}
          className={`max-sm:w-[9.5rem] w-[11.875rem] py-[0.5rem] max-sm:text-[0.7rem] text-[0.9375rem] font-[500] leading-[1.375rem] border-none ${
            selectedButton == 'game' ? 'bg-[#8638E529]/[16%] text-[#8638E5]' : 'bg-[#75757529]/[16%] text-[#757575]'
          }`}
        >
          {selectedIndex == undefined ? title : menuItems[selectedIndex]}
        </Button>
        <Button
          size='small'
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label='select merge strategy'
          aria-haspopup='menu'
          onClick={handleToggle}
          className={`w-[0.625rem] py-[0.5rem]  text-[0.9375rem] font-[500] leading-[1.375rem] border-none ${
            selectedButton == 'game' ? 'bg-[#8638E529]/[16%] text-[#8638E5]' : 'bg-[#75757529]/[16%] text-[#757575]'
          }`}
        >
          <ArrowDropDown />
        </Button>
      </ButtonGroup>
      <Menu id='split-button-menu' anchorEl={anchorEl} open={open} onClose={handleClose}>
        {menuItems.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={event => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

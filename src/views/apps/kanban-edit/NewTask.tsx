// React Imports
import { useState } from 'react'

import Typography from '@mui/material/Typography'
import { Card, CardContent } from '@mui/material'
import classNames from 'classnames'

import KanbanDrawerAdd from './KanbanDrawerAdd'

// Styles Imports
import styles from './styles.module.css'

const NewTask = ({
  addTask,
  setDrawerOpen,
  drawerOpen,
  text
}: {
  addTask: any
  setDrawerOpen: any
  drawerOpen: boolean
  text: string
}) => {
  // States
  const [displayNewItem, setDisplayNewItem] = useState(false)

  const toggleDisplay = () => {
    setDisplayNewItem(!displayNewItem)
    setDrawerOpen(true) // Open the drawer when toggling display
  }

  return (
    <div className='flex flex-col gap-4 items-start'>
      {displayNewItem && (
        <KanbanDrawerAdd
          setDrawerOpen={setDrawerOpen}
          drawerOpen={drawerOpen}
          setDisplayNewItem={setDisplayNewItem}
          addTask={addTask}
        />
      )}
      <div
        className='flex flex-col gap-4 lg:is-[16.5rem] md:is-[14.5rem] sm:is-[16.5rem] max-[320px]:is-[12.5rem] min-[390px]:is-[16.5rem] min-[425px]:is-[18.5rem] min-[570px]:is-[14.5rem] min-[590px]:is-[16.5rem] cursor-pointer'
        onClick={() => toggleDisplay()}
      >
        <Card className={classNames('  overflow-visible mbe-4', styles.card)}>
          <CardContent className='flex flex-col gap-y-2 items-start relative overflow-hidden'>
            <Typography
              color='text.primary'
              className=' break-words text-base sm:text-base xs:text-sm flex items-center gap-1 '
              style={{ wordBreak: 'break-word' }}
            >
              <i className='tabler-plus text-base' />
              {text}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NewTask

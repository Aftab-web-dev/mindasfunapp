import Typography from '@mui/material/Typography'

import { Card, CardContent } from '@mui/material'
import classNames from 'classnames'

import styles from './styles.module.css'

const SingleNewTask = ({ setDrawerOpen, text }: { setDrawerOpen: any; text: string }) => {
  const toggleDisplay = () => {
    setDrawerOpen(true)
  }

  return (
    <div className='flex flex-col gap-4 items-start is-full'>
      <div
        className='flex flex-col gap-4 is-full cursor-pointer'
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

export default SingleNewTask

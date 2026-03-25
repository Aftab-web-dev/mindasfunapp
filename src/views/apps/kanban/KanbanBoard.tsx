'use client'

import { useEffect, useState, useCallback } from 'react'

import { Typography } from '@mui/material'
import classnames from 'classnames'

import CakeDrawer from './CakeDrawer'
import TaskCard from './TaskCard'
import NewTask from './NewTask'
import CakeCard from './CakeCard'
import SingleNewTask from './SingleNewTask'
import CateringDrawer from './CateringDrawer'
import CateringCard from './CateringCard'
import OtherCard from './OtherCard'
import OtherDrawer from './OtherDrawer'

import styles from './styles.module.css'
import { getUser } from '@/utils/authStorage'
import { dropdownApi } from '@/api/drop-down-api'

type NewTaskData = {
  id: string | number
  title: string
  description?: string
  [key: string]: any
}

type EventColumn = {
  title: string
  data: any
}

const KanbanBoard = ({
  eventData,
  setEventData
}: {
  eventData: EventColumn[]
  setEventData: React.Dispatch<React.SetStateAction<EventColumn[]>>
}) => {
  /** -------------------- UI STATE -------------------- */
  const [isCakeDrawerOpen, setCakeDrawerOpen] = useState(false)
  const [cakeToEdit, setCakeToEdit] = useState<any>(null)

  const [isFoodDrawerOpen, setFoodDrawerOpen] = useState(false)
  const [foodToEdit, setFoodToEdit] = useState<any>(null)

  const [isOtherDrawerOpen, setOtherDrawerOpen] = useState(false)
  const [otherToEdit, setOtherToEdit] = useState<any>(null)

  const [dropdownOptions, setDropdownOptions] = useState({
    cake: [],
    food: [],
    card: [],
    gift: []
  })

  /** -------------------- DATA LOAD -------------------- */
  const loadDropdownOptions = useCallback(async () => {
    try {
      const user = await getUser()

      const [cake, food, card, gift] = await Promise.all([
        dropdownApi.cake({ branchId: user?.branchId }),
        dropdownApi.food({ branchId: user?.branchId }),
        dropdownApi.card({ branchId: user?.branchId }),
        dropdownApi.gift({ branchId: user?.branchId })
      ])

      setDropdownOptions({
        cake: cake?.data?.data ?? [],
        food: food?.data?.data ?? [],
        card: card?.data?.data ?? [],
        gift: gift?.data?.data ?? []
      })
    } catch (err) {
      console.error('Failed to fetch dropdown data', err)
    }
  }, [])

  useEffect(() => {
    loadDropdownOptions()
  }, [loadDropdownOptions])

  /** -------------------- HELPERS -------------------- */
  const addTaskToColumn = (index: number, task: NewTaskData) => {
    setEventData(prev => {
      const next = [...prev]

      next[index] = {
        ...next[index],
        data: [...(next[index].data || []), task]
      }

      return next
    })
  }

  const updateTaskInColumns = (updatedTask: any) => {
    setEventData(prev =>
      prev.map(column => ({
        ...column,
        data: Array.isArray(column.data)
          ? column.data.map(task => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task))
          : column.data
      }))
    )
  }

  const deleteTaskFromColumns = (taskId: string | number) => {
    setEventData(prev =>
      prev.map(column => ({
        ...column,
        data: Array.isArray(column.data) ? column.data.filter(task => task.id !== taskId) : column.data
      }))
    )
  }

  const saveSingleItemColumn = (index: number, data: any, closeDrawer: () => void, clearEdit: () => void) => {
    setEventData(prev => {
      const next = [...prev]

      next[index] = {
        ...next[index],
        data: { ...data, id: data.id || Date.now().toString() }
      }

      return next
    })

    closeDrawer()
    clearEdit()
  }

  const clearSingleItemColumn = (index: number) => {
    setEventData(prev => {
      const next = [...prev]

      next[index] = { ...next[index], data: {} }

      return next
    })
  }

  /** -------------------- RENDER -------------------- */
  return (
    <div className='items-start'>
      <div className='grid md:grid-cols-3 max-[420px]:grid-cols-1 min-[570px]:grid-cols-2 sm:grid-cols-2 gap-10 mx-auto'>
        {/* Columns 0,1,2 - Food, Card, Gift */}
        {[0, 1, 2].map(colIndex => (
          <div key={colIndex} className='flex flex-col is-[16.5rem] mx-4'>
            <div
              id='no-drag'
              className={classnames(
                'flex items-center justify-between is-[16.5rem] bs-[2.125rem] mbe-4',
                styles.kanbanColumn
              )}
            >
              <Typography variant='h5' noWrap className='max-is-[80%]'>
                {eventData?.[colIndex]?.title}
              </Typography>
            </div>

            {eventData?.[colIndex]?.data?.length === 0 && (
              <NewTask
                addTask={(data: NewTaskData) => addTaskToColumn(colIndex, data)}
                text='Add Item'
                products={
                  colIndex === 0 ? dropdownOptions.food : colIndex === 1 ? dropdownOptions.card : dropdownOptions.gift
                }
                productType={colIndex === 0 ? 'food' : colIndex === 1 ? 'card' : 'gift'}
              />
            )}

            {eventData?.[colIndex]?.data?.map(
              (task: any, idx: number) =>
                task && (
                  <TaskCard
                    key={idx}
                    task={task}
                    deleteTask={deleteTaskFromColumns}
                    updateTask={updateTaskInColumns}
                    products={
                      colIndex === 0
                        ? dropdownOptions.food
                        : colIndex === 1
                          ? dropdownOptions.card
                          : dropdownOptions.gift
                    }
                    productType={colIndex === 0 ? 'food' : colIndex === 1 ? 'card' : 'gift'}
                  />
                )
            )}

            {eventData?.[colIndex]?.data?.length >= 1 && (
              <NewTask
                addTask={(data: NewTaskData) => addTaskToColumn(colIndex, data)}
                text='Add New Item'
                products={
                  colIndex === 0 ? dropdownOptions.food : colIndex === 1 ? dropdownOptions.card : dropdownOptions.gift
                }
                productType={colIndex === 0 ? 'food' : colIndex === 1 ? 'card' : 'gift'}
              />
            )}
          </div>
        ))}

        {/* Column 3 – Cake */}
        <div className='flex flex-col is-[16.5rem] mx-4'>
          <ColumnHeader title={eventData?.[3]?.title} />

          {eventData[3]?.data?.id ? (
            <CakeCard
              cake={eventData[3].data}
              onEdit={() => {
                setCakeToEdit(eventData[3].data)
                setCakeDrawerOpen(true)
              }}
              onDelete={() => clearSingleItemColumn(3)}
            />
          ) : (
            <SingleNewTask setDrawerOpen={setCakeDrawerOpen} text='Add Cake' />
          )}

          <CakeDrawer
            open={isCakeDrawerOpen}
            onClose={() => setCakeDrawerOpen(false)}
            onSubmit={data =>
              saveSingleItemColumn(
                3,
                data,
                () => setCakeDrawerOpen(false),
                () => setCakeToEdit(null)
              )
            }
            defaultValues={cakeToEdit}
            cakesData={dropdownOptions.cake}
          />
        </div>

        {/* Column 4 – Catering */}
        <div className='flex flex-col is-[16.5rem] mx-4'>
          <ColumnHeader title={eventData?.[4]?.title} />

          {eventData[4]?.data?.id ? (
            <CateringCard
              food={eventData[4].data}
              onEdit={() => {
                setFoodToEdit(eventData[4].data)
                setFoodDrawerOpen(true)
              }}
              onDelete={() => clearSingleItemColumn(4)}
            />
          ) : (
            <SingleNewTask setDrawerOpen={setFoodDrawerOpen} text='Add Catering Food' />
          )}

          <CateringDrawer
            open={isFoodDrawerOpen}
            onClose={() => setFoodDrawerOpen(false)}
            onSubmit={data =>
              saveSingleItemColumn(
                4,
                data,
                () => setFoodDrawerOpen(false),
                () => setFoodToEdit(null)
              )
            }
            defaultValues={foodToEdit}
          />
        </div>

        {/* Column 5 – Other */}
        <div className='flex flex-col is-[16.5rem] mx-4'>
          <ColumnHeader title={eventData?.[5]?.title} />

          {eventData[5]?.data?.id ? (
            <OtherCard
              other={eventData[5].data}
              onEdit={() => {
                setOtherToEdit(eventData[5].data)
                setOtherDrawerOpen(true)
              }}
              onDelete={() => clearSingleItemColumn(5)}
            />
          ) : (
            <SingleNewTask setDrawerOpen={setOtherDrawerOpen} text='Add Other Arrangement' />
          )}

          <OtherDrawer
            open={isOtherDrawerOpen}
            onClose={() => setOtherDrawerOpen(false)}
            onSubmit={data =>
              saveSingleItemColumn(
                5,
                data,
                () => setOtherDrawerOpen(false),
                () => setOtherToEdit(null)
              )
            }
            defaultValues={otherToEdit}
          />
        </div>
      </div>
    </div>
  )
}

/** Small helper – UI only */
const ColumnHeader = ({ title }: { title?: string }) => (
  <div
    id='no-drag'
    className={classnames('flex items-center justify-between is-[16.5rem] bs-[2.125rem] mbe-4', styles.kanbanColumn)}
  >
    <Typography variant='h5' noWrap className='max-is-[80%]'>
      {title}
    </Typography>
  </div>
)

export default KanbanBoard

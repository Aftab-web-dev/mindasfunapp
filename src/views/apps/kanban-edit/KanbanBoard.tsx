'use client'
import { useState } from 'react'

import { Typography } from '@mui/material'
import classnames from 'classnames'

import KanbanDrawer from './KanbanDrawer'
import CakeDrawer from './CakeDrawer'
import TaskCard from './TaskCard'
import NewTask from './NewTask'
import CakeCard from './CakeCard'

// Styles Imports
import styles from './styles.module.css'
import SingleNewTask from './SingleNewTask'
import CateringDrawer from './CateringDrawer'
import CateringCard from './CateringCard'
import OtherCard from './OtherCard'
import OtherDrawer from './OtherDrawer'

// Define or import the NewTaskData type
// Adjust these fields according to your actual task structure
type NewTaskData = {
  id: string | number
  title: string
  description?: string
  [key: string]: any
}

// Define the EventData type for columns
type EventData = {
  title: string
  data: NewTaskData[]
  [key: string]: any
}

const KanbanBoard = ({ setEventData, eventData }: { setEventData: any; eventData: any }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<any>(null)
  const [cakeDrawerOpen, setCakeDrawerOpen] = useState(false)
  const [editingCake, setEditingCake] = useState(null)
  const [foodDrawerOpen, setFoodDrawerOpen] = useState(false)
  const [editingFood, setEditingFood] = useState(null)
  const [otherDrawerOpen, setOtherDrawerOpen] = useState(false)
  const [editingOther, setEditingOther] = useState(null)

  const onEditTask = (updatedTask: any) => {
    const newEventData = eventData.map((column: any) => ({
      ...column,
      data: Array.isArray(column.data)
        ? column.data.map((task: any) => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task))
        : column.data // If not array, leave as is
    }))

    setEventData(newEventData)
    setDrawerOpen(false)
    setCurrentTask(null)
  }

  const deleteTask = (taskId: string | number) => {
    const newEventData = eventData.map((column: any) => ({
      ...column,
      data: Array.isArray(column.data) ? column.data.filter((task: any) => task.id !== taskId) : column.data
    }))

    setEventData(newEventData)
  }

  // Add or Edit Cake
  const handleSaveCake = (cakeData: any) => {
    const newEventData = [...eventData]

    newEventData[3] = {
      ...newEventData[3],
      data: { ...cakeData, id: cakeData.id || Date.now().toString() }
    }
    setEventData(newEventData)
    setCakeDrawerOpen(false)
    setEditingCake(null)
  }

  const deleteCake = () => {
    const newEventData = [...eventData]

    newEventData[3] = {
      ...newEventData[3],
      data: {} // Remove the cake data
    }
    setEventData(newEventData)
  }

  // Open drawer for edit
  const handleEditCake = () => {
    setEditingCake(eventData[3]?.data || null)
    setCakeDrawerOpen(true)
  }

  // Add or Edit Cake
  const handleSaveCateringFood = (foodData: any) => {
    const newEventData = [...eventData]

    newEventData[4] = {
      ...newEventData[4],
      data: { ...foodData, id: foodData.id || Date.now().toString() }
    }
    setEventData(newEventData)
    setFoodDrawerOpen(false)
    setEditingFood(null)
  }

  // Open drawer for edit
  const handleEditFood = () => {
    setEditingFood(eventData[4]?.data || null)
    setFoodDrawerOpen(true)
  }

  const deleteFood = () => {
    const newEventData = [...eventData]

    newEventData[4] = {
      ...newEventData[4],
      data: {} // Remove the food data
    }
    setEventData(newEventData)
  }

  // Add or Edit Cake
  const handleSaveArrangement = (otherData: any) => {
    const newEventData = [...eventData]

    newEventData[5] = {
      ...newEventData[5],
      data: { ...otherData, id: otherData.id || Date.now().toString() }
    }
    setEventData(newEventData)
    setOtherDrawerOpen(false)
    setEditingOther(null)
  }

  // Open drawer for edit
  const handleEditOther = () => {
    setEditingOther(eventData[5]?.data || null)
    setOtherDrawerOpen(true)
  }

    const deleteOther = () => {
    const newEventData = [...eventData]

    newEventData[5] = {
      ...newEventData[5],
      data: {} // Remove the other data
    }
    setEventData(newEventData)
  }

  return (
    <div className='items-start '>
      <div className='grid md:grid-cols-3 max-[420px]:grid-cols-1 min-[570px]:grid-cols-2  sm:grid-cols-2  gap-10 mx-auto'>
        {/* Column 0 */}
        <div className='flex flex-col is-[16.5rem] mx-4'>
          <div
            id='no-drag'
            className={classnames(
              'flex items-center justify-between is-[16.5rem] bs-[2.125rem] mbe-4',
              styles.kanbanColumn
            )}
          >
            <Typography variant='h5' noWrap className='max-is-[80%]'>
              {eventData?.[0]?.title}
            </Typography>
          </div>

          {eventData?.[0]?.data.length === 0 && (
            <NewTask
              addTask={(data: NewTaskData) => {
                const newEventData: EventData[] = [...eventData]

                newEventData[0] = {
                  ...newEventData[0],
                  data: [...(newEventData[0].data || []), data]
                }
                setEventData(newEventData)
              }}
              setDrawerOpen={setDrawerOpen as React.Dispatch<React.SetStateAction<boolean>>}
              drawerOpen={drawerOpen as boolean}
              text='Add Task'
            />
          )}
          {eventData?.[0]?.data?.map(
            (task: any, idx: any) =>
              task && (
                <TaskCard
                  key={idx}
                  task={task}
                  setDrawerOpen={setDrawerOpen}
                  setCurrentTask={setCurrentTask}
                  deleteTask={deleteTask}
                />
              )
          )}
          {eventData?.[0]?.data.length >= 1 && (
            <NewTask
              addTask={(data: NewTaskData) => {
                const newEventData: EventData[] = [...eventData]

                newEventData[0] = {
                  ...newEventData[0],
                  data: [...(newEventData[0].data || []), data]
                }
                setEventData(newEventData)
              }}
              setDrawerOpen={setDrawerOpen as React.Dispatch<React.SetStateAction<boolean>>}
              drawerOpen={drawerOpen as boolean}
              text='Add New Task'
            />
          )}
        </div>
        {/* Column 1 */}
        <div className='flex flex-col is-[16.5rem] mx-4'>
          <div
            id='no-drag'
            className={classnames(
              'flex items-center justify-between is-[16.5rem] bs-[2.125rem] mbe-4',
              styles.kanbanColumn
            )}
          >
            <Typography variant='h5' noWrap className='max-is-[80%]'>
              {eventData?.[1]?.title}
            </Typography>
          </div>

          {eventData?.[1]?.data.length == 0 && (
            <NewTask
              addTask={(data: any) => {
                const newEventData = [...eventData]

                newEventData[1] = {
                  ...newEventData[1],
                  data: [...(newEventData[1].data || []), data]
                }
                setEventData(newEventData)
              }}
              setDrawerOpen={setDrawerOpen}
              drawerOpen={drawerOpen as boolean}
              text='Add Item'
            />
          )}
          {eventData?.[1]?.data?.map(
            (task: any, idx: any) =>
              task && (
                <TaskCard
                  key={idx}
                  task={task}
                  setDrawerOpen={setDrawerOpen}
                  setCurrentTask={setCurrentTask}
                  deleteTask={deleteTask}
                />
              )
          )}
          {eventData?.[1]?.data.length >= 1 && (
            <NewTask
              addTask={(data: any) => {
                const newEventData = [...eventData]

                newEventData[1] = {
                  ...newEventData[1],
                  data: [...(newEventData[1].data || []), data]
                }
                setEventData(newEventData)
              }}
              setDrawerOpen={setDrawerOpen}
              drawerOpen={drawerOpen as boolean}
              text='Add New Item'
            />
          )}
        </div>
        {/* Column 2 */}
        <div className='flex flex-col is-[16.5rem] mx-4'>
          <div
            id='no-drag'
            className={classnames(
              'flex items-center justify-between is-[16.5rem] bs-[2.125rem] mbe-4',
              styles.kanbanColumn
            )}
          >
            <Typography variant='h5' noWrap className='max-is-[80%]'>
              {eventData?.[2]?.title}
            </Typography>
          </div>

          {eventData?.[2]?.data.length == 0 && (
            <NewTask
              addTask={(data: any) => {
                const newEventData = [...eventData]

                newEventData[2] = {
                  ...newEventData[2],
                  data: [...(newEventData[2].data || []), data]
                }
                setEventData(newEventData)
              }}
              setDrawerOpen={setDrawerOpen}
              drawerOpen={drawerOpen as boolean}
              text='Add Item'
            />
          )}
          {eventData?.[2]?.data?.map(
            (task: any, idx: any) =>
              task && (
                <TaskCard
                  key={idx}
                  task={task}
                  setDrawerOpen={setDrawerOpen}
                  setCurrentTask={setCurrentTask}
                  deleteTask={deleteTask}
                />
              )
          )}
          {eventData?.[2]?.data.length >= 1 && (
            <NewTask
              addTask={(data: any) => {
                const newEventData = [...eventData]

                newEventData[2] = {
                  ...newEventData[2],
                  data: [...(newEventData[2].data || []), data]
                }
                setEventData(newEventData)
              }}
              setDrawerOpen={setDrawerOpen}
              drawerOpen={drawerOpen as boolean}
              text='Add New Item'
            />
          )}
        </div>
        {/* Column 3: Cake */}
        <div className='flex flex-col is-[16.5rem] mx-4'>
          <div
            id='no-drag'
            className={classnames(
              'flex items-center justify-between is-[16.5rem] bs-[2.125rem] mbe-4',
              styles.kanbanColumn
            )}
          >
            <Typography variant='h5' noWrap className='max-is-[80%]'>
              {eventData?.[3]?.title}
            </Typography>
          </div>
          {/* Cake Cards */}
          {eventData[3]?.data && eventData[3].data.id && (
            <CakeCard cake={eventData[3].data} onEdit={handleEditCake} onDelete={deleteCake} />
          )}
          {eventData[3]?.data && !eventData[3].data.name && (
            <SingleNewTask setDrawerOpen={setCakeDrawerOpen} text='Add Cake' />
          )}

          {/* Cake Drawer */}
          <CakeDrawer
            open={cakeDrawerOpen}
            onClose={() => setCakeDrawerOpen(false)}
            onSubmit={handleSaveCake}
            defaultValues={editingCake}
          />
        </div>
        {/* Column 4 */}
        <div className='flex flex-col is-[16.5rem] mx-4'>
          <div
            id='no-drag'
            className={classnames(
              'flex items-center justify-between is-[16.5rem] bs-[2.125rem] mbe-4',
              styles.kanbanColumn
            )}
          >
            <Typography variant='h5' noWrap className='max-is-[80%]'>
              {eventData?.[4]?.title}
            </Typography>
          </div>
          {eventData[4]?.data && eventData[4].data.id && (
            <CateringCard food={eventData[4].data} onEdit={handleEditFood} onDelete={deleteFood}/>
          )}
          {eventData[4]?.data && !eventData[4].data.id && (
            <SingleNewTask setDrawerOpen={setFoodDrawerOpen} text='Add Catering Food' />
          )}

          {/* Cake Drawer */}
          <CateringDrawer
            open={foodDrawerOpen}
            onClose={() => setFoodDrawerOpen(false)}
            onSubmit={handleSaveCateringFood}
            defaultValues={editingFood}
          />
        </div>
        {/* Column 5 */}
        <div className='flex flex-col is-[16.5rem] mx-4'>
          <div
            id='no-drag'
            className={classnames(
              'flex items-center justify-between is-[16.5rem] bs-[2.125rem] mbe-4',
              styles.kanbanColumn
            )}
          >
            <Typography variant='h5' noWrap className='max-is-[80%]'>
              {eventData?.[5]?.title}
            </Typography>
          </div>

          {eventData[5]?.data && eventData[5].data.id && (
            <OtherCard other={eventData[5].data} onEdit={handleEditOther} onDelete={deleteOther} />
          )}
          {eventData[5]?.data && !eventData[5].data.id && (
            <SingleNewTask setDrawerOpen={setOtherDrawerOpen} text='Add Other Arrangement' />
          )}

          {/* Cake Drawer */}
          <OtherDrawer
            open={otherDrawerOpen}
            onClose={() => setOtherDrawerOpen(false)}
            onSubmit={handleSaveArrangement}
            defaultValues={editingOther}
          />
        </div>
      </div>
      {currentTask && (
        <KanbanDrawer
          task={currentTask}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          onEditTask={onEditTask} // <-- pass this
          deleteTask={deleteTask}
        />
      )}
    </div>
  )
}

export default KanbanBoard

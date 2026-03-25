export type TaskType = {
  id: string
  product: string
  price?: number
  quantity?: number
}

export type KanbanType = {
  tasks: TaskType[]
  currentTask: TaskType
}

import type { KanbanType } from '@/types/apps/kanbanTypes'

export const db: KanbanType = {
  tasks: [],
  currentTask: {} as any // TODO: Replace with a valid TaskType object
}

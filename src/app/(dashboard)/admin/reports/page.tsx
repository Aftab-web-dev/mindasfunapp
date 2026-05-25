import { Suspense } from 'react'
import ReportsTable from "./_components/reports-table"

const page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] w-full">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#523F99]"></div>
        </div>
      }
    >
      <ReportsTable />
    </Suspense>
  )
}

export default page


// ** Next Import
import dynamic from 'next/dynamic'

// ! To avoid 'Window is not defined' error
const ReactApexcharts = dynamic(() => import('react-apexcharts'), { ssr: false })

// const ReactApexcharts = dynamic(() => import('react-apexcharts'), { 
//     ssr: false, 
//     loading: () => <div>Loading chart...</div> 
//   });

export default ReactApexcharts

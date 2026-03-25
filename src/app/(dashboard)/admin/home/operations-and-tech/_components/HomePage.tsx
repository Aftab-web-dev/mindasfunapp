'use client'
import React, { useState } from 'react'

import StatsCard from './StatsCard'
import DataTable from './DataTable'
import Alerts from './Alerts'

const statsCardArray = [
  {
    title: 'Live Game Status',
    revenue: '32/36 Online',
    status: true,
    status_content: '+89%',
    icon: 'tabler-access-point',
    maintenanceData: [
      { equipment: 'VR Pod 1', issue: 'Tracking Loss', technician: 'Liam R.', eta: '45 mins', status: { label: 'In Progress', color: 'bg-blue-100 text-blue-600' } },
      { equipment: 'Foosball Table', issue: 'Stuck Rods', technician: 'Nina M.', eta: '1 hour', status: { label: 'Scheduled', color: 'bg-green-100 text-green-700' } },
      { equipment: 'Laser Tag Gun', issue: 'Battery Drain', technician: 'Tom H.', eta: '30 mins', status: { label: 'Diagnosed', color: 'bg-gray-100 text-gray-600' } },
      { equipment: 'Dance Machine', issue: 'Pad Unresponsive', technician: 'Sara K.', eta: '2 hours', status: { label: 'Waiting Parts', color: 'bg-yellow-100 text-yellow-700' } },
      { equipment: 'Racing Sim 1', issue: 'Seat Motor Fault', technician: 'Raj P.', eta: '1.5 hours', status: { label: 'Critical', color: 'bg-red-100 text-red-600' } }
    ],
    alertsData: [
      { title: 'Laser Tag Arena', desc: 'Battery low warning', time: '20 mins ago' },
      { title: 'Game Kiosk 1', desc: 'Touchscreen unresponsive', time: '1 hour ago' },
      { title: 'Prize Counter', desc: 'Network latency', time: '10 mins ago' },
      { title: 'Surveillance Cam', desc: 'Feed glitching', time: '5 mins ago' }
    ]
  },
  {
    title: 'Offline Games Status',
    revenue: '4 Offline',
    status: false,
    status_content: '+89%',
    icon: 'tabler-wifi-off',
    maintenanceData: [
      { equipment: 'Arcade Machine 7', issue: 'Display Flickering', technician: 'Maria S.', eta: '2 hours', status: { label: 'Waiting Parts', color: 'bg-yellow-100 text-yellow-700' } },
      { equipment: 'VR Headset 4', issue: 'Controller Not Responding', technician: 'John D.', eta: '30 mins', status: { label: 'Scheduled', color: 'bg-green-100 text-green-700' } },
      { equipment: 'Bowling Lane 3', issue: 'Pin Setter Jam', technician: 'Sam K.', eta: '3 hours', status: { label: 'Diagnosed', color: 'bg-gray-100 text-gray-600' } },
      { equipment: 'Air Hockey Table', issue: 'Air Pressure Low', technician: 'Emma P.', eta: '45 mins', status: { label: 'Critical', color: 'bg-red-100 text-red-600' } },
      { equipment: 'Photo Booth', issue: 'Printer Paper Jam', technician: 'Derek L.', eta: '1 hour', status: { label: 'In Progress', color: 'bg-blue-100 text-blue-600' } }
    ],
    alertsData: [
      { title: 'Photo Booth', desc: 'Printer paper empty', time: '35 mins ago' },
      { title: 'Air Hockey Scoreboard', desc: 'Display error', time: '1 hour ago' },
      { title: 'Ticket Dispenser', desc: 'Paper jam detected', time: '2 hours ago' },
      { title: 'VR Station 2', desc: 'Overheating', time: '45 mins ago' }
    ]
  },
  {
    title: 'Maintenance Required',
    revenue: '12 Games',
    status: false,
    status_content: '3 Urgent',
    icon: 'tabler-devices-cog',
    maintenanceData: [
      { equipment: 'Claw Machine 2', issue: 'Grabber Stuck', technician: 'Jason K.', eta: '1.5 hours', status: { label: 'Critical', color: 'bg-red-100 text-red-600' } },
      { equipment: 'Whack-a-Mole', issue: 'Buttons Jammed', technician: 'Ava C.', eta: '2 hours', status: { label: 'Scheduled', color: 'bg-green-100 text-green-700' } },
      { equipment: 'Mini Golf Hole 3', issue: 'Obstacle Misaligned', technician: 'Ethan Z.', eta: '1 hour', status: { label: 'Diagnosed', color: 'bg-gray-100 text-gray-600' } },
      { equipment: 'Karaoke Booth', issue: 'Microphone Distortion', technician: 'Zara V.', eta: '1 hour', status: { label: 'Waiting Parts', color: 'bg-yellow-100 text-yellow-700' } },
      { equipment: 'Prize Crane', issue: 'Motor Overheat', technician: 'Kyle N.', eta: '45 mins', status: { label: 'In Progress', color: 'bg-blue-100 text-blue-600' } }
    ],
    alertsData: [
      { title: 'VR Room', desc: 'Calibration error', time: '2 hours ago' },
      { title: 'Kiosk 4', desc: 'Software update failed', time: '15 mins ago' },
      { title: 'Game Server', desc: 'High ping detected', time: '30 mins ago' },
      { title: 'Prize Counter', desc: 'Offline mode', time: '10 mins ago' }
    ]
  },
  {
    title: 'Staff On Duty',
    revenue: '8 Technicians',
    status: true,
    status_content: '2 Remote',
    icon: 'tabler-users',
    maintenanceData: [
      { equipment: 'Mini Golf 1', issue: 'Lighting Flicker', technician: 'Diana F.', eta: '50 mins', status: { label: 'Scheduled', color: 'bg-green-100 text-green-700' } },
      { equipment: 'Virtual Bike Ride', issue: 'VR Glitch', technician: 'Ben H.', eta: '1 hour', status: { label: 'Diagnosed', color: 'bg-gray-100 text-gray-600' } },
      { equipment: 'Photo Machine', issue: 'Color Mismatch', technician: 'Riya S.', eta: '1.5 hours', status: { label: 'Waiting Parts', color: 'bg-yellow-100 text-yellow-700' } },
      { equipment: 'Dance Mat 2', issue: 'Sensor Lag', technician: 'Ibrahim K.', eta: '2 hours', status: { label: 'Critical', color: 'bg-red-100 text-red-600' } },
      { equipment: 'Prize Crane 3', issue: 'Grabber Fault', technician: 'Luca W.', eta: '45 mins', status: { label: 'In Progress', color: 'bg-blue-100 text-blue-600' } }
    ],
    alertsData: [
      { title: 'Employee Terminal', desc: 'Login timeout', time: '5 mins ago' },
      { title: 'Attendance Pad', desc: 'Scanner offline', time: '30 mins ago' },
      { title: 'Break Room Fridge', desc: 'Power fluctuation', time: '1 hour ago' },
      { title: 'Staff Chat Server', desc: 'Disconnected', time: '20 mins ago' }
    ]
  },
  {
    title: 'Pending Tickets',
    revenue: '15 Tickets',
    status: true,
    status_content: '5 High Priority',
    icon: 'tabler-file-text',
    maintenanceData: [
      { equipment: 'Basketball Game 1', issue: 'Score Not Updating', technician: 'Luca W.', eta: '40 mins', status: { label: 'In Progress', color: 'bg-blue-100 text-blue-600' } },
      { equipment: 'Photo Machine', issue: 'Color Mismatch', technician: 'Riya S.', eta: '1.5 hours', status: { label: 'Waiting Parts', color: 'bg-yellow-100 text-yellow-700' } },
      { equipment: 'Whack-a-Mole 2', issue: 'Hammer Jam', technician: 'Ava C.', eta: '2 hours', status: { label: 'Scheduled', color: 'bg-green-100 text-green-700' } },
      { equipment: 'Claw Crane 5', issue: 'Claw Weak Grip', technician: 'Jason K.', eta: '1 hour', status: { label: 'Diagnosed', color: 'bg-gray-100 text-gray-600' } },
      { equipment: 'Ticket Printer', issue: 'Ink Low', technician: 'Sara K.', eta: '30 mins', status: { label: 'Critical', color: 'bg-red-100 text-red-600' } }
    ],
    alertsData: [
      { title: 'Customer Queue Display', desc: 'Flickering', time: '1 hour ago' },
      { title: 'Game Pass Reader', desc: 'RFID error', time: '20 mins ago' },
      { title: 'Prize Counter', desc: 'Sync failed', time: '15 mins ago' },
      { title: 'Server Room Door', desc: 'Access denied', time: '10 mins ago' }
    ]
  },
  {
    title: 'Weekly Uptime',
    revenue: '96.8%',
    status: true,
    status_content: '+1.2% ^',
    icon: 'tabler-activity',
    maintenanceData: [
      { equipment: 'Main Server Rack', issue: 'Overheating', technician: 'Ken B.', eta: '2 hours', status: { label: 'Diagnosed', color: 'bg-gray-100 text-gray-600' } },
      { equipment: 'Karaoke Booth', issue: 'Mic Distortion', technician: 'Zara V.', eta: '1 hour', status: { label: 'Scheduled', color: 'bg-green-100 text-green-700' } },
      { equipment: 'Network Switch', issue: 'Port Failure', technician: 'Mark S.', eta: '3 hours', status: { label: 'Critical', color: 'bg-red-100 text-red-600' } },
      { equipment: 'Cooling Unit', issue: 'Fan Noise', technician: 'Olivia J.', eta: '1.5 hours', status: { label: 'In Progress', color: 'bg-blue-100 text-blue-600' } },
      { equipment: 'Backup Generator', issue: 'Battery Check', technician: 'Ken B.', eta: '45 mins', status: { label: 'Waiting Parts', color: 'bg-yellow-100 text-yellow-700' } }
    ],
    alertsData: [
      { title: 'System Health Monitor', desc: 'Uptime below threshold', time: '3 hours ago' },
      { title: 'Gaming Leaderboard', desc: 'Data lag detected', time: '50 mins ago' },
      { title: 'Network Latency', desc: 'Spike detected', time: '25 mins ago' },
      { title: 'Power Grid', desc: 'Voltage fluctuation', time: '15 mins ago' }
    ]
  }
];


const HomePage = () => {
  const [selectedStat, setSelectedStat] = useState(statsCardArray[0])

  return (
    <div>
      <div className='grid  lg:grid-rows-2 ~gap-[0.5rem]/[1rem] md:grid-cols-3 grid-cols-2 '>
        {statsCardArray.map((item, i) => (
          <div key={i} onClick={() => setSelectedStat(item)}>
            <StatsCard item={item} selected={selectedStat.title === item.title} />
          </div>
        ))}
      </div>
      <div className='md:grid md:grid-cols-12 gap-4  pt-4'>
        <div className='md:col-span-8 '>
          <DataTable maintenanceData={selectedStat.maintenanceData} title={selectedStat.title}/>
        </div>{' '}
        <div className='md:col-span-4 max-md:pt-4'>
          <Alerts alertsData={selectedStat.alertsData} />
        </div>{' '}
      </div>{' '}
    </div>
  )
}

export default HomePage

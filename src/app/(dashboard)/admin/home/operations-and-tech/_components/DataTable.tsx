'use client'

import React, { useState } from 'react'
import { Box, Typography, Select, MenuItem } from '@mui/material'

type MaintenanceRow = {
  equipment: string
  issue: string
  technician: string
  eta: string
  status: {
    label: string
    color: string
  }
}

const statusOptions = ['Pending', 'In Progress', 'Completed', 'Delayed']

const getStatusStyles = (label: string) => {
  switch (label) {
    case 'In Progress':
      return { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' }
    case 'Pending':
    case 'Scheduled':
      return { bg: '#F0ECFA', color: '#523F99', border: '#D8D0F0' }
    case 'Completed':
      return { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' }
    case 'Critical':
      return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' }
    case 'Diagnosed':
      return { bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0' }
    case 'Waiting Parts':
      return { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' }
    case 'Delayed':
      return { bg: '#FFF7ED', color: '#EA580C', border: '#FED7AA' }
    default:
      return { bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0' }
  }
}

const StatusSelect = ({ initial }: { initial: string }) => {
  const [value, setValue] = useState(initial)
  const styles = getStatusStyles(value)

  return (
    <Select
      size='small'
      value={value}
      onChange={e => setValue(e.target.value)}
      sx={{
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: styles.bg,
        color: styles.color,
        borderRadius: '8px',
        height: '32px',
        minWidth: '120px',
        '.MuiOutlinedInput-notchedOutline': { borderColor: styles.border },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: styles.color },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: styles.color },
        '.MuiSelect-icon': { color: styles.color, fontSize: '1.1rem' }
      }}
    >
      {statusOptions.map(opt => (
        <MenuItem key={opt} value={opt} sx={{ fontSize: '0.8125rem' }}>
          {opt}
        </MenuItem>
      ))}
    </Select>
  )
}

const DataTable = ({ maintenanceData, title }: { maintenanceData: MaintenanceRow[]; title: string }) => {
  const columns = ['Equipment', 'Issue', 'Technician', 'ETA', 'Status']

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        p: { xs: 2.5, sm: 3, md: 4 },
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
          fontWeight: 600,
          color: '#1E293B',
          mb: 3,
          lineHeight: 1.4,
        }}
      >
        Maintenance Schedule - {title}
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  style={{
                    textAlign: 'left',
                    padding: '6px 12px 6px 0',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: '#94A3B8',
                    letterSpacing: '0.01em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {maintenanceData.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  borderTop: '1px solid #F1F5F9',
                }}
              >
                <td style={{ padding: '4px 12px 4px 0', fontSize: '0.8125rem', fontWeight: 500, color: '#1E293B', whiteSpace: 'nowrap' }}>
                  {row.equipment}
                </td>
                <td style={{ padding: '4px 12px', fontSize: '0.8125rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                  {row.issue}
                </td>
                <td style={{ padding: '4px 12px', fontSize: '0.8125rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                  {row.technician}
                </td>
                <td style={{ padding: '4px 12px', fontSize: '0.8125rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                  {row.eta}
                </td>
                <td style={{ padding: '4px 0 4px 12px' }}>
                  <StatusSelect key={`${row.equipment}-${row.status.label}`} initial={row.status.label} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  )
}

export default DataTable

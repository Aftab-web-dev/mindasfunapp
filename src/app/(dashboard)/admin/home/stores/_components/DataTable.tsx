'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'

type StatusRow = {
  item: string
  category: string
  stock: number | string
  threshold: number | string
  status: {
    label: string
    color: string
  }
}

const getStatusStyles = (label: string) => {
  const l = label?.toLowerCase() || ''

  if (l.includes('in stock') || l.includes('ok') || l.includes('good'))
    return { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' }
  if (l.includes('low') || l.includes('warning'))
    return { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' }
  if (l.includes('out') || l.includes('critical') || l.includes('empty'))
    return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' }
  if (l.includes('order') || l.includes('pending'))
    return { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' }

  return { bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0' }
}

const DataTable = ({ statusData, title }: { statusData: StatusRow[]; title: string }) => {
  const columns = ['Item', 'Category', 'In Stock', 'Min Threshold', 'Status']

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        p: { xs: 2.5, sm: 3, md: 4 },
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.06)',
        height: '100%',
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
        {title} Status
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
                    paddingBottom: '16px',
                    paddingLeft: '12px',
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
            {statusData?.map((row, idx) => {
              const styles = getStatusStyles(row.status?.label)

              return (
                <tr key={idx} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 12px', fontSize: '0.8125rem', fontWeight: 500, color: '#1E293B', whiteSpace: 'nowrap' }}>
                    {row.item}
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: '0.8125rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {row.category}
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: '0.8125rem', fontWeight: 500, color: '#1E293B' }}>
                    {row.stock}
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: '0.8125rem', color: '#64748B' }}>
                    {row.threshold}
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <Box
                      component='span'
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: styles.bg,
                        color: styles.color,
                        border: `1px solid ${styles.border}`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.status?.label}
                    </Box>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Box>
    </Box>
  )
}

export default DataTable

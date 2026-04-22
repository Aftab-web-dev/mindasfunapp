'use client'

import { createTheme, alpha } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#523F99',
      light: '#7C63D4',
      dark: '#3D2E82',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#06B6D4',
      light: '#22D3EE',
      dark: '#0891B2',
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669'
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706'
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626'
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB'
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B'
    }
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.25
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.35
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.04)',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 8px rgba(0,0,0,0.06)',
    '0 8px 16px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.1)',
    '0 16px 32px rgba(0,0,0,0.12)',
    '0 20px 40px rgba(0,0,0,0.14)',
    '0 24px 48px rgba(0,0,0,0.16)',
    '0 28px 56px rgba(0,0,0,0.18)',
    '0 32px 64px rgba(0,0,0,0.2)',
    '0 1px 3px rgba(0,0,0,0.04)',
    '0 2px 6px rgba(0,0,0,0.05)',
    '0 4px 12px rgba(0,0,0,0.06)',
    '0 8px 24px rgba(0,0,0,0.08)',
    '0 12px 32px rgba(0,0,0,0.1)',
    '0 16px 40px rgba(0,0,0,0.12)',
    '0 20px 48px rgba(0,0,0,0.14)',
    '0 24px 56px rgba(0,0,0,0.16)',
    '0 28px 64px rgba(0,0,0,0.18)',
    '0 32px 72px rgba(0,0,0,0.2)',
    '0 1px 3px rgba(0,0,0,0.04)',
    '0 2px 6px rgba(0,0,0,0.05)',
    '0 4px 12px rgba(0,0,0,0.06)',
    '0 8px 24px rgba(0,0,0,0.08)'
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.9375rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(82, 63, 153, 0.25)'
          }
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)'
          }
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            transform: 'translateY(-1px)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        },
        rounded: {
          borderRadius: 12
        },
        elevation1: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        },
        elevation2: {
          boxShadow: '0 4px 8px rgba(0,0,0,0.06)'
        },
        elevation3: {
          boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined'
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#523F99'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#523F99',
              borderWidth: 2
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500
        },
        filled: {
          '&.MuiChip-colorSuccess': {
            backgroundColor: alpha('#10B981', 0.12),
            color: '#059669'
          },
          '&.MuiChip-colorWarning': {
            backgroundColor: alpha('#F59E0B', 0.12),
            color: '#D97706'
          },
          '&.MuiChip-colorError': {
            backgroundColor: alpha('#EF4444', 0.12),
            color: '#DC2626'
          },
          '&.MuiChip-colorInfo': {
            backgroundColor: alpha('#3B82F6', 0.12),
            color: '#2563EB'
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '4px 0 24px rgba(0,0,0,0.08)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#1E293B',
            backgroundColor: '#F8F9FA'
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0,0,0,0.08)'
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1E293B',
          borderRadius: 8,
          fontSize: '0.8125rem',
          padding: '8px 12px'
        },
        arrow: {
          color: '#1E293B'
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10
        },
        standardSuccess: {
          backgroundColor: alpha('#10B981', 0.12),
          color: '#059669'
        },
        standardWarning: {
          backgroundColor: alpha('#F59E0B', 0.12),
          color: '#D97706'
        },
        standardError: {
          backgroundColor: alpha('#EF4444', 0.12),
          color: '#DC2626'
        },
        standardInfo: {
          backgroundColor: alpha('#3B82F6', 0.12),
          color: '#2563EB'
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9375rem',
          minHeight: 48
        }
      }
    }
  }
})

export default theme

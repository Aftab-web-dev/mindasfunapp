// Single source of truth for category colors across the management dashboard.
// Each category's card, breakdown chart, donut slice, and summary row share
// the same primary color so the UI reads consistently.

export type CategoryPalette = {
  primary: string
  light: string
  bg: string
  gradient: string
  textClass: string
}

export const CATEGORY_COLORS: Record<string, CategoryPalette> = {
  'Game Revenue': {
    primary: '#523F99',
    light: '#7C63D4',
    bg: '#F0ECFA',
    gradient: 'linear-gradient(135deg, #523F99 0%, #7C63D4 100%)',
    textClass: 'text-primary'
  },
  'Product Revenue': {
    primary: '#06B6D4',
    light: '#22D3EE',
    bg: '#ECFEFF',
    gradient: 'linear-gradient(135deg, #0891B2 0%, #22D3EE 100%)',
    textClass: 'text-info'
  },
  'Redemption Revenue': {
    primary: '#F59E0B',
    light: '#FBBF24',
    bg: '#FFFBEB',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    textClass: 'text-warning'
  },
  'Event Revenue': {
    primary: '#EF4444',
    light: '#F87171',
    bg: '#FEF2F2',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
    textClass: 'text-error'
  },
  'F&B Revenue': {
    primary: '#10B981',
    light: '#34D399',
    bg: '#ECFDF5',
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    textClass: 'text-success'
  },
  'Bounzing Revenue': {
    primary: '#8B5CF6',
    light: '#C084FC',
    bg: '#FAF5FF',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #C084FC 100%)',
    textClass: 'text-secondary'
  },
  'Bowling Revenue': {
    primary: '#F97316',
    light: '#FB923C',
    bg: '#FFF7ED',
    gradient: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
    textClass: 'text-warning'
  },
  'Ticketing Revenue': {
    primary: '#EC4899',
    light: '#F472B6',
    bg: '#FDF2F8',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
    textClass: 'text-error'
  }
}

const FALLBACK: CategoryPalette = CATEGORY_COLORS['Game Revenue']

export const getCategoryPalette = (title: string): CategoryPalette =>
  CATEGORY_COLORS[title] ?? FALLBACK

// Convenience accessors for the most-used fields
export const getCategoryColor = (title: string) => getCategoryPalette(title).primary
export const getCategoryGradient = (title: string) => getCategoryPalette(title).gradient
export const getCategoryBg = (title: string) => getCategoryPalette(title).bg

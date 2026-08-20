export interface FilterPreset {
  id: string
  name: string
  css: string // CSS filter string, e.g. "brightness(1.1) sepia(0.3)"
}

export const FILTER_PRESETS: FilterPreset[] = [
  { id: 'original', name: 'Asli',        css: 'none' },
  { id: 'warm',     name: 'Hangat',      css: 'brightness(1.1) saturate(1.3) sepia(0.15)' },
  { id: 'cool',     name: 'Sejuk',       css: 'brightness(1.05) saturate(0.9) hue-rotate(15deg)' },
  { id: 'vintage',  name: 'Vintage',     css: 'sepia(0.4) contrast(0.9) brightness(1.1) saturate(1.5)' },
  { id: 'bw',       name: 'Hitam Putih', css: 'grayscale(100%) brightness(1.2) contrast(1.05)' },
  { id: 'soft',     name: 'Lembut',      css: 'brightness(1.15) contrast(0.95) saturate(1.1)' },
  { id: 'dramatic', name: 'Dramatik',    css: 'contrast(1.4) brightness(0.9) saturate(1.2)' },
  { id: 'rose',     name: 'Mawar',       css: 'sepia(0.15) saturate(1.4) hue-rotate(-10deg) brightness(1.05)' },
]

export function getFilterPreset(filterId: string): FilterPreset {
  return FILTER_PRESETS.find(f => f.id === filterId) || FILTER_PRESETS[0]
}

export interface FilterPreset {
  id: string
  name: string
  css: string // CSS filter string, e.g. "brightness(1.1) sepia(0.3)"
}

export const FILTER_PRESETS: FilterPreset[] = [
  { id: 'original', name: 'Asli',        css: 'none' },
  { id: 'warm',     name: 'Hangat',      css: 'brightness(110%) saturate(130%) sepia(15%)' },
  { id: 'cool',     name: 'Sejuk',       css: 'brightness(105%) saturate(90%) hue-rotate(15deg)' },
  { id: 'vintage',  name: 'Vintage',     css: 'sepia(40%) contrast(90%) brightness(110%) saturate(150%)' },
  { id: 'bw',       name: 'Hitam Putih', css: 'grayscale(100%) brightness(120%) contrast(105%)' },
  { id: 'soft',     name: 'Lembut',      css: 'brightness(115%) contrast(95%) saturate(110%)' },
  { id: 'dramatic', name: 'Dramatik',    css: 'contrast(140%) brightness(90%) saturate(120%)' },
  { id: 'rose',     name: 'Mawar',       css: 'sepia(15%) saturate(140%) hue-rotate(-10deg) brightness(105%)' },
]

export function getFilterPreset(filterId: string): FilterPreset {
  return FILTER_PRESETS.find(f => f.id === filterId) || FILTER_PRESETS[0]
}

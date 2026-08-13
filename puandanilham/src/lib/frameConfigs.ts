export type FrameLayoutType = 'single' | 'vertical' | 'grid';

export interface FrameConfig {
  id: string;
  widthInch: number;
  heightInch: number;
  photoCount: number;
  photoWidthInch: number;
  photoHeightInch: number;
  layout: FrameLayoutType;
}

export const FRAME_CONFIGS: Record<string, FrameConfig> = {
  '1': {
    id: '1',
    widthInch: 4,
    heightInch: 6,
    photoCount: 1,
    photoWidthInch: 3.5,
    photoHeightInch: 4.38,
    layout: 'single'
  },
  '2': {
    id: '2',
    widthInch: 2,
    heightInch: 6,
    photoCount: 2,
    photoWidthInch: 1.7,
    photoHeightInch: 2.15,
    layout: 'vertical'
  },
  '4': {
    id: '4',
    widthInch: 4,
    heightInch: 6,
    photoCount: 4,
    photoWidthInch: 1.7,
    photoHeightInch: 2.15,
    layout: 'grid'
  }
};

export function getFrameConfig(frameId: string): FrameConfig {
  return FRAME_CONFIGS[frameId] || FRAME_CONFIGS['1'];
}

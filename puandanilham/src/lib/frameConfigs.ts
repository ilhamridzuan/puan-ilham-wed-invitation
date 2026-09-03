export type FrameLayoutType = 'single' | 'vertical' | 'grid';

export interface PhotoSlot {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FrameConfig {
  id: string;
  widthInch: number;
  heightInch: number;
  photoCount: number;
  photoWidthInch: number;
  photoHeightInch: number;
  layout: FrameLayoutType;
  svgViewBoxWidth: number;
  svgViewBoxHeight: number;
  photoSlots: PhotoSlot[];
}

export const FRAME_CONFIGS: Record<string, FrameConfig> = {
  '1': {
    id: '1',
    widthInch: 4,
    heightInch: 6,
    photoCount: 1,
    photoWidthInch: 3.5,
    photoHeightInch: 4.38,
    layout: 'single',
    svgViewBoxWidth: 288,
    svgViewBoxHeight: 432,
    photoSlots: [
      { x: 18, y: 18, w: 252, h: 315 } // Approximated from clip path inside frame
    ]
  },
  '2': {
    id: '2',
    widthInch: 2,
    heightInch: 6,
    photoCount: 2,
    photoWidthInch: 1.7,
    photoHeightInch: 2.15,
    layout: 'vertical',
    svgViewBoxWidth: 144,
    svgViewBoxHeight: 432,
    photoSlots: [
      { x: 10.80, y: 10.80, w: 122.40, h: 154.91 },
      { x: 10.80, y: 176.40, w: 122.40, h: 154.91 }
    ]
  },
  '4': {
    id: '4',
    widthInch: 4,
    heightInch: 6,
    photoCount: 4,
    photoWidthInch: 1.7,
    photoHeightInch: 2.15,
    layout: 'grid',
    svgViewBoxWidth: 288,
    svgViewBoxHeight: 432,
    photoSlots: [
      { x: 14.40, y: 14.40, w: 122.40, h: 154.91 },
      { x: 151.20, y: 14.40, w: 122.40, h: 154.91 },
      { x: 14.40, y: 183.60, w: 122.40, h: 154.91 },
      { x: 151.20, y: 183.60, w: 122.40, h: 154.91 }
    ]
  }
};

export function getFrameConfig(frameId: string): FrameConfig {
  return FRAME_CONFIGS[frameId] || FRAME_CONFIGS['1'];
}

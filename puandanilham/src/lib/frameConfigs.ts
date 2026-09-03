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
      { x: 16, y: 16, w: 256, h: 319 } // Frame 1
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
      { x: 8.8, y: 8.8, w: 126.4, h: 158.91 },
      { x: 8.8, y: 174.4, w: 126.4, h: 158.91 }
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
      { x: 12.4, y: 12.4, w: 126.4, h: 158.91 },
      { x: 149.2, y: 12.4, w: 126.4, h: 158.91 },
      { x: 12.4, y: 181.6, w: 126.4, h: 158.91 },
      { x: 149.2, y: 181.6, w: 126.4, h: 158.91 }
    ]
  }
};

export function getFrameConfig(frameId: string): FrameConfig {
  return FRAME_CONFIGS[frameId] || FRAME_CONFIGS['1'];
}

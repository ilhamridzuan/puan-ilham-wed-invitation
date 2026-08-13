import { FrameConfig } from './frameConfigs';

export async function mergePhotoAndFrame(
  photos: string[],
  frameUrl: string,
  config: FrameConfig,
  finalWidth: number = 1200
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const frameImg = new Image();
    frameImg.crossOrigin = 'anonymous';
    frameImg.onload = async () => {
      try {
        const finalHeight = (config.heightInch / config.widthInch) * finalWidth;
        
        const canvas = document.createElement('canvas');
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2d context');

        // 1. Process Frame Image to make black pixels transparent
        const offCanvas = document.createElement('canvas');
        offCanvas.width = finalWidth;
        offCanvas.height = finalHeight;
        const offCtx = offCanvas.getContext('2d');
        if (!offCtx) throw new Error('Could not get offscreen 2d context');

        offCtx.drawImage(frameImg, 0, 0, finalWidth, finalHeight);
        const frameData = offCtx.getImageData(0, 0, finalWidth, finalHeight);
        const data = frameData.data;
        // Make pure black (or very close) transparent
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] < 15 && data[i+1] < 15 && data[i+2] < 15) {
            data[i+3] = 0; // alpha = 0
          }
        }
        offCtx.putImageData(frameData, 0, 0);

        // 2. Calculate photo dimensions on canvas
        const pWidth = (config.photoWidthInch / config.widthInch) * finalWidth;
        const pHeight = (config.photoHeightInch / config.heightInch) * finalHeight;

        // 3. Draw Photos
        for (let i = 0; i < config.photoCount; i++) {
          const photoUrl = photos[i] || photos[0]; // Fallback to first if missing
          const photoImg = await loadImage(photoUrl);

          let x = 0;
          let y = 0;

          if (config.layout === 'single') {
            x = (finalWidth - pWidth) / 2;
            y = (finalHeight * (0.25 / config.heightInch)); // Top margin ~0.25 inch
          } else if (config.layout === 'vertical') {
            x = (finalWidth - pWidth) / 2;
            const topMargin = finalHeight * (0.15 / config.heightInch);
            const gap = finalHeight * (0.3 / config.heightInch);
            y = topMargin + (i * (pHeight + gap));
          } else if (config.layout === 'grid') {
            const hMargin = finalWidth * (0.2 / config.widthInch);
            const vMargin = finalHeight * (0.2 / config.heightInch);
            const col = i % 2;
            const row = Math.floor(i / 2);
            x = hMargin + col * (pWidth + hMargin);
            y = vMargin + row * (pHeight + vMargin);
          }

          drawCover(ctx, photoImg, x, y, pWidth, pHeight);
        }

        // 4. Draw transparent-ified frame on top
        ctx.drawImage(offCanvas, 0, 0, finalWidth, finalHeight);

        // 5. Export to WebP
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/webp',
          0.8
        );
      } catch (err) {
        reject(err);
      }
    };
    frameImg.onerror = reject;
    frameImg.src = frameUrl;
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;

  let sWidth = img.width;
  let sHeight = img.height;
  let sx = 0;
  let sy = 0;

  if (imgRatio > targetRatio) {
    sWidth = img.height * targetRatio;
    sx = (img.width - sWidth) / 2;
  } else {
    sHeight = img.width / targetRatio;
    sy = (img.height - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
}

import { FrameConfig } from './frameConfigs';

export async function mergePhotoAndFrame(
  photos: string[],
  frameUrl: string,
  config: FrameConfig,
  finalWidth: number = 1200,
  filterCss: string = 'none'
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

        // 2. Calculate scaling factors based on actual SVG dimensions vs final canvas size
        const scaleX = finalWidth / config.svgViewBoxWidth;
        const scaleY = finalHeight / config.svgViewBoxHeight;

        // 3. Draw Photos
        const supportsCtxFilter = 'filter' in ctx;

        for (let i = 0; i < config.photoCount; i++) {
          const photoUrl = photos[i] || photos[0]; // Fallback to first if missing
          const photoImg = await loadImage(photoUrl);

          // Get the exact slot from SVG config
          const slot = config.photoSlots[i] || config.photoSlots[0];
          
          // Calculate the pixel position and dimensions on the canvas
          const x = slot.x * scaleX;
          const y = slot.y * scaleY;
          const pWidth = slot.w * scaleX;
          const pHeight = slot.h * scaleY;

          ctx.save();
          if (supportsCtxFilter && filterCss && filterCss !== 'none') {
            ctx.filter = filterCss;
          }
          drawCover(ctx, photoImg, x, y, pWidth, pHeight);
          ctx.restore();
        }

        // 4. Draw transparent-ified frame on top
        ctx.drawImage(offCanvas, 0, 0, finalWidth, finalHeight);

        // 5. Export to PNG
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/png'
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

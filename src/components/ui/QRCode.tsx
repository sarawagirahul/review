"use client";

import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { Button } from "./Button";
import { useRef } from "react";

interface QRCodeProps {
  slug: string;
  fgColor?: string;
  bgColor?: string;
  frameText?: string;
  frameStyle?: "standard" | "rounded" | "bordered" | "minimal";
  size?: number;
}

export function QRCode({
  slug,
  fgColor = "#000000",
  bgColor = "#FFFFFF",
  frameText = "Scan to Review Us",
  frameStyle = "standard",
  size = 256,
}: QRCodeProps) {
  const qrRef = useRef<SVGSVGElement>(null);
  
  // URL to encode
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/r/${slug}`;

  const downloadPNG = () => {
    if (!qrRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      // Adding padding for the downloaded image
      const padding = 40;
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;
      
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, padding, padding);
        
        // Add text if frame style requires it
        if (frameText && frameStyle !== "minimal") {
          ctx.font = "bold 24px sans-serif";
          ctx.fillStyle = fgColor;
          ctx.textAlign = "center";
          ctx.fillText(frameText, canvas.width / 2, canvas.height - 15);
        }
      }
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `justhustle-qr-${slug}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative overflow-hidden ${
          frameStyle === "standard" ? "rounded-xl border border-hairline p-6" :
          frameStyle === "rounded" ? "rounded-[3rem] border border-hairline p-8" :
          frameStyle === "bordered" ? "rounded-none border-4 border-ink p-6" :
          "p-4"
        } bg-canvas shadow-sm`}
        style={{ backgroundColor: bgColor }}
      >
        <QRCodeSVG
          ref={qrRef}
          value={url}
          size={size}
          bgColor={bgColor}
          fgColor={fgColor}
          level="H" // High error correction for embedded logos
          marginSize={2}
        />
        {frameStyle !== "minimal" && frameText && (
          <p 
            className="mt-4 text-center font-display font-medium tracking-tight"
            style={{ color: fgColor, fontSize: size < 150 ? '0.875rem' : '1.125rem' }}
          >
            {frameText}
          </p>
        )}
      </div>

      <Button
        variant="secondary"
        className="mt-6 gap-2"
        onClick={downloadPNG}
      >
        <Download className="h-4 w-4" />
        Download PNG
      </Button>
    </div>
  );
}

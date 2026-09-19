import React, { useMemo } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  label?: string;
  sublabel?: string;
}

// Deterministic 2D matrix generator for an authentic clinical QR pattern
export const QRCodeView: React.FC<QRCodeProps> = ({
  value,
  size = 180,
  label = 'PATIENT ID REFERENCE',
  sublabel
}) => {
  const matrix = useMemo(() => {
    const matrixSize = 25;
    const grid: boolean[][] = Array(matrixSize)
      .fill(false)
      .map(() => Array(matrixSize).fill(false));

    // Simple hash function for pseudo-random yet deterministic modules
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    // Populate standard 3 finder patterns in corners (7x7 blocks)
    const placeFinder = (startX: number, startY: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 ||
            r === 6 ||
            c === 0 ||
            c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            grid[startY + r][startX + c] = true;
          }
        }
      }
    };

    placeFinder(0, 0); // Top-left
    placeFinder(matrixSize - 7, 0); // Top-right
    placeFinder(0, matrixSize - 7); // Bottom-left

    // Timing patterns
    for (let i = 8; i < matrixSize - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Fill data area deterministically based on value
    let bitIdx = 0;
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Skip finder pattern zones
        const inTL = r < 8 && c < 8;
        const inTR = r < 8 && c >= matrixSize - 8;
        const inBL = r >= matrixSize - 8 && c < 8;
        const inTiming = r === 6 || c === 6;

        if (!inTL && !inTR && !inBL && !inTiming) {
          const charCode = value.charCodeAt(bitIdx % value.length);
          const bitVal = ((charCode * (r + 1) + c * 17 + hash) ^ (r * c)) % 3 === 0;
          grid[r][c] = bitVal;
          bitIdx++;
        }
      }
    }

    return grid;
  }, [value]);

  const matrixSize = matrix.length;
  const cellSize = size / matrixSize;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
      <div className="relative p-2 bg-white rounded-lg border border-slate-100">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="shape-rendering-crispEdges"
        >
          {/* Background */}
          <rect width={size} height={size} fill="#ffffff" />

          {/* QR modules */}
          {matrix.map((row, rIdx) =>
            row.map((filled, cIdx) => {
              if (!filled) return null;
              return (
                <rect
                  key={`${rIdx}-${cIdx}`}
                  x={cIdx * cellSize}
                  y={rIdx * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="#0f172a"
                />
              );
            })
          )}

          {/* Central Security Shield Emblem overlay */}
          <rect
            x={size / 2 - 16}
            y={size / 2 - 16}
            width={32}
            height={32}
            rx={6}
            fill="#0284c7"
            stroke="#ffffff"
            strokeWidth={2}
          />
          <path
            d={`M ${size / 2 - 6} ${size / 2 - 6} h 12 v 6 a 6 6 0 0 1 -12 0 z`}
            fill="#ffffff"
          />
        </svg>
      </div>

      <div className="mt-3 text-center">
        <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          {label}
        </div>
        <div className="font-mono text-xs font-semibold text-slate-800 break-all px-2 py-0.5 bg-slate-100 rounded mt-1">
          {value}
        </div>
        {sublabel && (
          <div className="text-[10px] text-slate-500 mt-1 max-w-[200px]">
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * VISUAL BODY MAP - Interactive SVG Muscle Selector
 * Click muscles to filter exercises
 */

import React from 'react';
import { MuscleGroup } from '../../types/ultimate-training';

interface VisualBodyMapProps {
  selectedMuscles: MuscleGroup[];
  onMuscleClick: (muscle: MuscleGroup) => void;
}

export const VisualBodyMap: React.FC<VisualBodyMapProps> = ({
  selectedMuscles,
  onMuscleClick
}) => {
  const getMuscleColor = (muscle: MuscleGroup): string => {
    if (selectedMuscles.includes(muscle)) {
      return '#3b82f6'; // blue-600
    }
    return '#e2e8f0'; // slate-200
  };

  const getMuscleOpacity = (muscle: MuscleGroup): number => {
    if (selectedMuscles.includes(muscle)) {
      return 1;
    }
    return 0.3;
  };

  return (
    <div className="flex justify-center items-center py-4">
      <svg
        width="250"
        height="400"
        viewBox="0 0 250 400"
        className="select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <ellipse
          cx="125"
          cy="30"
          rx="20"
          ry="25"
          fill="#cbd5e1"
          stroke="#64748b"
          strokeWidth="1"
        />

        {/* Neck */}
        <rect
          x="115"
          y="50"
          width="20"
          height="15"
          fill="#cbd5e1"
          stroke="#64748b"
          strokeWidth="1"
        />

        {/* Shoulders */}
        <g
          onClick={() => onMuscleClick(MuscleGroup.SHOULDERS)}
          className="cursor-pointer hover:brightness-110 transition-all"
        >
          <ellipse
            cx="90"
            cy="75"
            rx="18"
            ry="15"
            fill={getMuscleColor(MuscleGroup.SHOULDERS)}
            opacity={getMuscleOpacity(MuscleGroup.SHOULDERS)}
            stroke="#64748b"
            strokeWidth="2"
          />
          <ellipse
            cx="160"
            cy="75"
            rx="18"
            ry="15"
            fill={getMuscleColor(MuscleGroup.SHOULDERS)}
            opacity={getMuscleOpacity(MuscleGroup.SHOULDERS)}
            stroke="#64748b"
            strokeWidth="2"
          />
        </g>

        {/* Chest */}
        <g
          onClick={() => onMuscleClick(MuscleGroup.CHEST)}
          className="cursor-pointer hover:brightness-110 transition-all"
        >
          <path
            d="M 105 75 Q 95 90, 95 110 L 95 130 Q 95 140, 105 145 L 125 150 L 145 145 Q 155 140, 155 130 L 155 110 Q 155 90, 145 75 Z"
            fill={getMuscleColor(MuscleGroup.CHEST)}
            opacity={getMuscleOpacity(MuscleGroup.CHEST)}
            stroke="#64748b"
            strokeWidth="2"
          />
        </g>

        {/* Abs */}
        <g
          onClick={() => onMuscleClick(MuscleGroup.ABS)}
          className="cursor-pointer hover:brightness-110 transition-all"
        >
          <rect
            x="105"
            y="150"
            width="40"
            height="60"
            rx="5"
            fill={getMuscleColor(MuscleGroup.ABS)}
            opacity={getMuscleOpacity(MuscleGroup.ABS)}
            stroke="#64748b"
            strokeWidth="2"
          />
          {/* Six-pack lines */}
          <line x1="125" y1="150" x2="125" y2="210" stroke="#64748b" strokeWidth="1" />
          <line x1="105" y1="170" x2="145" y2="170" stroke="#64748b" strokeWidth="1" />
          <line x1="105" y1="190" x2="145" y2="190" stroke="#64748b" strokeWidth="1" />
        </g>

        {/* Biceps */}
        <g
          onClick={() => onMuscleClick(MuscleGroup.BICEPS)}
          className="cursor-pointer hover:brightness-110 transition-all"
        >
          <ellipse
            cx="75"
            cy="110"
            rx="12"
            ry="30"
            fill={getMuscleColor(MuscleGroup.BICEPS)}
            opacity={getMuscleOpacity(MuscleGroup.BICEPS)}
            stroke="#64748b"
            strokeWidth="2"
          />
          <ellipse
            cx="175"
            cy="110"
            rx="12"
            ry="30"
            fill={getMuscleColor(MuscleGroup.BICEPS)}
            opacity={getMuscleOpacity(MuscleGroup.BICEPS)}
            stroke="#64748b"
            strokeWidth="2"
          />
        </g>

        {/* Forearms */}
        <g
          onClick={() => onMuscleClick(MuscleGroup.FOREARMS)}
          className="cursor-pointer hover:brightness-110 transition-all"
        >
          <rect
            x="67"
            y="140"
            width="16"
            height="50"
            rx="5"
            fill={getMuscleColor(MuscleGroup.FOREARMS)}
            opacity={getMuscleOpacity(MuscleGroup.FOREARMS)}
            stroke="#64748b"
            strokeWidth="2"
          />
          <rect
            x="167"
            y="140"
            width="16"
            height="50"
            rx="5"
            fill={getMuscleColor(MuscleGroup.FOREARMS)}
            opacity={getMuscleOpacity(MuscleGroup.FOREARMS)}
            stroke="#64748b"
            strokeWidth="2"
          />
        </g>

        {/* Obliques */}
        <g
          onClick={() => onMuscleClick(MuscleGroup.OBLIQUES)}
          className="cursor-pointer hover:brightness-110 transition-all"
        >
          <path
            d="M 95 150 Q 85 170, 85 190 L 85 210 L 95 210 Z"
            fill={getMuscleColor(MuscleGroup.OBLIQUES)}
            opacity={getMuscleOpacity(MuscleGroup.OBLIQUES)}
            stroke="#64748b"
            strokeWidth="2"
          />
          <path
            d="M 155 150 Q 165 170, 165 190 L 165 210 L 155 210 Z"
            fill={getMuscleColor(MuscleGroup.OBLIQUES)}
            opacity={getMuscleOpacity(MuscleGroup.OBLIQUES)}
            stroke="#64748b"
            strokeWidth="2"
          />
        </g>

        {/* Quads */}
        <g
          onClick={() => onMuscleClick(MuscleGroup.QUADS)}
          className="cursor-pointer hover:brightness-110 transition-all"
        >
          <rect
            x="95"
            y="220"
            width="20"
            height="80"
            rx="5"
            fill={getMuscleColor(MuscleGroup.QUADS)}
            opacity={getMuscleOpacity(MuscleGroup.QUADS)}
            stroke="#64748b"
            strokeWidth="2"
          />
          <rect
            x="135"
            y="220"
            width="20"
            height="80"
            rx="5"
            fill={getMuscleColor(MuscleGroup.QUADS)}
            opacity={getMuscleOpacity(MuscleGroup.QUADS)}
            stroke="#64748b"
            strokeWidth="2"
          />
          {/* Quad separation lines */}
          <line x1="105" y1="220" x2="105" y2="300" stroke="#64748b" strokeWidth="1" />
          <line x1="145" y1="220" x2="145" y2="300" stroke="#64748b" strokeWidth="1" />
        </g>

        {/* Calves */}
        <g
          onClick={() => onMuscleClick(MuscleGroup.CALVES)}
          className="cursor-pointer hover:brightness-110 transition-all"
        >
          <ellipse
            cx="105"
            cy="330"
            rx="10"
            ry="30"
            fill={getMuscleColor(MuscleGroup.CALVES)}
            opacity={getMuscleOpacity(MuscleGroup.CALVES)}
            stroke="#64748b"
            strokeWidth="2"
          />
          <ellipse
            cx="145"
            cy="330"
            rx="10"
            ry="30"
            fill={getMuscleColor(MuscleGroup.CALVES)}
            opacity={getMuscleOpacity(MuscleGroup.CALVES)}
            stroke="#64748b"
            strokeWidth="2"
          />
        </g>

        {/* Back Side View (simplified) */}
        <g transform="translate(0, 0)" opacity="0.6">
          {/* Back */}
          <g
            onClick={() => onMuscleClick(MuscleGroup.BACK)}
            className="cursor-pointer hover:brightness-110 transition-all"
          >
            <path
              d="M 30 75 Q 25 100, 30 120 L 35 140 Q 40 145, 45 140 L 50 120 Q 55 100, 50 75 Z"
              fill={getMuscleColor(MuscleGroup.BACK)}
              opacity={getMuscleOpacity(MuscleGroup.BACK)}
              stroke="#64748b"
              strokeWidth="1"
            />
          </g>

          {/* Traps */}
          <g
            onClick={() => onMuscleClick(MuscleGroup.TRAPS)}
            className="cursor-pointer hover:brightness-110 transition-all"
          >
            <path
              d="M 35 60 L 30 75 L 40 80 L 50 75 L 45 60 Z"
              fill={getMuscleColor(MuscleGroup.TRAPS)}
              opacity={getMuscleOpacity(MuscleGroup.TRAPS)}
              stroke="#64748b"
              strokeWidth="1"
            />
          </g>

          {/* Lower Back */}
          <g
            onClick={() => onMuscleClick(MuscleGroup.LOWER_BACK)}
            className="cursor-pointer hover:brightness-110 transition-all"
          >
            <rect
              x="32"
              y="145"
              width="16"
              height="25"
              rx="3"
              fill={getMuscleColor(MuscleGroup.LOWER_BACK)}
              opacity={getMuscleOpacity(MuscleGroup.LOWER_BACK)}
              stroke="#64748b"
              strokeWidth="1"
            />
          </g>

          {/* Glutes */}
          <g
            onClick={() => onMuscleClick(MuscleGroup.GLUTES)}
            className="cursor-pointer hover:brightness-110 transition-all"
          >
            <circle
              cx="37"
              cy="185"
              r="12"
              fill={getMuscleColor(MuscleGroup.GLUTES)}
              opacity={getMuscleOpacity(MuscleGroup.GLUTES)}
              stroke="#64748b"
              strokeWidth="1"
            />
            <circle
              cx="43"
              cy="185"
              r="12"
              fill={getMuscleColor(MuscleGroup.GLUTES)}
              opacity={getMuscleOpacity(MuscleGroup.GLUTES)}
              stroke="#64748b"
              strokeWidth="1"
            />
          </g>

          {/* Hamstrings */}
          <g
            onClick={() => onMuscleClick(MuscleGroup.HAMSTRINGS)}
            className="cursor-pointer hover:brightness-110 transition-all"
          >
            <rect
              x="32"
              y="200"
              width="8"
              height="50"
              rx="3"
              fill={getMuscleColor(MuscleGroup.HAMSTRINGS)}
              opacity={getMuscleOpacity(MuscleGroup.HAMSTRINGS)}
              stroke="#64748b"
              strokeWidth="1"
            />
            <rect
              x="40"
              y="200"
              width="8"
              height="50"
              rx="3"
              fill={getMuscleColor(MuscleGroup.HAMSTRINGS)}
              opacity={getMuscleOpacity(MuscleGroup.HAMSTRINGS)}
              stroke="#64748b"
              strokeWidth="1"
            />
          </g>

          {/* Triceps */}
          <g
            onClick={() => onMuscleClick(MuscleGroup.TRICEPS)}
            className="cursor-pointer hover:brightness-110 transition-all"
          >
            <ellipse
              cx="20"
              cy="110"
              rx="8"
              ry="25"
              fill={getMuscleColor(MuscleGroup.TRICEPS)}
              opacity={getMuscleOpacity(MuscleGroup.TRICEPS)}
              stroke="#64748b"
              strokeWidth="1"
            />
            <ellipse
              cx="60"
              cy="110"
              rx="8"
              ry="25"
              fill={getMuscleColor(MuscleGroup.TRICEPS)}
              opacity={getMuscleOpacity(MuscleGroup.TRICEPS)}
              stroke="#64748b"
              strokeWidth="1"
            />
          </g>
        </g>

        {/* Labels */}
        <text x="210" y="80" fontSize="10" fill="#64748b">Shoulders</text>
        <text x="210" y="100" fontSize="10" fill="#64748b">Chest</text>
        <text x="210" y="120" fontSize="10" fill="#64748b">Biceps</text>
        <text x="210" y="170" fontSize="10" fill="#64748b">Abs</text>
        <text x="210" y="260" fontSize="10" fill="#64748b">Quads</text>
      </svg>
    </div>
  );
};

export default VisualBodyMap;

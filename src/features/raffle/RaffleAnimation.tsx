import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { simulateRaffle } from "@/server/features/raffle/simulateRaffle";
import { useCallback } from "react";
import type { SimulationFrame } from "@/types/raffle";

export interface Participant {
  id: string;
  name: string;
  color: string;
}

interface RaffleAnimationProps {
  participants: Participant[];
  seed: string;
  onComplete?: () => void;
}

export function RaffleAnimation({
  participants,
  seed,
  onComplete,
}: RaffleAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  console.log("Seed:", seed);
  const animationRef = useRef<number>(null);
  const startTimeRef = useRef<number | undefined>(undefined);
  const [countdown, setCountdown] = useState<number>(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [winners, setWinners] = useState<Set<string>>(new Set());

  // Calculate canvas width based on number of participants
  const canvasWidth = Math.min(2400, Math.max(1200, participants.length * 40));

  // Store simulation result
  const simulationRef = useRef(
    simulateRaffle(
      participants.map((p) => ({ id: p.id, name: p.name })),
      seed,
      canvasWidth,
    ),
  );

  // Handle countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      const timer = setTimeout(() => {
        setCountdown(-1);
        setIsAnimating(true);
        startTimeRef.current = undefined;
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const drawFrame = useCallback(
    (frame: SimulationFrame) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBoundaries(ctx, canvas.width);

      frame.positions.forEach((pos, i) => {
        const participant = participants[i];
        if (!participant) return;
        const isWinner = winners.has(participant.id);
        drawBall(
          ctx,
          pos.x,
          pos.y,
          participant.name,
          participant.color,
          isWinner,
        );
      });
    },
    [participants, winners],
  );

  // Draw static state or current frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initial static state
    if (!isAnimating) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBoundaries(ctx, canvas.width);

      // Arrange participants in multiple rows if needed
      const maxPerRow = Math.floor((canvas.width - 100) / 60);
      const rows = Math.ceil(participants.length / maxPerRow);
      const verticalSpacing = Math.min(50, 200 / rows);

      participants.forEach((participant, i) => {
        const row = Math.floor(i / maxPerRow);
        const col = i % maxPerRow;
        const x =
          50 +
          ((canvas.width - 100) / Math.min(participants.length, maxPerRow)) *
            col;
        const y = 30 + row * verticalSpacing;
        drawBall(ctx, x, y, participant.name, participant.color, false);
      });
    }
  }, [participants, isAnimating, drawFrame, canvasWidth]);

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;
    const simulation = simulationRef.current;
    if (!simulation?.frames?.length) {
      console.error("No simulation frames available");
      return;
    }

    const animate = (timestamp: number) => {
      if (!simulation?.frames?.length) return;

      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const currentTime = elapsed * 0.5;

      const lastFrame = simulation.frames[simulation.frames.length - 1];
      if (!lastFrame) return;

      const frameIndex = simulation.frames.findIndex(
        (f) => f.time >= currentTime,
      );

      // If we've passed the last frame time
      if (frameIndex === -1) {
        drawFrame(lastFrame);
        // Update winners based on final positions
        const newWinners = new Set(
          simulation.finalPositions
            .slice(0, Math.min(10, participants.length))
            .map((p) => p.id)
            .filter((id): id is string => id !== undefined),
        );
        console.log("🏆 Winners determined:", {
          winners: Array.from(newWinners),
          finalPositions: simulation.finalPositions,
          totalParticipants: participants.length,
        });
        setWinners(newWinners);
        if (onComplete) {
          onComplete();
        }
        return;
      }

      const frame = simulation.frames[frameIndex];
      if (!frame) return;

      drawFrame(frame);

      if (currentTime < lastFrame.time) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, participants, drawFrame, onComplete]);

  return (
    <div className="relative w-full overflow-x-auto">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={800}
        className="h-auto w-full rounded-lg shadow-lg"
      />

      {/* Countdown Overlay */}
      <AnimatePresence>
        {countdown >= 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={countdown}
              className="text-8xl font-bold text-white"
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {countdown === 0 ? "GO!" : countdown}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function drawBall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  name: string,
  color: string,
  isWinner: boolean,
) {
  // Draw ball
  ctx.beginPath();
  ctx.fillStyle = color;
  if (isWinner) {
    // Add glow effect for winners
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 16);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0.8)");
    ctx.fillStyle = gradient;
  }
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fill();

  // Add shine effect
  ctx.beginPath();
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.arc(x - 3, y - 3, 3, 0, Math.PI * 2);
  ctx.fill();

  // Draw name
  ctx.fillStyle = "black";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText(name.split(" ")[0] ?? "", x, y - 15);
}

function drawBoundaries(ctx: CanvasRenderingContext2D, width: number) {
  // Draw borders
  ctx.fillStyle = "#1e3a8a";
  ctx.fillRect(0, 780, width, 20); // Bottom
  ctx.fillRect(0, 0, 20, 800); // Left
  ctx.fillRect(width - 20, 0, 20, 800); // Right

  // Draw pegs
  ctx.fillStyle = "#3b82f6";
  const pegRows = 12;
  const pegCols = Math.min(50, Math.max(15, Math.floor(width / 80))); // Limit maximum number of pegs
  const pegSpacingX = width / pegCols;
  const pegSpacingY = 600 / pegRows;

  for (let row = 0; row < pegRows; row++) {
    for (let col = 0; col < pegCols; col++) {
      const offset = row % 2 === 0 ? pegSpacingX / 2 : 0;
      ctx.beginPath();
      ctx.arc(
        col * pegSpacingX + offset,
        100 + row * pegSpacingY,
        5,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
}

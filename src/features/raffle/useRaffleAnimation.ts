import { useState, useCallback } from 'react';

interface RaffleParticipant {
  id: string;
  name: string;
}

export function useRaffleAnimation(participants: RaffleParticipant[]) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [results, setResults] = useState<Array<{ id: string; position: number }>>();

  // Generate consistent colors for participants
  const getParticipantColor = useCallback((index: number) => {
    const colors = [
      '#3b82f6', // blue
      '#10b981', // green
      '#f59e0b', // yellow
      '#ef4444', // red
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#14b8a6', // teal
      '#f97316', // orange
    ];
    return colors[index % colors.length];
  }, []);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    
    // Map participants to include colors
    const participantsWithColors = participants.map((p, i) => ({
      ...p,
      color: getParticipantColor(i),
    }));

    return participantsWithColors;
  }, [participants, getParticipantColor]);

  const handleAnimationComplete = useCallback((results: Array<{ id: string; position: number }>) => {
    setResults(results);
    setIsAnimating(false);
  }, []);

  return {
    isAnimating,
    results,
    startAnimation,
    handleAnimationComplete,
  };
}
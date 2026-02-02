import { useCallback, useEffect, useState, useRef } from "react";
import { Button } from "@/components/Button";
import { api } from "@/utils/api";
import { useUser } from "@/features/auth/hooks/useUser";
import { RaffleAnimation } from "./RaffleAnimation";
import type { RaffleResult } from "@/types/raffle";
import { RaffleStatus } from "@/generated/prisma";
import { pusherClient } from "@/utils/pusher";

interface RaffleSignupProps {
  eventId: number;
  quotaId: string;
  raffleStartTime: Date | null;
  raffleEndTime: Date | null;
}

export function RaffleSignup({
  eventId,
  quotaId,
  raffleStartTime,
  raffleEndTime,
}: RaffleSignupProps) {
  const user = useUser();
  const [countdown, setCountdown] = useState<number>(0);
  const [isReplaying, setIsReplaying] = useState(false);

  const startTimeRefetchedRef = useRef(false);
  const endTimeRefetchedRef = useRef(false);

  // Status query for participants and seed
  const statusQuery = api.raffle.getRaffleStatus.useQuery(
    { eventId, quotaId },
    {
      enabled: true,
      refetchInterval: false, // Don't poll, rely on Pusher and manual refetches
      staleTime: 0,
      gcTime: 0,
    },
  );

  // Results query for completed raffles
  const resultQuery = api.raffle.getRaffleResults.useQuery<RaffleResult[]>(
    { eventId, quotaId },
    {
      enabled: statusQuery.data?.phase === RaffleStatus.COMPLETED,
      staleTime: 0,
      gcTime: 0,
    },
  );

  // Check if current user is registered
  const userEmail = user.data?.email;
  const isRegistered = userEmail
    ? statusQuery.data?.participants?.some((p) => p.email === userEmail)
    : false;

  // Reset refs when status changes
  useEffect(() => {
    startTimeRefetchedRef.current = false;
    endTimeRefetchedRef.current = false;
  }, [statusQuery.data?.phase]);

  // Update countdown
  useEffect(() => {
    if (
      !raffleStartTime ||
      !raffleEndTime ||
      statusQuery.data?.phase === RaffleStatus.COMPLETED
    )
      return;

    const updateCountdown = () => {
      const now = new Date();
      const start = new Date(raffleStartTime);
      const end = new Date(raffleEndTime);

      // If we're in NOT_STARTED and we've passed the start time, refetch once
      if (
        statusQuery.data?.phase === RaffleStatus.NOT_STARTED &&
        now >= start &&
        !startTimeRefetchedRef.current
      ) {
        console.log("Start time reached, refetching...");
        startTimeRefetchedRef.current = true;
        statusQuery.refetch();
        return;
      }

      // If we're in REGISTRATION_OPEN and we've passed the end time, refetch once
      if (
        statusQuery.data?.phase === RaffleStatus.REGISTRATION_OPEN &&
        now >= end &&
        !endTimeRefetchedRef.current
      ) {
        console.log("End time reached, refetching...");
        endTimeRefetchedRef.current = true;
        statusQuery.refetch();
        return;
      }

      // Update countdown based on current phase
      if (statusQuery.data?.phase === RaffleStatus.NOT_STARTED && now < start) {
        const diff = start.getTime() - now.getTime();
        setCountdown(Math.max(0, Math.floor(diff / 1000)));
      } else if (
        statusQuery.data?.phase === RaffleStatus.REGISTRATION_OPEN &&
        now < end
      ) {
        const diff = end.getTime() - now.getTime();
        setCountdown(Math.max(0, Math.floor(diff / 1000)));
      } else {
        setCountdown(0);
      }
    };

    // Initial update
    updateCountdown();

    // Update more frequently to catch the exact moment
    const interval = setInterval(updateCountdown, 500);

    return () => clearInterval(interval);
  }, [raffleStartTime, raffleEndTime, statusQuery]);

  const formatCountdown = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  // Listen for raffle events
  useEffect(() => {
    const channel = pusherClient.subscribe(`raffle-${eventId}`);

    // Listen for status updates
    channel.bind("status-update", () => {
      console.log("Received status update");
      statusQuery.refetch();
      resultQuery.refetch();
    });

    // Listen for simulation complete
    channel.bind("simulation-complete", () => {
      console.log("Simulation complete");
      statusQuery.refetch();
      resultQuery.refetch();
    });

    return () => {
      pusherClient.unsubscribe(`raffle-${eventId}`);
    };
  }, [eventId, statusQuery, resultQuery]);

  // Registration mutation
  const registerMutation = api.signups.createRaffleSignup.useMutation({
    onSuccess: () => {
      statusQuery.refetch();
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      // You might want to show an error toast here
    },
  });

  // Get color for participant
  const getParticipantColor = useCallback((index: number): string => {
    const colors = [
      "#3b82f6", // blue
      "#10b981", // green
      "#f59e0b", // yellow
      "#ef4444", // red
      "#8b5cf6", // purple
      "#ec4899", // pink
      "#14b8a6", // teal
      "#f97316", // orange
    ] as const;
    return colors[index % colors.length] ?? colors[0];
  }, []);

  const handleRegister = useCallback(async () => {
    if (!user.data?.name || !user.data?.email) {
      console.error("User data missing");
      return;
    }

    try {
      await registerMutation.mutateAsync({
        eventId,
        quotaId,
        name: user.data.name,
        email: user.data.email,
      });
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }, [user.data, eventId, quotaId, registerMutation]);

  const handleReplay = useCallback(() => {
    setIsReplaying(true);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    if (isReplaying) {
      setIsReplaying(false);
    }
    // Don't update phase here anymore, server controls it
  }, [isReplaying]);

  // Prepare participants with colors once
  const participantsWithColors = statusQuery.data?.participants?.map(
    (p, i) => ({
      ...p,
      color: getParticipantColor(i),
    }),
  );

  const renderContent = () => {
    if (statusQuery.data?.phase === RaffleStatus.NOT_STARTED) {
      return (
        <div className="mb-4 rounded-lg bg-blue-50 p-6">
          <h3 className="text-lg font-semibold text-blue-900">
            Raffle Registration Opens In
          </h3>
          <div className="mt-2 text-3xl font-bold text-blue-600">
            {formatCountdown(countdown)}
          </div>
        </div>
      );
    }

    if (statusQuery.data?.phase === RaffleStatus.REGISTRATION_OPEN) {
      return (
        <div className="mb-4 rounded-lg bg-green-50 p-6">
          <h3 className="text-lg font-semibold text-green-900">
            Registration Open!
          </h3>
          <div className="mt-2 text-3xl font-bold text-green-600">
            {formatCountdown(countdown)}
          </div>
          <div className="mt-4">
            {isRegistered ? (
              <p className="text-sm font-medium text-green-800">
                ✓ You&apos;re registered! Wait for results...
              </p>
            ) : (
              <Button
                color="primary"
                onClick={handleRegister}
                disabled={
                  registerMutation.isPending ||
                  !user.data?.email ||
                  isRegistered
                }
                className={
                  registerMutation.isPending
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }
              >
                {registerMutation.isPending
                  ? "Registering..."
                  : "Register for Raffle"}
              </Button>
            )}
            <p className="mt-2 text-sm text-green-800">
              Current Participants:{" "}
              {statusQuery.data?.participants?.length ?? 0}
            </p>
          </div>
        </div>
      );
    }

    // Show animation during simulation or replay
    if (
      (statusQuery.data?.phase === RaffleStatus.SIMULATING || isReplaying) &&
      statusQuery.data?.seed &&
      participantsWithColors
    ) {
      return (
        <div className="mx-auto max-w-6xl p-4">
          <RaffleAnimation
            participants={participantsWithColors}
            seed={statusQuery.data.seed}
            onComplete={handleAnimationComplete}
          />
        </div>
      );
    }

    // Show results when completed and not replaying
    if (statusQuery.data?.phase === RaffleStatus.COMPLETED && !isReplaying) {
      return (
        <div className="mx-auto max-w-6xl space-y-4 p-4">
          <div className="flex justify-end">
            <Button color="secondary" onClick={handleReplay}>
              🔄 Replay Animation
            </Button>
          </div>

          {resultQuery.data && (
            <div className="mb-4 rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Raffle Results
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600">Selected</h4>
                  {resultQuery.data
                    .filter((result) => result.status === "CONFIRMED")
                    .map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center justify-between rounded-sm bg-green-50 p-2"
                      >
                        <span className="font-medium">{result.name}</span>
                        <span className="text-green-600">✓</span>
                      </div>
                    ))}
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-500">Not Selected</h4>
                  {resultQuery.data
                    .filter((result) => result.status === "REJECTED")
                    .map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center justify-between rounded-sm bg-gray-50 p-2"
                      >
                        <span className="text-gray-600">{result.name}</span>
                        <span className="text-gray-400">×</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return <div className="relative">{renderContent()}</div>;
}

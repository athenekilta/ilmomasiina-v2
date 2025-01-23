import { createHash } from 'crypto';
import type { Signup } from '@prisma/client';

export function generateRaffleSeed(signups: Array<Pick<Signup, 'email' | 'registrationIntent'>>) {
  // Sort signups by registrationIntent to ensure consistent ordering
  const sortedSignups = [...signups].sort(
    (a, b) => a.registrationIntent!.getTime() - b.registrationIntent!.getTime()
  );

  // Create the combined string of email+timestamp
  const combinedString = sortedSignups
    .map(signup => `${signup.email}${signup.registrationIntent!.getTime()}`)
    .join('');

  // Generate SHA-256 hash
  return createHash('sha256')
    .update(combinedString)
    .digest('hex');
}

export interface RaffleTimeline {
  registrationStart: Date;
  registrationEnd: Date;
  simulationStart: Date;
  simulationEnd: Date;
}

export function generateRaffleTimeline(startTime: Date): RaffleTimeline {
  return {
    registrationStart: startTime,
    registrationEnd: new Date(startTime.getTime() + 30000), // 30 seconds for registration
    simulationStart: new Date(startTime.getTime() + 31000), // Start simulation after registration
    simulationEnd: new Date(startTime.getTime() + 46000) // 15 seconds for simulation
  };
}
import { simulateRaffle } from "../server/features/raffle/simulateRaffle";
import { generateRaffleSeed } from "../utils/raffleUtils";
import { faker } from "@faker-js/faker";
import chalk from "chalk";

interface TestParticipant {
  id: string;
  name: string;
  email: string;
  registrationIntent: Date;
}

interface SimulationResult {
  id: string;
  position: number;
}

function generateTestParticipants(count: number): TestParticipant[] {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    registrationIntent: faker.date.recent(),
  }));
}

function compareResults(a: SimulationResult[], b: SimulationResult[]): boolean {
  if (a.length !== b.length) return false;
  
  return a.every((result, index) => {
    const bResult = b[index];
    return bResult && result.id === bResult.id && result.position === bResult.position;
  });
}

async function runSimulationTest() {
  console.log(chalk.blue("\n🎲 Starting Raffle Simulation Test\n"));

  // Generate test participants
  const participants = generateTestParticipants(20);
  
  // Generate seed
  const seed = generateRaffleSeed(participants);
  
  console.log(chalk.yellow("Test Configuration:"));
  console.log(`- Number of participants: ${participants.length}`);
  console.log(`- Seed: ${seed}`);
  console.log(`- Number of test runs: 100\n`);

  // Store first result as reference
  const firstRun = simulateRaffle(
    participants.map(p => ({ id: p.id, name: p.name })),
    seed
  );
  const referenceResults = firstRun.finalPositions.map(p => ({
    id: p.id,
    position: p.position
  }));

  console.log(chalk.green("Initial Run Results:"));
  referenceResults.forEach((result, index) => {
    console.log(`${index + 1}. Participant ${result.id} at position ${result.position}`);
  });

  // Run simulation multiple times and compare results
  console.log(chalk.yellow("\nRunning 99 more simulations..."));
  
  let allMatch = true;
  let failedRun = -1;

  for (let i = 1; i < 100; i++) {
    const currentRun = simulateRaffle(
      participants.map(p => ({ id: p.id, name: p.name })),
      seed
    );
    const currentResults = currentRun.finalPositions.map(p => ({
      id: p.id,
      position: p.position
    }));
    
    if (!compareResults(referenceResults, currentResults)) {
      allMatch = false;
      failedRun = i;
      
      console.log(chalk.red(`\n❌ Run #${i} produced different results!`));
      console.log("\nExpected results:");
      referenceResults.forEach((result, index) => {
        console.log(`${index + 1}. Participant ${result.id} at position ${result.position}`);
      });
      
      console.log("\nActual results:");
      currentResults.forEach((result, index) => {
        console.log(`${index + 1}. Participant ${result.id} at position ${result.position}`);
      });
      
      break;
    }

    // Show progress
    process.stdout.write(`${i + 1} `);
  }

  console.log("\n");
  
  if (allMatch) {
    console.log(chalk.green("✅ SUCCESS: All 100 simulations produced identical results!"));
    console.log(chalk.green("The raffle simulation is deterministic with the same seed."));
  } else {
    console.log(chalk.red("❌ FAIL: Simulations produced different results!"));
    console.log(chalk.red(`Failed at run #${failedRun}`));
    console.log(chalk.yellow("\nPossible causes:"));
    console.log("1. Non-deterministic random number generation");
    console.log("2. Floating point precision issues");
    console.log("3. Race conditions in the physics simulation");
  }
}

// Run the test
runSimulationTest().catch(console.error); 
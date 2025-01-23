"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateRaffle = simulateRaffle;
const seedrandom_1 = __importDefault(require("seedrandom"));
function simulateRaffle(participants, seed, canvasWidth = 1200) {
    const frames = [];
    const rng = (0, seedrandom_1.default)(seed);
    const BALL_RADIUS = 8;
    const PEG_RADIUS = 5;
    // Generate peg positions
    const pegs = [];
    const pegRows = 12;
    const pegCols = Math.max(15, Math.floor(canvasWidth / 80));
    const pegSpacingX = canvasWidth / pegCols;
    const pegSpacingY = 600 / pegRows;
    for (let row = 0; row < pegRows; row++) {
        for (let col = 0; col < pegCols; col++) {
            const offset = row % 2 === 0 ? pegSpacingX / 2 : 0;
            pegs.push({
                x: col * pegSpacingX + offset,
                y: 100 + row * pegSpacingY,
                radius: PEG_RADIUS
            });
        }
    }
    // Initial ball positions
    const positions = participants.map((_, index) => ({
        x: 50 + ((canvasWidth - 100) / participants.length) * index,
        y: 30,
        angle: 0,
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0.2 },
        active: false,
        radius: BALL_RADIUS,
        stopped: false,
        stoppedAt: undefined
    }));
    function checkPegCollision(pos, peg) {
        if (pos.stopped)
            return;
        const dx = pos.x - peg.x;
        const dy = pos.y - peg.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDist = pos.radius + peg.radius;
        if (distance < minDist) {
            // Calculate collision response
            const angle = Math.atan2(dy, dx);
            const targetX = peg.x + Math.cos(angle) * minDist;
            const targetY = peg.y + Math.sin(angle) * minDist;
            // Move ball out of collision
            pos.x = targetX;
            pos.y = targetY;
            // Calculate new velocity after bounce
            const normalX = dx / distance;
            const normalY = dy / distance;
            const relativeVel = pos.velocity.x * normalX + pos.velocity.y * normalY;
            // Apply bounce with energy loss
            const restitution = 0.5;
            const impulse = (-(1 + restitution) * relativeVel);
            pos.velocity.x += impulse * normalX;
            pos.velocity.y += impulse * normalY;
            // Add some random deflection
            pos.velocity.x += (rng() - 0.5) * 0.5;
        }
    }
    // Generate frames
    const totalTime = 10000;
    const framesPerSecond = 60;
    const totalFrames = (totalTime / 1000) * framesPerSecond;
    for (let frame = 0; frame < totalFrames; frame++) {
        const time = (frame / framesPerSecond) * 1000;
        positions.forEach((pos, index) => {
            if (!pos.active && !pos.stopped) {
                pos.active = true;
                pos.velocity.x = (rng() - 0.5) * 2;
            }
            if (!pos.stopped) {
                // Update position
                pos.velocity.x += pos.acceleration.x;
                pos.velocity.y += pos.acceleration.y;
                pos.x += pos.velocity.x;
                pos.y += pos.velocity.y;
                // Check peg collisions
                pegs.forEach(peg => checkPegCollision(pos, peg));
                // Wall collisions
                if (pos.x - pos.radius < 20 || pos.x + pos.radius > canvasWidth - 20) {
                    pos.velocity.x *= -0.6;
                    pos.x = pos.x < 20 + pos.radius ? 20 + pos.radius : canvasWidth - 20 - pos.radius;
                }
                // Floor collision
                if (pos.y + pos.radius > 760) {
                    pos.velocity.y = 0;
                    pos.velocity.x = 0;
                    pos.y = 760 - pos.radius;
                    pos.stopped = true;
                    pos.stoppedAt = time;
                    const participant = participants[index];
                    if (participant) {
                        console.log(`🛑 Ball stopped at time ${Math.floor(time)}ms, position ${Math.floor(pos.x)}`, {
                            participant: {
                                id: participant.id,
                                name: participant.name
                            },
                            finalPosition: Math.floor(pos.x / (canvasWidth / participants.length))
                        });
                    }
                }
                pos.angle += pos.velocity.x * 0.1;
            }
        });
        frames.push({
            time,
            positions: positions.map(p => ({
                x: p.x,
                y: p.y,
                angle: p.angle
            }))
        });
    }
    // Calculate final positions based on when balls hit the floor
    const finalPositions = positions
        .map((pos, index) => {
        var _a;
        const participant = participants[index];
        if (!participant)
            return null;
        return {
            id: participant.id,
            name: participant.name,
            stoppedAt: (_a = pos.stoppedAt) !== null && _a !== void 0 ? _a : Infinity
        };
    })
        .filter((result) => result !== null)
        .sort((a, b) => a.stoppedAt - b.stoppedAt) // Sort by who reaches bottom first
        .map(({ id, name }, index) => ({
        id,
        name,
        position: index
    }));
    // Log final winners
    console.log('\n🏆 Final Winners (in order of finishing):', finalPositions
        .map((p, i) => `\n${i + 1}. ${p.name}`)
        .join(''));
    return {
        frames,
        finalPositions
    };
}

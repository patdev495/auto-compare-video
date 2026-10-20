#!/usr/bin/env node
// Turn measured TTS durations plus a chosen comparison arc into deterministic
// HyperFrames timing. The arc may contain 10–16 lines, but its semantic beats
// are validated so additional lines add explanation rather than empty padding.
import fs from "node:fs";

const START_AT = 0.55;
const SAME_BEAT_GAP = 0.32;
const BEAT_CHANGE_GAP = 0.42;
const OUTRO_HOLD = 1.3;
const VALID_BEATS = new Set(["hook", "question", "reveal-a", "reveal-b", "compare", "nuance", "payoff"]);

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

const [durationsPath, ...args] = process.argv.slice(2);
const beatsFlag = args.indexOf("--beats");
const beatsValue = beatsFlag === -1 ? null : args[beatsFlag + 1];

if (!durationsPath || !beatsValue) {
  fail("Dùng: node scripts/plan-timing.mjs assets/vo/durations.json --beats hook,hook,question,reveal-a,reveal-a,reveal-b,reveal-b,compare,compare,payoff");
}

const beats = beatsValue.split(",").map((beat) => beat.trim());
if (beats.length < 10 || beats.length > 16) {
  fail(`Comparison Arc cần 10–16 dòng, nhận được ${beats.length}.`);
}
if (beats.some((beat) => !VALID_BEATS.has(beat))) {
  fail(`Beat không hợp lệ. Chỉ dùng: ${[...VALID_BEATS].join(", ")}.`);
}
if (beats[0] !== "hook" || beats[1] !== "hook" || beats[2] !== "question" || beats.at(-1) !== "payoff") {
  fail("Arc phải bắt đầu hook, hook, question và kết thúc bằng payoff.");
}
if (beats.slice(3, -1).includes("hook") || beats.slice(3, -1).includes("question") || beats.slice(3, -1).includes("payoff")) {
  fail("hook, question và payoff chỉ được xuất hiện ở vị trí chuẩn của Comparison Arc.");
}

const body = beats.slice(3, -1);
let cursor = 0;
function consumeRun(beat, min, max) {
  const start = cursor;
  while (body[cursor] === beat) cursor += 1;
  const actual = cursor - start;
  if (actual < min || actual > max) {
    fail(`${beat} cần ${min}–${max} dòng, nhận được ${actual}.`);
  }
}
consumeRun("reveal-a", 2, 4);
consumeRun("reveal-b", 2, 4);
consumeRun("compare", 2, 3);
consumeRun("nuance", 0, 1);
if (cursor !== body.length) {
  fail("Comparison Arc phải theo thứ tự reveal-a → reveal-b → compare → nuance (tuỳ chọn) → payoff.");
}

let durations;
try {
  durations = JSON.parse(fs.readFileSync(durationsPath, "utf8"));
} catch (error) {
  fail(`Không đọc được durations.json: ${error.message}`);
}

const lines = beats.map((beat, index) => {
  const id = `line-${index + 1}`;
  const duration = Number(durations[id]);
  if (!Number.isFinite(duration) || duration <= 0) {
    fail(`${id} phải có duration dương trong ${durationsPath}.`);
  }
  return { id, beat, duration };
});

let start = START_AT;
const timing = [];
for (const line of lines) {
  const previous = timing.at(-1);
  if (previous) {
    start = previous.start + previous.duration + (previous.beat === line.beat ? SAME_BEAT_GAP : BEAT_CHANGE_GAP);
  }
  timing.push({ ...line, start: Number(start.toFixed(3)) });
}
const last = timing.at(-1);

console.log(JSON.stringify({ lines: timing, rootDuration: Number((last.start + last.duration + OUTRO_HOLD).toFixed(3)) }, null, 2));

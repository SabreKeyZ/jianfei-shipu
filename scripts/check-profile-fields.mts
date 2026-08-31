import assert from "node:assert/strict";
import {
  isProfileComplete,
  parseProfileNumber,
  profileFieldError,
  seedProfileField,
} from "../src/lib/profile.ts";

assert.equal(parseProfileNumber(""), null);
assert.equal(parseProfileNumber("   "), null);
assert.equal(parseProfileNumber("0"), 0);
assert.equal(parseProfileNumber("28"), 28);
assert.equal(parseProfileNumber("55.5"), 55.5);
assert.equal(Number(""), 0, "document the browser/Number empty-string trap");
assert.notEqual(parseProfileNumber(""), 0);

assert.equal(seedProfileField(undefined, 28), "28");
assert.equal(seedProfileField(0, 28), "");
assert.equal(seedProfileField(32, 28), "32");

assert.equal(profileFieldError("age", ""), "请填写年龄");
assert.equal(profileFieldError("age", "0"), "年龄请填 14–90 岁");
assert.equal(profileFieldError("age", "28"), null);
assert.equal(profileFieldError("heightCm", ""), "请填写身高");
assert.equal(profileFieldError("weightKg", "20"), "体重请填 35–160 kg");

assert.equal(
  isProfileComplete({
    heightCm: 160,
    weightKg: 55,
    age: 0,
    sex: "female",
    goal: "cut",
    source: "user",
  }),
  false,
);
assert.equal(
  isProfileComplete({
    heightCm: 160,
    weightKg: 55,
    age: 28,
    sex: "female",
    goal: "cut",
    source: "user",
  }),
  true,
);

console.log("profile field checks ok");

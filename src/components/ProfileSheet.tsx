import { useState } from "react";
import {
  parseProfileNumber,
  profileFieldError,
  seedProfileField,
  targetsOf,
  type Goal,
  type Profile,
  type Sex,
} from "../lib/profile";

function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, "");
}

function decimalAmount(raw: string): string {
  const cleaned = raw.replace(/[^\d.]/g, "");
  const dot = cleaned.indexOf(".");
  if (dot === -1) return cleaned;
  return `${cleaned.slice(0, dot + 1)}${cleaned.slice(dot + 1).replace(/\./g, "")}`;
}

export function ProfileSheet({
  initial,
  allowSkip,
  onSave,
  onSkip,
  onClose,
}: {
  initial: Profile | null;
  allowSkip: boolean;
  onSave: (profile: Profile) => void;
  onSkip?: () => void;
  onClose?: () => void;
}) {
  const [heightCm, setHeightCm] = useState(() => seedProfileField(initial?.heightCm, 160));
  const [weightKg, setWeightKg] = useState(() => seedProfileField(initial?.weightKg, 55));
  const [age, setAge] = useState(() => seedProfileField(initial?.age, 28));
  const [sex, setSex] = useState<Sex>(initial?.sex ?? "female");
  const [goal, setGoal] = useState<Goal>(initial?.goal ?? "cut");

  const heightError = profileFieldError("heightCm", heightCm);
  const weightError = profileFieldError("weightKg", weightKg);
  const ageError = profileFieldError("age", age);
  const formError = heightError ?? weightError ?? ageError;

  const draftHeight = parseProfileNumber(heightCm);
  const draftWeight = parseProfileNumber(weightKg);
  const draftAge = parseProfileNumber(age);
  const draft: Profile | null =
    draftHeight != null && draftWeight != null && draftAge != null
      ? {
          heightCm: draftHeight,
          weightKg: draftWeight,
          age: draftAge,
          sex,
          goal,
          source: "user",
        }
      : null;
  const preview = draft && !formError ? targetsOf(draft) : null;

  function submit() {
    if (!draft || formError) return;
    onSave(draft);
  }

  return (
    <div className="sheet-mask">
      <div className="sheet" role="dialog" aria-label="身体数据">
        <p className="date-line">先记下你的身材</p>
        <h2>菜单按你的身体来</h2>
        <p className="sheet-lead">
          用身高、体重、年龄和性别算基础代谢，再排今天的家常菜。不是一套固定周菜单。
        </p>

        <label className="field">
          <span>身高</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            placeholder="例如 160"
            value={heightCm}
            aria-invalid={Boolean(heightError)}
            onChange={(e) => setHeightCm(digitsOnly(e.target.value))}
          />
          <em>cm</em>
        </label>
        <label className="field">
          <span>体重</span>
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="例如 55"
            value={weightKg}
            aria-invalid={Boolean(weightError)}
            onChange={(e) => setWeightKg(decimalAmount(e.target.value))}
          />
          <em>kg</em>
        </label>
        <label className="field">
          <span>年龄</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            placeholder="例如 28"
            value={age}
            aria-invalid={Boolean(ageError)}
            onChange={(e) => setAge(digitsOnly(e.target.value))}
          />
          <em>岁</em>
        </label>

        <div className="seg-block">
          <p>性别</p>
          <div className="segment">
            <button type="button" className={sex === "female" ? "on" : ""} onClick={() => setSex("female")}>
              女
            </button>
            <button type="button" className={sex === "male" ? "on" : ""} onClick={() => setSex("male")}>
              男
            </button>
          </div>
        </div>
        <div className="seg-block">
          <p>目标</p>
          <div className="segment">
            <button type="button" className={goal === "cut" ? "on" : ""} onClick={() => setGoal("cut")}>
              减脂
            </button>
            <button type="button" className={goal === "maintain" ? "on" : ""} onClick={() => setGoal("maintain")}>
              维持
            </button>
          </div>
        </div>

        <p className="sheet-target">
          {preview
            ? `今日目标大约 ${preview.kcal} 千卡 · 蛋白 ${preview.protein}g`
            : "填好身高、体重和年龄后会算出今日目标"}
        </p>
        {formError ? <p className="sheet-error">{formError}</p> : null}

        <button
          type="button"
          className="btn-primary sheet-save"
          disabled={Boolean(formError)}
          onClick={submit}
        >
          按这个排菜单
        </button>
        {allowSkip ? (
          <button type="button" className="text-btn" onClick={onSkip}>
            先用示例身材看看
          </button>
        ) : null}
        {onClose ? (
          <button type="button" className="text-btn" onClick={onClose}>
            先不改
          </button>
        ) : null}
      </div>
    </div>
  );
}

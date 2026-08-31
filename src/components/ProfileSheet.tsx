import { useState } from "react";
import { targetsOf, type Goal, type Profile, type Sex } from "../lib/profile";

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
  const [heightCm, setHeightCm] = useState(initial?.heightCm ?? 160);
  const [weightKg, setWeightKg] = useState(initial?.weightKg ?? 55);
  const [age, setAge] = useState(initial?.age ?? 28);
  const [sex, setSex] = useState<Sex>(initial?.sex ?? "female");
  const [goal, setGoal] = useState<Goal>(initial?.goal ?? "cut");

  const draft: Profile = {
    heightCm,
    weightKg,
    age,
    sex,
    goal,
    source: "user",
  };
  const preview = targetsOf(draft);

  function submit() {
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
            type="number"
            inputMode="numeric"
            value={heightCm}
            min={130}
            max={210}
            onChange={(e) => setHeightCm(Number(e.target.value))}
          />
          <em>cm</em>
        </label>
        <label className="field">
          <span>体重</span>
          <input
            type="number"
            inputMode="decimal"
            value={weightKg}
            min={35}
            max={160}
            step={0.5}
            onChange={(e) => setWeightKg(Number(e.target.value))}
          />
          <em>kg</em>
        </label>
        <label className="field">
          <span>年龄</span>
          <input
            type="number"
            inputMode="numeric"
            value={age}
            min={14}
            max={90}
            onChange={(e) => setAge(Number(e.target.value))}
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
          今日目标大约 {preview.kcal} 千卡 · 蛋白 {preview.protein}g
        </p>

        <button type="button" className="btn-primary sheet-save" onClick={submit}>
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

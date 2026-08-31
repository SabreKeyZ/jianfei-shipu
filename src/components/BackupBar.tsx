import { useRef, useState } from "react";
import { applyBackup, downloadBackup, readBackupFile } from "../lib/backup";

export function BackupBar({ onRestored }: { onRestored: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState("");

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(""), 2200);
  }

  async function onPick(file: File | undefined) {
    if (!file) return;
    if (!window.confirm("恢复备份会覆盖这台手机上的当前数据，确定吗？")) return;
    try {
      const data = await readBackupFile(file);
      applyBackup(data);
      onRestored();
      showToast("已恢复备份");
    } catch {
      showToast("这个文件不是减脂食谱备份");
    }
  }

  return (
    <div className="backup-bar">
      <p>数据只存在这台手机，可先导出一份</p>
      <div className="backup-actions">
        <button type="button" className="btn-ghost backup-btn" onClick={() => downloadBackup()}>
          导出备份
        </button>
        <button
          type="button"
          className="btn-ghost backup-btn"
          onClick={() => inputRef.current?.click()}
        >
          恢复备份
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          void onPick(file);
        }}
      />
      {toast ? <p className="toast page-toast">{toast}</p> : null}
    </div>
  );
}

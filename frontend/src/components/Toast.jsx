export default function Toast({ message, type }) {
  const icon = type === "success" ? "✓" : "✕";
  return (
    <div className={`toast toast-${type}`}>
      <span style={{ fontWeight: 700, fontSize: 16 }}>{icon}</span>
      <span>{message}</span>
    </div>
  );
}

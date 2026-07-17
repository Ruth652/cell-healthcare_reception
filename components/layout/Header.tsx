export default function Header() {
  return (
    <header className="header">
      <div className="header-main">
        <div className="header-logo">
          <div>
            <div className="logo-text">CELL HEALTHCARE</div>

            <div className="logo-solutions">SOLUTIONS</div>

            <div className="logo-amharic">የጤናዎ ታማኝ እንልጋይ!</div>
          </div>
        </div>

        <div className="header-right">
          <div className="header-date">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>

          <div>Patient Reception System</div>

          <div>Addis Ababa, Ethiopia</div>
        </div>
      </div>

      <div className="header-stripe">
        <span>✈️ International Medical Tourism</span>

        <span>·</span>

        <span>🏥 Local Patient Services</span>

        <span>·</span>

        <span>🧬 IVF & Reproductive Medicine</span>

        <span>·</span>

        <span>🔬 Advanced Diagnostics</span>
      </div>
    </header>
  );
}

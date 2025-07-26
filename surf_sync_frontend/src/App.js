import React, { useState } from "react";
import "./App.css";

// Constants for theme
const COLORS = {
  primary: "#0077be",
  secondary: "#fceabb",
  accent: "#20b2aa",
  sand: "#ffe4b5",
  deepBlue: "#003366",
  oceanMid: "#4dd2ff",
  surfWhite: "#f8f9fa",
};

// Emoji mood picker options
const MOODS = [
  { value: "great", emoji: "🌊", label: "Great" },
  { value: "good", emoji: "😊", label: "Good" },
  { value: "ok", emoji: "😐", label: "Okay" },
  { value: "bad", emoji: "😞", label: "Poor" },
];

// Board dropdown options
const BOARDS = [
  { value: "shortboard", icon: "🏄‍♂️", label: "Shortboard" },
  { value: "fish", icon: "🐟", label: "Fish" },
  { value: "longboard", icon: "🛹", label: "Longboard" },
  { value: "foamie", icon: "🧼", label: "Foamie" },
];

// Condition input options (icon-based)
const SWELL_RANGE = Array(13)
  .fill(0)
  .map((_, i) => i);
const WIND_OPTIONS = [
  { value: "offshore", icon: "➡️", label: "Offshore" },
  { value: "onshore", icon: "💨", label: "Onshore" },
  { value: "glassy", icon: "✨", label: "Glassy" },
];
const TIDE_OPTIONS = [
  { value: "high", icon: "🌕", label: "High" },
  { value: "mid", icon: "🌓", label: "Mid" },
  { value: "low", icon: "🌑", label: "Low" },
];

// Sample/mock surf session data
const MOCK_SESSIONS = [
  {
    id: 1,
    date: "2024-06-11",
    spot: "Malibu Beach",
    board: "longboard",
    waveCount: 15,
    mood: "good",
    notes: "Super fun and mellow, small but glassy waves.",
    swell: 3,
    wind: "glassy",
    tide: "mid",
  },
  {
    id: 2,
    date: "2024-06-10",
    spot: "Huntington Pier",
    board: "shortboard",
    waveCount: 7,
    mood: "ok",
    notes: "Crowded, strong current. Left early.",
    swell: 4,
    wind: "onshore",
    tide: "high",
  },
  {
    id: 3,
    date: "2024-06-09",
    spot: "Venice Breakwater",
    board: "fish",
    waveCount: 22,
    mood: "great",
    notes: "Epic day! Fast fun sections, tons of rides.",
    swell: 7,
    wind: "offshore",
    tide: "low",
  },
  {
    id: 4,
    date: "2024-06-08",
    spot: "Sunset Point",
    board: "foamie",
    waveCount: 10,
    mood: "bad",
    notes: "Windy and messy. Couldn't catch much.",
    swell: 2,
    wind: "onshore",
    tide: "mid",
  },
];

// ===== SurfSync Logo (icon+wordmark) =====
const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <span
      style={{
        fontSize: 32,
        color: COLORS.accent,
        filter: "drop-shadow(0 1px 4px #20b2aa33)",
        marginRight: 4,
      }}
      aria-hidden="true"
    >
      🌊
    </span>
    <span
      style={{
        fontWeight: 700,
        fontFamily: "Pacifico, Segoe Script, cursive",
        fontSize: 28,
        color: COLORS.primary,
        letterSpacing: 1,
        textShadow: `0 2px 8px #00aec667`,
      }}
    >
      SurfSync
    </span>
  </div>
);

// ===== App-level navigation/header bar =====
function Header({ onNav, activeScreen }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.5rem 1.2rem",
        background:
          "linear-gradient(90deg,#55b7ff 0%,#20b2aa 85%,#fceabb 100%)",
        borderBottom: "3px solid #20b2aa44",
        justifyContent: "space-between",
        minHeight: 62,
        boxShadow: "0 2px 12px 0 #0077be14",
      }}
    >
      <Logo />
      <nav style={{ display: "flex", gap: 18 }}>
        <button
          className={`nav-btn ${activeScreen === "home" ? "active" : ""}`}
          style={navBtnStyle(activeScreen === "home")}
          onClick={() => onNav("home")}
        >
          <span role="img" aria-label="Sessions">
            🗒️
          </span>{" "}
          Sessions
        </button>
        <button
          className={`nav-btn ${activeScreen === "dashboard" ? "active" : ""}`}
          style={navBtnStyle(activeScreen === "dashboard")}
          onClick={() => onNav("dashboard")}
        >
          <span role="img" aria-label="Stats">
            📈
          </span>{" "}
          Dashboard
        </button>
        <button
          className={`nav-btn ${activeScreen === "reminder" ? "active" : ""}`}
          style={navBtnStyle(activeScreen === "reminder")}
          onClick={() => onNav("reminder")}
        >
          <span role="img" aria-label="Reminder">
            ⏰
          </span>{" "}
          Reminder
        </button>
      </nav>
    </header>
  );
}

function navBtnStyle(active) {
  return {
    background: active ? COLORS.primary : "transparent",
    color: active ? COLORS.surfWhite : COLORS.primary,
    borderRadius: 20,
    border: 0,
    fontWeight: 600,
    fontSize: 16,
    padding: "8px 20px",
    cursor: "pointer",
    boxShadow: active ? "0 2px 6px #1aa7ae29" : undefined,
    transition: "all .2s",
  };
}

// ===== Floating Action Button (FAB) =====
function FloatingAction({ label, onClick }) {
  return (
    <button
      style={{
        position: "fixed",
        right: 28,
        bottom: 38,
        background: `linear-gradient(90deg,${COLORS.accent},${COLORS.primary})`,
        color: "#fff",
        fontWeight: 700,
        fontSize: 21,
        zIndex: "10",
        border: "none",
        borderRadius: "50px",
        padding: "18px 29px",
        boxShadow: "0 3px 16px #2196f340",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 14,
        textShadow: "0 1px 5px #33666677",
      }}
      aria-label={label}
      onClick={onClick}
    >
      <span style={{ fontSize: 27, filter: "drop-shadow(0 1px 8px #EEFBFF)" }}>
        ＋
      </span>{" "}
      <span>{label}</span>
    </button>
  );
}

// ===== Session Card (Home/list + miniature view for Dashboard) =====
function SessionCard({ session, onClick, onDelete }) {
  const moodObj = MOODS.find((x) => x.value === session.mood);
  const boardObj = BOARDS.find((x) => x.value === session.board);
  return (
    <div
      className="session-card"
      style={{
        background: "#fafdff",
        borderRadius: 23,
        padding: "1.2rem 1.1rem",
        boxShadow: "0 4px 20px 0 #0077be17",
        margin: "1rem 0",
        cursor: "pointer",
        transition: "transform .13s",
        position: "relative",
        border: "2px solid #e1eef7",
        maxWidth: 460,
      }}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`View session at ${session.spot} on ${session.date}`}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span
          style={{
            fontSize: 27,
            lineHeight: 1,
            marginRight: 5,
            textShadow: "0 2px 8px #55b7ff44",
          }}
          aria-label={moodObj.label}
        >
          {moodObj?.emoji}
        </span>
        <span
          style={{
            fontWeight: 700,
            color: COLORS.primary,
            fontSize: 17,
            letterSpacing: 0.1,
            marginRight: 8,
            flex: 1,
          }}
        >
          {session.spot}
        </span>
        <span
          style={{
            fontWeight: 500,
            color: "#0090b2",
            borderRadius: 18,
            fontSize: 14,
            background: "#f3fcff",
            padding: "4px 11px 4px 7px",
            marginRight: 6,
            boxShadow: "0 1px 7px #0077be14",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          {boardObj?.icon} {boardObj?.label}
        </span>
      </div>
      <div
        style={{
          margin: "8px 0 0 2px",
          fontSize: 14.3,
          color: "#006491",
          minHeight: 25,
        }}
      >
        <span style={{ fontWeight: 700 }}>
          {session.date} &mdash; {session.waveCount} waves
        </span>
        <span style={{ marginLeft: 13, color: "#008caa", fontWeight: 500 }}>
          {session.wind && WIND_OPTIONS.find((x) => x.value === session.wind)?.icon}{" "}
          {session.swell && ` ${session.swell}ft`}
        </span>
      </div>
      <div
        style={{
          fontSize: 15,
          color: "#0077be",
          marginTop: 5,
          minHeight: 22,
        }}
      >
        <em>
          {session.notes &&
            (session.notes.length > 60
              ? session.notes.substring(0, 60) + "…"
              : session.notes)}
        </em>
      </div>
      {onDelete && (
        <button
          style={{
            position: "absolute",
            top: 14,
            right: 19,
            background: "#fee8e2cc",
            border: "none",
            borderRadius: 50,
            cursor: "pointer",
            color: "#d46d6d",
            fontSize: 15,
            padding: "4px 9px",
            fontWeight: 700,
            zIndex: 3,
          }}
          aria-label="Delete session"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          🗑️
        </button>
      )}
    </div>
  );
}

// ===== Filter Bar (spot, board, mood) =====
function FilterBar({ filters, setFilters, sessions }) {
  // Derive all spots/unique boards/moods in data
  const spots = Array.from(new Set(sessions.map((x) => x.spot)));
  const moods = MOODS;
  const boards = BOARDS;
  function handleChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }
  return (
    <div
      style={{
        display: "flex",
        gap: 18,
        alignItems: "center",
        justifyContent: "center",
        margin: "1rem 0 1.3rem 0",
        background: "#eafcff",
        borderRadius: 22,
        boxShadow: "0 2px 12px #0077be10",
        padding: "0.6rem 0.7rem",
        flexWrap: "wrap",
      }}
    >
      <div>
        <label htmlFor="filterSpot" style={filterLabelStyle}>
          <span role="img" aria-label="Spot">
            📍
          </span>{" "}
          Spot:
        </label>
        <select
          id="filterSpot"
          name="spot"
          value={filters.spot}
          onChange={handleChange}
          style={filterInputStyle}
        >
          <option value="">All</option>
          {spots.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filterBoard" style={filterLabelStyle}>
          <span role="img" aria-label="Board">
            🏄‍♂️
          </span>{" "}
          Board:
        </label>
        <select
          id="filterBoard"
          name="board"
          value={filters.board}
          onChange={handleChange}
          style={filterInputStyle}
        >
          <option value="">All</option>
          {boards.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filterMood" style={filterLabelStyle}>
          <span role="img" aria-label="Mood">
            😊
          </span>{" "}
          Mood:
        </label>
        <select
          id="filterMood"
          name="mood"
          value={filters.mood}
          onChange={handleChange}
          style={filterInputStyle}
        >
          <option value="">All</option>
          {moods.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
const filterLabelStyle = {
  fontWeight: 500,
  marginRight: 7,
  fontSize: 14,
  color: COLORS.primary,
};
const filterInputStyle = {
  background: "#fff",
  border: `1.7px solid ${COLORS.primary}50`,
  borderRadius: 11,
  fontSize: 15,
  fontWeight: 500,
  color: COLORS.primary,
  padding: "6px 17px",
  marginLeft: 3,
};

// ===== Home screen: List of Session Cards + FAB and FilterBar =====
function HomeScreen({
  sessions,
  filters,
  setFilters,
  onSelectedSession,
  onOpenNew,
  onDeleteSession,
}) {
  // Filter logic
  const filtered = sessions.filter((s) => {
    return (
      (filters.spot === "" || s.spot === filters.spot) &&
      (filters.board === "" || s.board === filters.board) &&
      (filters.mood === "" || s.mood === filters.mood)
    );
  });
  return (
    <main>
      <div
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, #bdf0fd 0%, #e0fbff 85%, #fceabb 100%)",
          padding: "2.5rem 0 2rem 0",
          minHeight: 420,
        }}
      >
        <h2
          style={{
            color: COLORS.primary,
            fontWeight: 800,
            textShadow: "0 2px 18px #69ddff40",
          }}
        >
          Surf Sessions
        </h2>
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          sessions={sessions}
        />
        {filtered.length === 0 ? (
          <div style={{ padding: 36, color: "#88b3ff", fontSize: 19 }}>
            No sessions match these filters! 🌊
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            {filtered.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => onSelectedSession(session)}
                onDelete={
                  onDeleteSession
                    ? () => onDeleteSession(session)
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
      <FloatingAction label="Log New Session" onClick={onOpenNew} />
    </main>
  );
}

// ===== Modal Background Overlay =====
function ModalOverlay({ children, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 90,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "#083d5e44",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      tabIndex={-1}
      onClick={onClose}
      aria-label="Close modal background"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", minWidth: 310, maxWidth: "96vw" }}
      >
        {children}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: 13,
            right: 19,
            background: "#FFFFFFdd",
            border: "none",
            borderRadius: 50,
            cursor: "pointer",
            color: COLORS.primary,
            fontSize: 22,
            padding: "3px 11px",
            fontWeight: 700,
            zIndex: 9,
            boxShadow: "0 4px 14px #00b2ea17",
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

// ===== Log/Edit Session Modal (Form for new or edit) =====
function LogSessionModal({
  onSubmit,
  onCancel,
  initial,
  boards = BOARDS,
  moods = MOODS,
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState(
    initial || {
      date: today,
      spot: "",
      board: "shortboard",
      waveCount: "",
      mood: "good",
      notes: "",
      swell: 3,
      wind: "offshore",
      tide: "mid",
    }
  );
  const [error, setError] = useState("");
  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }
  function handleMood(val) {
    setForm({ ...form, mood: val });
  }
  function handleCondition(name, value) {
    setForm({ ...form, [name]: value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.date || !form.spot || !form.board || !form.mood) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!form.waveCount || isNaN(form.waveCount) || form.waveCount < 0) {
      setError("Please enter a valid number of waves.");
      return;
    }
    setError("");
    onSubmit(form);
  }
  return (
    <ModalOverlay onClose={onCancel}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: `linear-gradient(180deg, #e5f7ff 70%, #d1f2f9 100%)`,
          borderRadius: 27,
          padding: "2.25rem 1.6rem 1.3rem 1.6rem",
          minWidth: 330,
          maxWidth: 420,
          minHeight: 400,
          boxShadow: "0 8px 20px #0077be32",
          position: "relative",
          zIndex: 50,
        }}
      >
        <h2
          style={{
            fontWeight: 800,
            letterSpacing: 0.5,
            color: COLORS.primary,
            marginBottom: 14,
            textAlign: "center",
          }}
        >
          {initial ? "Edit Session" : "Log New Session"}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <label>
            <span style={{ color: COLORS.primary, fontWeight: "bold" }}>
              Date:
            </span>
            <input
              style={inputStyle}
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              max={today}
              required
            />
          </label>
          <label>
            <span style={{ color: COLORS.primary, fontWeight: "bold" }}>
              Surf Spot:
            </span>
            <input
              style={inputStyle}
              name="spot"
              placeholder="e.g. Malibu"
              value={form.spot}
              onChange={handleChange}
              autoFocus={!initial}
              required
            />
          </label>
          <label>
            <span style={{ color: COLORS.primary, fontWeight: "bold" }}>
              Board:
            </span>
            <select
              style={{ ...inputStyle, fontSize: 16 }}
              name="board"
              value={form.board}
              onChange={handleChange}
              required
            >
              {boards.map((b) => (
                <option value={b.value} key={b.value}>
                  {b.icon} {b.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span style={{ color: COLORS.primary, fontWeight: "bold" }}>
              Waves Caught:
            </span>
            <input
              style={inputStyle}
              type="number"
              min={0}
              name="waveCount"
              placeholder="Waves"
              value={form.waveCount}
              onChange={handleChange}
              required
            />
          </label>
          <div>
            <span style={{ color: COLORS.primary, fontWeight: "bold" }}>
              Mood:
            </span>
            <div style={{ display: "flex", gap: 13, marginTop: 3 }}>
              {moods.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  tabIndex={0}
                  aria-label={m.label}
                  style={{
                    fontSize: 24,
                    background:
                      form.mood === m.value
                        ? COLORS.accent
                        : "#e7fcff",
                    color: form.mood === m.value ? "#fff" : COLORS.primary,
                    border: "none",
                    borderRadius: 100,
                    cursor: "pointer",
                    padding: "5px 13px",
                    boxShadow:
                      form.mood === m.value
                        ? "0 2px 10px #20b2aa61"
                        : undefined,
                    outline: "none",
                  }}
                  onClick={() => handleMood(m.value)}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span style={{ color: COLORS.primary, fontWeight: "bold" }}>
              Swell:{" "}
            </span>
            <input
              type="range"
              name="swell"
              min={0}
              max={12}
              value={form.swell}
              onChange={(e) =>
                handleCondition("swell", parseInt(e.target.value, 10))
              }
              style={{
                width: "100%",
                accentColor: COLORS.primary,
              }}
            />
            <span>
              <b>{form.swell} ft</b>
            </span>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <div>
              <span style={condLabel}>Wind:</span>
              <div style={{ display: "flex", gap: 8 }}>
                {WIND_OPTIONS.map((w) => (
                  <button
                    key={w.value}
                    type="button"
                    style={iconOptionStyle(form.wind === w.value)}
                    onClick={() => handleCondition("wind", w.value)}
                    aria-label={w.label}
                  >
                    {w.icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span style={condLabel}>Tide:</span>
              <div style={{ display: "flex", gap: 8 }}>
                {TIDE_OPTIONS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    style={iconOptionStyle(form.tide === t.value)}
                    onClick={() => handleCondition("tide", t.value)}
                    aria-label={t.label}
                  >
                    {t.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <label>
            <span style={{ color: COLORS.primary, fontWeight: "bold" }}>
              Notes:
            </span>
            <textarea
              style={textAreaStyle}
              name="notes"
              placeholder="Write about today..."
              rows={3}
              value={form.notes}
              onChange={handleChange}
            />
          </label>
          {error && (
            <div style={{ color: "#b93c3c", marginTop: 6 }}>{error}</div>
          )}
          <button
            type="submit"
            style={{
              marginTop: 13,
              background:
                "linear-gradient(90deg,#20b2aa,#0077be 85%,#fceabb 100%)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 18,
              border: "none",
              borderRadius: 17,
              padding: "11px 0",
              cursor: "pointer",
              boxShadow: "0 3px 14px #179cd720",
            }}
          >
            {initial ? "Save Changes" : "Log Session"}
          </button>
        </div>
      </form>
    </ModalOverlay>
  );
}
const inputStyle = {
  border: `1.5px solid ${COLORS.primary}80`,
  borderRadius: 11,
  width: "100%",
  padding: "8px 11px",
  fontSize: 15,
  marginTop: 3,
  marginBottom: 3,
  color: COLORS.primary,
};
const textAreaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: 48,
};

// Icon option style for wind/tide
const iconOptionStyle = (active) => ({
  fontSize: 21,
  background: active
    ? `linear-gradient(90deg,#20b2aa70,#0077be3a)`
    : "#e2f7ff",
  color: active ? "#fff" : COLORS.primary,
  border: active ? `2px solid #20b2aac0` : `1.5px solid #0077be40`,
  borderRadius: 99,
  cursor: "pointer",
  padding: "5.3px 12px",
  marginTop: 2,
  boxShadow: active ? "0 2px 10px #20b2aa30" : undefined,
});

// condition label
const condLabel = {
  color: COLORS.primary,
  fontWeight: 600,
  marginRight: 4,
  fontSize: 15,
};

// ===== Session Detail Modal =====
function SessionDetailModal({ session, onClose, onEdit, onDelete }) {
  const boardObj = BOARDS.find((x) => x.value === session.board);
  const moodObj = MOODS.find((x) => x.value === session.mood);
  const windObj = WIND_OPTIONS.find((x) => x.value === session.wind);
  const tideObj = TIDE_OPTIONS.find((x) => x.value === session.tide);
  return (
    <ModalOverlay onClose={onClose}>
      <div
        style={{
          background: "#ecfaff",
          borderRadius: 24,
          padding: "2.3rem 1.6rem 1.5rem 1.6rem",
          minWidth: 310,
          maxWidth: 460,
          minHeight: 340,
          boxShadow: "0 7px 18px #0077be29",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 3,
          }}
        >
          <span
            style={{
              fontSize: 35,
              marginRight: 10,
              textShadow: "0 2px 16px #bad6efaa",
            }}
            aria-label={moodObj.label}
          >
            {moodObj.emoji}
          </span>
          <div>
            <span
              style={{
                fontWeight: 700,
                fontSize: 22,
                color: COLORS.primary,
              }}
            >
              {session.spot}
            </span>
            <div style={{ color: "#0090b2", marginTop: 2, marginBottom: 1 }}>
              <b>
                {session.date} &ndash; {boardObj?.icon} {boardObj?.label}
              </b>
            </div>
          </div>
        </div>
        <div style={{ color: "#166ca4", fontWeight: 700, fontSize: 16 }}>
          {session.waveCount} waves caught
        </div>
        <div style={{ fontSize: 14.7, marginTop: 9, marginBottom: 12 }}>
          <span style={{ fontWeight: 700, color: COLORS.accent }}>
            Swell:{" "}
          </span>
          {session.swell} ft | <b>Wind:</b> {windObj?.icon} {windObj?.label} |{" "}
          <b>Tide:</b> {tideObj?.icon} {tideObj?.label}
        </div>
        <div
          style={{
            background: "#d5faff66",
            borderRadius: 15,
            padding: "7px 15px 7px 10px",
            margin: "15px 0",
            fontStyle: "italic",
            fontSize: 15.7,
            color: COLORS.primary,
            minHeight: 42,
            boxShadow: "0 2px 12px #20b2aa20",
            maxHeight: 75,
            overflowY: "auto",
          }}
        >
          {session.notes || <span style={{ color: "#9ab" }}>&mdash;</span>}
        </div>
        <div style={{ display: "flex", gap: 13, justifyContent: "flex-end" }}>
          <button
            style={detailBtnStyle("#ff7070")}
            onClick={onDelete}
            aria-label="Delete session"
          >
            🗑️ Delete
          </button>
          <button
            style={detailBtnStyle(COLORS.accent)}
            onClick={onEdit}
            aria-label="Edit session"
          >
            ✏️ Edit
          </button>
          <button
            style={detailBtnStyle(COLORS.primary)}
            onClick={onClose}
            aria-label="Close"
          >
            Close
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
const detailBtnStyle = (bgColor) => ({
  background: bgColor,
  color: "#fff",
  fontSize: 15,
  fontWeight: 700,
  borderRadius: 12,
  border: 0,
  padding: "7px 16px",
  cursor: "pointer",
  boxShadow: "0 1px 7px #2271bb29",
  marginLeft: 0,
});

// ===== Stats Dashboard (charts/summary from sample data) =====
function StatsDashboard({ sessions }) {
  // Most visited spot
  const spotCounts = sessions.reduce((map, s) => {
    map[s.spot] = (map[s.spot] || 0) + 1;
    return map;
  }, {});
  const topSpot = Object.entries(spotCounts).sort((a, b) => b[1] - a[1])[0];
  // Board usage
  const boardCounts = sessions.reduce((map, s) => {
    map[s.board] = (map[s.board] || 0) + 1;
    return map;
  }, {});
  // Mood trend
  const moodByDate = sessions
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
  // Board usage percent for chart
  const totalBoards = sessions.length;
  const boardPercents = BOARDS.map((b) => ({
    ...b,
    percent:
      ((boardCounts[b.value] || 0) / (totalBoards || 1)) * 100,
    count: boardCounts[b.value] || 0,
  }));
  return (
    <main
      style={{
        minHeight: 470,
        padding: "2.3rem .5rem 2.2rem .5rem",
        background:
          "linear-gradient(180deg,#d7f3fd 0%, #e9f9ff 70%, #fceabb 100%)",
      }}
    >
      <h2
        style={{
          color: COLORS.primary,
          fontWeight: 900,
          textShadow: "0 2px 14px #77d9fa30",
          letterSpacing: 0.6,
        }}
      >
        Stats Dashboard
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: 32,
          margin: "2.6rem 0 1.7rem 0",
          justifyItems: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 22,
            boxShadow: "0 4px 18px #0077be16",
            padding: "1.6rem 1.1rem",
            minWidth: 200,
            maxWidth: 310,
            minHeight: 92,
          }}
        >
          <div style={{ color: COLORS.primary, fontWeight: 700 }}>
            🏄 Most Surfed Spot
          </div>
          <div style={{ fontSize: 19, marginTop: 8, fontWeight: 600 }}>
            {topSpot ? (
              <>
                <span>{topSpot[0]}</span>
                <span style={{ color: "#139cdb", marginLeft: 16 }}>
                  ({topSpot[1]} sessions)
                </span>
              </>
            ) : (
              <span>No data</span>
            )}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 22,
            boxShadow: "0 4px 18px #0077be16",
            padding: "1.6rem 1.1rem",
            minWidth: 200,
            maxWidth: 310,
            minHeight: 92,
          }}
        >
          <div style={{ color: COLORS.primary, fontWeight: 700 }}>
            🏄‍♂️ Board Usage
          </div>
          <div style={{ marginTop: 7, display: "flex", flexWrap: "wrap", gap: 16 }}>
            {boardPercents.map((b) => (
              <div key={b.value} style={{ fontSize: 18 }}>
                <span>{b.icon}</span>{" "}
                <span style={{ fontWeight: 700, color: COLORS.accent }}>
                  {b.percent.toFixed(0)}%
                </span>{" "}
                <span style={{ fontSize: 13, color: "#777" }}>
                  ({b.count})
                </span>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 22,
            boxShadow: "0 4px 18px #0077be16",
            padding: "1.6rem 1.1rem",
            minWidth: 200,
            maxWidth: 310,
            minHeight: 92,
          }}
        >
          <div style={{ color: COLORS.primary, fontWeight: 700 }}>
            😊 Mood Trend
          </div>
          <div style={{ marginTop: 8, minHeight: 32 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 7 }}>
              {moodByDate.map((s) => {
                const mobj = MOODS.find((m) => m.value === s.mood);
                return (
                  <div
                    key={s.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 22,
                        background: "#e1fcff",
                        borderRadius: "50%",
                        marginBottom: 2,
                        boxShadow: "0 1px 8px #20b2aa15",
                        padding: "2px 7px",
                        color: COLORS.primary,
                      }}
                      aria-label={mobj?.label}
                      title={mobj?.label}
                    >
                      {mobj?.emoji}
                    </span>
                    <span
                      style={{
                        color: COLORS.accent,
                        fontSize: 12,
                        letterSpacing: 0.1,
                      }}
                    >
                      {s.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          color: COLORS.primary,
          opacity: 0.6,
          fontWeight: 500,
          textAlign: "center",
          fontSize: 16,
        }}
      >
        (All stats above based on sample session data)
      </div>
    </main>
  );
}

// ===== Daily Reminder (UI only) =====
function DailyReminderScreen({ lastDate, onGoToLog }) {
  // Show reminder only if "today" (simulate) has no session
  const today = new Date().toISOString().slice(0, 10);
  const noSessionToday = today !== lastDate;
  return (
    <main
      style={{
        minHeight: 320,
        padding: "3.1rem 13px 2.6rem 13px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background:
          "linear-gradient(105deg,#eafcff 60%,#fceabb 100%)",
      }}
    >
      <div
        style={{
          maxWidth: 440,
          background: "#fff",
          color: COLORS.primary,
          borderRadius: 28,
          padding: "2.35rem 1.7rem",
          boxShadow: "0 3px 21px #20b2aa19",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <span
          role="img"
          aria-label="Reminder"
          style={{
            fontSize: 48,
            marginBottom: 10,
            filter: "drop-shadow(0 1px 8px #20b2aa20)",
          }}
        >
          ⏰
        </span>
        <h2
          style={{
            marginTop: 0,
            marginBottom: 10,
            fontWeight: 800,
            fontSize: 28,
            textShadow: "0 2px 6px #b2e5fc22",
          }}
        >
          Daily Surf Log Reminder
        </h2>
        {noSessionToday ? (
          <>
            <div
              style={{
                fontSize: 17.5,
                marginBottom: 17,
                color: "#0090b2",
                fontWeight: 600,
              }}
            >
              You haven&apos;t logged a surf session for today!
            </div>
            <button
              style={{
                background:
                  "linear-gradient(90deg,#20b2aa,#0077be 85%,#fceabb 100%)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 19,
                border: "none",
                borderRadius: 20,
                padding: "12px 33px",
                cursor: "pointer",
                boxShadow: "0 3px 13px #0077be23",
              }}
              onClick={onGoToLog}
            >
              ＋ Log Now
            </button>
          </>
        ) : (
          <div
            style={{
              fontSize: 17.5,
              color: COLORS.accent,
              fontWeight: 600,
              marginTop: 12,
            }}
          >
            You&apos;ve already logged a session today. Great job! 🌊
          </div>
        )}
        <div
          style={{
            fontSize: 15,
            color: "#738090",
            marginTop: 23,
            textAlign: "center",
            opacity: 0.77,
            maxWidth: 350,
          }}
        >
          (This is just a UI info — no real push notifications yet.<br />
          Enable reminders in a future version!)
        </div>
      </div>
    </main>
  );
}

// ===== Main App Component =====
function App() {
  // Surf session state, with initial mock data
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  // UI navigation state
  const [screen, setScreen] = useState("home"); // "home" | "dashboard" | "reminder"
  // Filter state
  const [filters, setFilters] = useState({
    spot: "",
    board: "",
    mood: "",
  });
  // "Modal" state: for logging/editing
  const [modal, setModal] = useState(null); // null | "log" | { edit: session }
  const [detailModal, setDetailModal] = useState(null); // null | session

  // Add new session
  function handleAddSession(newSession) {
    setSessions([
      {
        ...newSession,
        id: Math.max(0, ...sessions.map((s) => s.id)) + 1,
      },
      ...sessions,
    ]);
    setModal(null);
    setScreen("home");
  }

  // Edit existing session
  function handleEditSession(editSession) {
    setSessions(
      sessions.map((s) =>
        s.id === editSession.id ? { ...editSession } : s
      )
    );
    setModal(null);
    setDetailModal(null);
    setScreen("home");
  }

  // Delete session
  function handleDeleteSession(delSession) {
    if (
      window.confirm("Are you sure you want to delete this session?")
    ) {
      setSessions(sessions.filter((s) => s.id !== delSession.id));
      setDetailModal(null);
    }
  }

  // Find the last (most-recent) session date for reminder
  const lastSessionDate =
    sessions.length > 0 ? sessions[0].date : undefined;

  // Main render by "screen"
  return (
    <div
      style={{
        fontFamily:
          'system-ui, "Segoe UI", "Roboto", "Helvetica", Arial, sans-serif',
        background:
          "linear-gradient(0deg,#c2e0fb 5%,#eafcff 60%,#fceabb 100%)",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <Header
        onNav={setScreen}
        activeScreen={screen}
      />
      {/* Ocean background image/gradient */}
      <div
        style={{
          position: "fixed",
          zIndex: 0,
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          background:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80') center/cover fixed",
          opacity: 0.23,
          filter: "blur(1.5px) saturate(1.08) brightness(1.05)",
        }}
        aria-hidden="true"
      />
      <div style={{ position: "relative", zIndex: 2 }}>
        {screen === "home" && (
          <HomeScreen
            sessions={sessions}
            filters={filters}
            setFilters={setFilters}
            onSelectedSession={setDetailModal}
            onOpenNew={() => setModal("log")}
            onDeleteSession={handleDeleteSession}
          />
        )}
        {screen === "dashboard" && (
          <StatsDashboard sessions={sessions} />
        )}
        {screen === "reminder" && (
          <DailyReminderScreen
            lastDate={lastSessionDate}
            onGoToLog={() => setModal("log")}
          />
        )}
      </div>
      {/* Log New Session Modal */}
      {modal && (
        <LogSessionModal
          onSubmit={
            modal === "log"
              ? handleAddSession
              : (form) =>
                  handleEditSession({ ...detailModal, ...form })
          }
          onCancel={() => setModal(null)}
          initial={
            modal !== "log" && detailModal ? { ...detailModal } : undefined
          }
        />
      )}
      {/* Session Detail Modal */}
      {detailModal && (
        <SessionDetailModal
          session={detailModal}
          onClose={() => setDetailModal(null)}
          onEdit={() => setModal("edit")}
          onDelete={() => handleDeleteSession(detailModal)}
        />
      )}
      <footer
        style={{
          background: "#0076be00",
          color: "#086a93",
          fontWeight: 500,
          fontSize: 15,
          textAlign: "center",
          padding: "12px 0 10px 0",
          marginTop: 18,
          opacity: 0.88,
        }}
      >
        SurfSync &copy; 2024 &mdash; Ocean-inspired Surf Log
      </footer>
    </div>
  );
}

export default App;

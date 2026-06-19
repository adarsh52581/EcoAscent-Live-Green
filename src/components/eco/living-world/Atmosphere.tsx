/** Rising smoke columns shown only in the critical scene. */
export function Smoke() {
  return (
    <>
      <style>{`
        @keyframes eco-smoke {
          0% { transform: translate(0,0) scale(1); opacity: 0; }
          20% { opacity: 0.55; }
          100% { transform: translate(60px,-260px) scale(2.2); opacity: 0; }
        }
      `}</style>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${15 + i * 18}%`,
            bottom: "18%",
            width: 80,
            height: 80,
            background: "radial-gradient(circle, rgba(60,40,30,0.7), rgba(60,40,30,0))",
            animation: `eco-smoke ${6 + i}s ease-out ${i * 0.8}s infinite`,
          }}
        />
      ))}
    </>
  );
}

/** Drifting pollen motes shown only in the pristine scene. */
export function Pollen() {
  return (
    <>
      <style>{`
        @keyframes eco-pollen {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(-120vh) translateX(40px); opacity: 0; }
        }
      `}</style>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#FFF6C8]"
          style={{
            left: `${(i * 8.3) % 100}%`,
            bottom: "-5%",
            width: 6,
            height: 6,
            boxShadow: "0 0 10px rgba(255,246,200,0.8)",
            animation: `eco-pollen ${12 + (i % 5) * 3}s linear ${i * 1.2}s infinite`,
          }}
        />
      ))}
    </>
  );
}
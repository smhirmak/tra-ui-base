export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 select-none">
        <img
          src="/assets/logos/tra-ui-kit-white.png"
          alt="TRA Bilişim"
          className="h-64 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <span className="text-white/20 text-5xl tracking-widest uppercase">UI Base</span>
      </div>
    </div>
  );
}

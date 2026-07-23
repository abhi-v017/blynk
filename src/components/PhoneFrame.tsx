export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 300, height: 610 }}>
      <div
        className="absolute inset-0 rounded-[38px] p-2.5"
        style={{
          background: "linear-gradient(160deg, #2a2e34, #101215)",
          boxShadow: "0 20px 60px -20px rgba(0,0,0,0.6), inset 0 0 0 1px #333840",
        }}
      >
        <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-black">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#101215] rounded-b-2xl z-20" />
          <div className="w-full h-full overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}

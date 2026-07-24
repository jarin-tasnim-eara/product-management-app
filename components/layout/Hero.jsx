export default function Hero() {
  return (
    <section className="bg-[#94AC8D] border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <p className="text-xs tracking-[0.25em] uppercase text-[#231d4f]  font-semibold mb-4">
          The full directory
        </p>
        <h1
          style={{ fontFamily: "var(--font-fraunces)" }}
          className="text-4xl md:text-5xl font-semibold italic text-white max-w-2xl mx-auto leading-tight"
        >
          Everything you need, in one aisle.
        </h1>
        <p className="mt-4 text-[#393748] max-w-xl mx-auto">
          Browse our full collection — from electronics to everyday
          essentials — curated by our sellers and updated every day.
        </p>
      </div>
    </section>
  );
}
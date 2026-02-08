 "use client";
import { motion } from "framer-motion";

export function ReservationClient() {
  return (
    <div className="glass rounded-3xl p-6 md:p-10">
      <h1 className="font-display text-3xl font-bold">Reserve a Table</h1>
      <p className="mt-2 opacity-80">UI-only reservation flow for showcase purposes.</p>
      <form className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label>Name</label>
          <input className="rounded-xl px-3 py-2 bg-transparent border border-white/10" placeholder="Your name" />
        </div>
        <div className="flex flex-col gap-2">
          <label>Email</label>
          <input className="rounded-xl px-3 py-2 bg-transparent border border-white/10" placeholder="you@example.com" />
        </div>
        <div className="flex flex-col gap-2">
          <label>Date</label>
          <input type="date" className="rounded-xl px-3 py-2 bg-transparent border border-white/10" />
        </div>
        <div className="flex flex-col gap-2">
          <label>Time</label>
          <input type="time" className="rounded-xl px-3 py-2 bg-transparent border border-white/10" />
        </div>
        <div className="flex flex-col gap-2">
          <label>Party Size</label>
          <select className="rounded-xl px-3 py-2 bg-transparent border border-white/10">
            {[...Array(10)].map((_, i) => <option key={i+1}>{i + 1}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label>Notes</label>
          <textarea className="rounded-xl px-3 py-2 bg-transparent border border-white/10" rows={3} placeholder="Occasion or preferences" />
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="mt-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground md:col-span-2"
        >
          Confirm Reservation (UI only)
        </motion.button>
      </form>
    </div>
  );
}

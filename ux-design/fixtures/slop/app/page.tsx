// FIXTURE: a deliberately generated-looking landing page. Every block is a catalogued tell.
// slop-lint should flag most of it; tests/slop-lint.test.mjs asserts which rules fire.
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, ArrowRight } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";

const inter = Inter({ subsets: ["latin"] });

export default function Page() {
  return (
    <main className={inter.className}>
      <section className="relative flex flex-col items-center text-center py-24 bg-gradient-to-br from-indigo-500 to-purple-600">
        <Spotlight className="-top-40 left-0" />
        <div className="absolute -top-20 left-1/2 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
        <span className="rounded-full border px-3 py-1 text-xs">✨ New: AI-powered workflows</span>
        <p className="text-xs uppercase tracking-widest text-indigo-200">The future of work</p>
        <h1 className="text-6xl font-bold">
          Supercharge your workflow with <span className="italic font-serif text-pink-300">magic</span>
        </h1>
        <p className="mt-4 text-lg">It's not just a tool, it's a revolution in how teams collaborate.</p>
        <div className="mt-8 flex gap-4">
          <button className="rounded-lg bg-indigo-600 px-6 py-3 shadow-lg shadow-indigo-500/50 transition-all outline-none">Get started →</button>
          <button className="rounded-lg border px-6 py-3">Learn more</button>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-6 py-24">
        {[Sparkles, Zap, Shield].map((Icon, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="rounded-2xl border-l-4 border-l-indigo-500 bg-white p-6 shadow-lg backdrop-blur">
            <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-100">
              <Icon className="size-6" />
            </div>
            <h3 className="mt-4 font-semibold">Lightning fast 🚀</h3>
            <p className="text-sm">Seamlessly streamline your entire stack in one all-in-one platform.</p>
          </motion.div>
        ))}
      </section>

      <section className="py-24 backdrop-blur-md">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="backdrop-blur-sm">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">Trusted by thousands</h2>
          <div className="grid grid-cols-3">
            <div><span>10,000+</span><span>teams</span></div>
            <div><span>99.9%</span><span>uptime</span></div>
          </div>
          <span className="text-xs">01</span><span className="text-xs">02</span><span className="text-xs">03</span>
        </motion.div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-3xl rounded-xl border bg-zinc-950 border-white/10 p-4">
          <div className="flex gap-1.5"><span className="size-3 rounded-full bg-red-500" /><span className="size-3 rounded-full bg-yellow-500" /><span className="size-3 rounded-full bg-green-500" /></div>
          <img src="https://i.pravatar.cc/80" />
          <p>“Best tool ever.” John Doe, CEO at Acme Inc</p>
          <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-green-500 animate-ping" />Live</div>
          <div onClick={() => {}} className="animate-bounce">Faster. Smarter. Better.</div>
        </div>
      </section>
    </main>
  );
}

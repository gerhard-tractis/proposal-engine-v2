'use client';

import { motion } from 'framer-motion';
import { Brain, Server, Shield, Package, ShoppingCart, Truck, CheckCircle, Sparkles } from 'lucide-react';

interface WhyUsProps {
  content: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function WhyUs({ content }: WhyUsProps) {
  return (
    <section className="space-y-16">
      {/* Hero Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          Why Choose Us
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Built for Scale.<br />Engineered for Results.
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We combine AI expertise with logistics domain knowledge to deliver systems that actually work.
        </p>
      </motion.div>

      {/* Core Strengths */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-3"
      >
        <motion.div
          variants={item}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="group rounded-xl border-2 border-border bg-gradient-to-br from-card to-card/50 p-8 space-y-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 w-fit group-hover:scale-110 transition-transform duration-300">
              <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-card-foreground">
              AI + Logistics Experts
            </h3>
          </div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3 items-start"><CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" /> <span>Expert AI engineering team</span></li>
            <li className="flex gap-3 items-start"><CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" /> <span>Deep supply chain knowledge</span></li>
            <li className="flex gap-3 items-start"><CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" /> <span>Logistics technology specialists</span></li>
          </ul>
        </motion.div>

        <motion.div
          variants={item}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="group rounded-xl border-2 border-border bg-gradient-to-br from-card to-card/50 p-8 space-y-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 w-fit group-hover:scale-110 transition-transform duration-300">
              <Server className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-card-foreground">
              World-Class Infrastructure
            </h3>
          </div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3 items-start"><CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" /> <span>Production-grade systems</span></li>
            <li className="flex gap-3 items-start"><CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" /> <span>Built to scale from day one</span></li>
            <li className="flex gap-3 items-start"><CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" /> <span>Enterprise-level reliability</span></li>
          </ul>
        </motion.div>

        <motion.div
          variants={item}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="group rounded-xl border-2 border-border bg-gradient-to-br from-card to-card/50 p-8 space-y-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 w-fit group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-card-foreground">
              Security & Privacy
            </h3>
          </div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3 items-start"><CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" /> <span>Strict data isolation</span></li>
            <li className="flex gap-3 items-start"><CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" /> <span>Encrypted storage</span></li>
            <li className="flex gap-3 items-start"><CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" /> <span>Compliance-ready architecture</span></li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Proven Track Record */}
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-2"
        >
          <h3 className="text-3xl font-bold text-foreground">
            Proven Track Record
          </h3>
          <p className="text-muted-foreground">Real solutions for real industries</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-3"
        >
          {/* FMCG/CPG */}
          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-6 space-y-4"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl" />
            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10">
                  <ShoppingCart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="text-lg font-bold text-card-foreground">
                  FMCG/CPG
                </h4>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex gap-2.5"><span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">•</span> <span>Route Optimizer with custom rules</span></li>
                <li className="flex gap-2.5"><span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">•</span> <span>AI Transport Control Tower</span></li>
                <li className="flex gap-2.5"><span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">•</span> <span>Real-time fleet monitoring</span></li>
              </ul>
            </div>
          </motion.div>

          {/* E-commerce */}
          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-6 space-y-4"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl" />
            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-lg font-bold text-card-foreground">
                  E-commerce
                </h4>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex gap-2.5"><span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">•</span> <span>WISMO proactive agents</span></li>
                <li className="flex gap-2.5"><span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">•</span> <span>Automated rescheduling</span></li>
                <li className="flex gap-2.5"><span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">•</span> <span>Reverse logistics triggers</span></li>
              </ul>
            </div>
          </motion.div>

          {/* Last Mile */}
          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-6 space-y-4"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl" />
            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10">
                  <Truck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h4 className="text-lg font-bold text-card-foreground">
                  Last Mile
                </h4>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex gap-2.5"><span className="text-orange-600 dark:text-orange-400 font-bold mt-0.5">•</span> <span>End-to-end operations SaaS</span></li>
                <li className="flex gap-2.5"><span className="text-orange-600 dark:text-orange-400 font-bold mt-0.5">•</span> <span>Real-time BI dashboards</span></li>
                <li className="flex gap-2.5"><span className="text-orange-600 dark:text-orange-400 font-bold mt-0.5">•</span> <span>Beetrack/Simpliroute integration</span></li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Three Pillars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-10 space-y-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative text-center space-y-2">
          <h3 className="text-3xl font-bold text-foreground">
            Our Three Pillars
          </h3>
          <p className="text-muted-foreground">What makes us different</p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-4 border-primary text-primary font-bold text-2xl shadow-lg">
                1
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-card-foreground">Problem Solving</h4>
              <p className="text-sm text-muted-foreground">We focus on delivering measurable business value, not just features.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-4 border-primary text-primary font-bold text-2xl shadow-lg">
                2
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-card-foreground">Rock-Solid Infrastructure</h4>
              <p className="text-sm text-muted-foreground">Production-grade systems built to scale and perform from day one.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-4 border-primary text-primary font-bold text-2xl shadow-lg">
                3
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-card-foreground">Security & Privacy</h4>
              <p className="text-sm text-muted-foreground">Your data is isolated, encrypted, and protected at every layer.</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Closing Statement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center pt-8"
      >
        <p className="text-lg font-medium text-foreground max-w-2xl mx-auto">
          We build systems that work, scale, and deliver ROI.
        </p>
      </motion.div>
    </section>
  );
}

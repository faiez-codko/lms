"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, BookOpen, Users, Zap, LineChart } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Hero from "@/components/animated-shader-hero";
export default function LandingPage() {


  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white overflow-hidden">

      {/* Hero Section */}

      <Hero
        trustBadge={{
          text: "Quantum",
          icons: ["🚀"] // optional
        }}
        headline={{
          line1: "Turn Your Trading",
          line2: "Into A Business."
        }}
        subtitle="The all-in-one platform to master technical analysis, manage risk, and build a profitable trading career. No noise, just results."
        buttons={{
          primary: {
            text: "Start Free Trial",
            href: '/register',
          },
          secondary: {
            text: "Browse Course",
            href: '/browse',
          }
        }}
        className="custom-classes" // optional
        shaderColors={{
          colorAccent: "#FFF",
          colorBackground: "#40230D"
        }}
      />

      {/* Trusted By Strip (Marquee) */}
      <section className="py-10 border-y border-slate-800 bg-slate-950/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest">Trusted by 10,000+ Traders</p>
        </div>
        <div className="flex relative w-full">
          <motion.div
            className="flex gap-12 md:gap-24 items-center whitespace-nowrap"
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-12 md:gap-24">
                {['Coinbase', 'Binance', 'TradingView', 'Bloomberg', 'Forbes', 'CNBC', 'Yahoo Finance', 'Investopedia'].map((brand) => (
                  <span key={brand} className="text-xl md:text-3xl font-bold text-slate-600 hover:text-slate-400 transition-colors cursor-default">{brand}</span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-24 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">What We Do</h2>
            <p className="text-lg text-slate-400">
              We provide a complete ecosystem for traders to learn, grow, and succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Structured Education",
                desc: "Comprehensive courses taking you from beginner to institutional competence."
              },
              {
                icon: Users,
                title: "Live Mentorship",
                desc: "Daily live streams and Q&A sessions with professional traders."
              },
              {
                icon: Zap,
                title: "Real-time Signals",
                desc: "High-probability trade setups and market analysis delivered daily."
              },
              {
                icon: LineChart,
                title: "Advanced Analytics",
                desc: "Proprietary tools to track your performance and journal your trades."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-colors group"
              >
                <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <item.icon className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section 1: Text Left, Image Right */}
      <FeatureSection
        badge="Technical Analysis"
        title="Analyze Markets with Precision"
        description="Stop guessing. Learn to read the raw price action and identify high-probability setups with our proprietary institutional-grade charting strategies."
        points={["Advanced Candlestick Patterns", "Multi-Timeframe Analysis", "Volume Profile & Order Flow"]}
        imageSrc="/media/001.png"
        imageAlt="Technical Analysis Charts"
        reversed={false}
      />

      {/* Feature Section 2: Image Left, Text Right */}
      <FeatureSection
        badge="Risk Management"
        title="Protect Capital like a Hedge Fund"
        description="The difference between gambling and trading is risk management. We provide the calculators, journals, and frameworks to keep your drawdown low and upside high."
        points={["Dynamic Position Sizing", "Portfolio Correlation Matrix", "Automated Stop-Loss Strategies"]}
        imageSrc="/media/002.png"
        imageAlt="Risk Management Dashboard"
        reversed={true}
      />

      {/* Feature Section 3: Text Left, Image Right */}
      <FeatureSection
        badge="Trading Psychology"
        title="Master Your Mindset"
        description="90% of trading is psychology. Learn how to control your emotions, eliminate FOMO, and execute your plan with robotic discipline."
        points={["Daily Mindfulness Routines", "Trade Journaling & Review", "Cognitive Bias Training"]}
        imageSrc="/media/003.png"
        imageAlt="Trading Psychology"
        reversed={false}
      />

      {/* Testimonials */}
      <section className="py-32 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">Don't just take our word for it.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="I went from blowing accounts to funded trader in 3 months. The structure here is unlike anything else on YouTube."
              author="Marcus J."
              role="Funded Trader"
              avatar="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=man%20portrait%20professional&image_size=square"
            />
            <TestimonialCard
              quote="Finally, a community that focuses on process over profits. This is the real deal."
              author="Elena R."
              role="Swing Trader"
              avatar="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=woman%20portrait%20professional&image_size=square"
            />
            <TestimonialCard
              quote="The risk management tools alone saved me thousands during the last crash. Essential for any serious trader."
              author="David K."
              role="Crypto Investor"
              avatar="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=man%20portrait%20casual&image_size=square"
            />
            <TestimonialCard
              quote="The risk management tools alone saved me thousands during the last crash. Essential for any serious trader."
              author="David K."
              role="Crypto Investor"
              avatar="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=man%20portrait%20casual&image_size=square"
            />
            <TestimonialCard
              quote="The risk management tools alone saved me thousands during the last crash. Essential for any serious trader."
              author="David K."
              role="Crypto Investor"
              avatar="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=man%20portrait%20casual&image_size=square"
            />
            <TestimonialCard
              quote="The risk management tools alone saved me thousands during the last crash. Essential for any serious trader."
              author="David K."
              role="Crypto Investor"
              avatar="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=man%20portrait%20casual&image_size=square"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-slate-800">
              <AccordionTrigger className="text-lg hover:text-emerald-400">Is this course suitable for beginners?</AccordionTrigger>
              <AccordionContent className="text-slate-400">
                Absolutely. We start with the basics of market structure and candlestick patterns before moving into advanced strategies. About 40% of our students start with zero experience.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-slate-800">
              <AccordionTrigger className="text-lg hover:text-emerald-400">Do you provide trade signals?</AccordionTrigger>
              <AccordionContent className="text-slate-400">
                No. We teach you how to fish. We provide daily market analysis and setups we are watching, but the goal is to make you an independent trader, not a signal follower.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-slate-800">
              <AccordionTrigger className="text-lg hover:text-emerald-400">What markets do you cover?</AccordionTrigger>
              <AccordionContent className="text-slate-400">
                Our technical analysis concepts apply to all liquid markets including Forex, Crypto, Stocks, and Futures. We have specific modules for the nuances of each asset class.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-slate-800">
              <AccordionTrigger className="text-lg hover:text-emerald-400">Can I cancel my subscription?</AccordionTrigger>
              <AccordionContent className="text-slate-400">
                Yes, you can cancel anytime from your dashboard. You will retain access until the end of your billing period.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Start your profitable journey today.</h2>
          <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
            Join the #1 platform for traders who treat this as a business, not a hobby. 14-day free trial, cancel anytime.
          </p>
          <Link href="/browse">
            <Button size="lg" className="bg-white text-emerald-900 hover:bg-slate-100 h-16 px-12 text-xl rounded-full font-bold shadow-xl">
              Get Started for Free
            </Button>
          </Link>
          <p className="mt-6 text-sm text-emerald-200/60">No credit card required for preview lessons.</p>
        </div>
      </section>

    </div>
  );
}

function FeatureSection({ badge, title, description, points, imageSrc, imageAlt, reversed }: { badge: string, title: string, description: string, points: string[], imageSrc: string, imageAlt: string, reversed: boolean }) {
  return (
    <section className="py-24 md:py-32 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className={`flex flex-col md:flex-row items-center gap-16 ${reversed ? 'md:flex-row-reverse' : ''}`}>
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: reversed ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-8"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-semibold tracking-wide uppercase">
              {badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">{title}</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              {description}
            </p>
            <ul className="space-y-4">
              {points.map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-lg">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full"
          >
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 aspect-video">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ quote, author, role, avatar }: { quote: string, author: string, role: string, avatar: string }) {
  return (
    <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-left hover:border-emerald-500/30 transition-colors duration-300">
      <div className="flex gap-1 text-emerald-500 mb-6">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} className="h-5 w-5 fill-emerald-500" />
        ))}
      </div>
      <p className="text-lg text-slate-300 mb-8 font-medium leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 rounded-full overflow-hidden border border-slate-700">
          <Image src={avatar} alt={author} fill className="object-cover" />
        </div>
        <div>
          <div className="font-bold text-white text-lg">{author}</div>
          <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">{role}</div>
        </div>
      </div>
    </div>
  )
}

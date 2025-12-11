import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, TrendingUp, Shield, Star } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-20 md:py-32 space-y-8 max-w-5xl mx-auto">
        <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 backdrop-blur-xl">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
          New Course: Advanced Options Strategies
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent pb-2">
          Master the Art of <br />
          <span className="text-emerald-500">Profitable Trading</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Join thousands of traders who have transformed their financial future. Learn proven strategies, risk management, and market psychology from industry experts.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/browse">
                <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 text-lg rounded-full">
                    Start Learning Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-12 px-8 text-lg rounded-full">
                View Curriculum
            </Button>
        </div>

        {/* Hero Image / Dashboard Preview */}
        <div className="relative w-full max-w-5xl mt-12 rounded-xl border border-slate-800 bg-slate-950/50 shadow-2xl overflow-hidden aspect-video">
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
             <Image 
                src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=stock%20market%20candlestick%20chart%20dark%20mode%20dashboard%20modern%20ui&image_size=landscape_16_9"
                alt="Trading Dashboard"
                fill
                className="object-cover opacity-80"
             />
             <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex justify-center">
                 <div className="grid grid-cols-3 gap-8 w-full max-w-3xl bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-slate-700">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">15K+</div>
                        <div className="text-sm text-slate-400">Active Students</div>
                    </div>
                    <div className="text-center border-l border-slate-700">
                        <div className="text-2xl font-bold text-emerald-400">4.9/5</div>
                        <div className="text-sm text-slate-400">Course Rating</div>
                    </div>
                    <div className="text-center border-l border-slate-700">
                        <div className="text-2xl font-bold text-white">120+</div>
                        <div className="text-sm text-slate-400">Video Lessons</div>
                    </div>
                 </div>
             </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">Why Choose TradeMastery?</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    We don't just teach you patterns; we teach you how to think like a professional trader.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={BarChart2}
                    title="Technical Analysis"
                    description="Master price action, indicators, and chart patterns to identify high-probability setups."
                />
                <FeatureCard 
                    icon={Shield}
                    title="Risk Management"
                    description="Learn how to protect your capital and manage risk effectively to ensure long-term survival."
                />
                <FeatureCard 
                    icon={TrendingUp}
                    title="Trading Psychology"
                    description="Conquer your emotions and develop the disciplined mindset required for consistent profitability."
                />
            </div>
        </div>
      </div>

      {/* Social Proof / Trust */}
      <div id="testimonials" className="py-20 bg-slate-900">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-12">Trusted by Traders Worldwide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TestimonialCard 
                    quote="This course completely changed my perspective on the markets. I finally stopped blowing accounts and started seeing consistent growth."
                    author="Alex M."
                    role="Forex Trader"
                    avatar="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=man%20portrait%20professional&image_size=square"
                />
                <TestimonialCard 
                    quote="The section on risk management alone is worth 10x the price. Highly recommended for anyone serious about trading."
                    author="Sarah K."
                    role="Crypto Investor"
                    avatar="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=woman%20portrait%20professional&image_size=square"
                />
            </div>
         </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
         <div className="max-w-4xl mx-auto px-4 text-center">
             <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-12 relative overflow-hidden">
                 <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                 <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                 
                 <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
                     Ready to Start Your Trading Journey?
                 </h2>
                 <p className="text-slate-300 mb-8 max-w-xl mx-auto relative z-10">
                     Get unlimited access to all courses, community, and live sessions. Start today and take control of your financial future.
                 </p>
                 <Link href="/browse">
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white h-14 px-8 text-lg rounded-full relative z-10">
                        Join TradeMastery Today
                    </Button>
                 </Link>
             </div>
         </div>
      </div>

    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl hover:border-emerald-500/50 transition-colors group">
            <div className="h-12 w-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <Icon className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-slate-400 leading-relaxed">
                {description}
            </p>
        </div>
    )
}

function TestimonialCard({ quote, author, role, avatar }: { quote: string, author: string, role: string, avatar: string }) {
    return (
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl text-left">
            <div className="flex gap-1 text-emerald-500 mb-4">
                {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 fill-emerald-500" />
                ))}
            </div>
            <p className="text-slate-300 mb-6 italic">"{quote}"</p>
            <div className="flex items-center gap-4">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image src={avatar} alt={author} fill className="object-cover" />
                </div>
                <div>
                    <div className="font-semibold text-white">{author}</div>
                    <div className="text-xs text-slate-500">{role}</div>
                </div>
            </div>
        </div>
    )
}

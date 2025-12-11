"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const instructors = [
  {
    name: "Alex Rivera",
    role: "Senior Blockchain Developer",
    bio: "Alex is a pioneer in the DeFi space with over 8 years of experience building decentralized applications. He specializes in smart contract security and scalability.",
    image: "/instructors/alex.jpg",
    initials: "AR",
    experience: ["Ex-Ethereum Foundation", "DeFi Protocol Architect", "Auditor"]
  },
  {
    name: "Sarah Chen",
    role: "Quantitative Analyst",
    bio: "Sarah brings a wealth of knowledge from Wall Street to the crypto world. She teaches algorithmic trading strategies and market analysis.",
    image: "/instructors/sarah.jpg",
    initials: "SC",
    experience: ["Ex-Goldman Sachs", "Hedge Fund Manager", "Math PhD"]
  },
  {
    name: "James Wilson",
    role: "Full Stack Web3 Engineer",
    bio: "James bridges the gap between Web2 and Web3. He's passionate about building intuitive user interfaces for complex blockchain protocols.",
    image: "/instructors/james.jpg",
    initials: "JW",
    experience: ["Tech Lead @ CryptoStartup", "React Core Contributor", "Hackathon Winner"]
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            About Quantum
          </h1>
          <p className="text-lg md:text-xl text-slate-400">
            Empowering the next generation of blockchain developers and crypto traders through world-class education.
          </p>
        </motion.div>
      </section>

      {/* Mission/Story Section */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-emerald-400">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed">
              At Quantum, we believe that financial freedom and technological innovation should be accessible to everyone. 
              The blockchain revolution is just getting started, and we are here to provide the map and compass for your journey.
            </p>
            <p className="text-slate-300 leading-relaxed">
              We started as a small group of enthusiasts passionate about the potential of decentralized finance. 
              Today, we are a global community of learners, builders, and innovators.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative h-[300px] md:h-[400px] bg-gradient-to-br from-emerald-500/20 to-purple-500/20 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="text-center z-10 p-6">
                <span className="text-6xl mb-4 block">🚀</span>
                <h3 className="text-2xl font-bold text-white">Building the Future</h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Instructors</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Learn from industry veterans who have built protocols, managed funds, and contributed to the core of the blockchain ecosystem.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {instructors.map((instructor, index) => (
              <motion.div key={index} variants={item}>
                <Card className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-colors h-full flex flex-col">
                  <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-emerald-500/20">
                      <AvatarImage src={instructor.image} alt={instructor.name} />
                      <AvatarFallback className="bg-slate-800 text-emerald-400 text-xl font-bold">
                        {instructor.initials}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl text-white">{instructor.name}</CardTitle>
                    <CardDescription className="text-emerald-400 font-medium">
                      {instructor.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col space-y-4">
                    <p className="text-slate-300 text-sm leading-relaxed text-center">
                      {instructor.bio}
                    </p>
                    <div className="mt-auto pt-4 flex flex-wrap gap-2 justify-center">
                      {instructor.experience.map((exp, i) => (
                        <Badge key={i} variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

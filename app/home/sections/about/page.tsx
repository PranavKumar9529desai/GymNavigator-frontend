'use client';
import { m } from 'framer-motion';
import { Heart, Target, Users } from 'lucide-react';
import Navbar from '../Navbar/Navbar';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Revolutionizing Gym Management
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              At GymDominator, we&apos;re passionate about transforming the way
              gyms operate and members experience fitness.
            </p>
          </m.div>

          {/* Values Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Target,
                title: 'Our Mission',
                description:
                  'To provide cutting-edge technology that makes gym management effortless and member experience exceptional.',
              },
              {
                icon: Heart,
                title: 'Our Vision',
                description:
                  'To become the global standard for digital gym management solutions, empowering fitness communities worldwide.',
              },
              {
                icon: Users,
                title: 'Our Values',
                description:
                  'Innovation, reliability, and member-first approach drive everything we do.',
              },
            ].map((item, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400">{item.description}</p>
              </m.div>
            ))}
          </div>
          {/* TODO add the our team here */}
          {/* Team Section */}
          {/* <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Our Leadership Team
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Thompson",
                  role: "Founder & CEO",
                  image: "https://source.unsplash.com/300x300/?portrait,man,1"
                },
                {
                  name: "Sarah Chen",
                  role: "Chief Technology Officer",
                  image: "https://source.unsplash.com/300x300/?portrait,woman,1"
                },
                {
                  name: "Michael Rodriguez",
                  role: "Head of Product",
                  image: "https://source.unsplash.com/300x300/?portrait,man,2"
                }
              ].map((member, index) => (
                <m.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 + 0.8 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-xl mb-4 aspect-square">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                  <p className="text-blue-400">{member.role}</p>
                </m.div>
              ))}
            </div>
          </m.div> */}
        </div>
      </main>
    </>
  );
}

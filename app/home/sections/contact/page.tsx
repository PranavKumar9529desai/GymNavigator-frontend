'use client';
import { m } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import Navbar from '../Navbar/Navbar';

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('Message sent successfully!');
    // Add your form submission logic here
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black pt-20">
        <div className="container mx-auto px-4 py-16">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Have questions about GymDominator? We&apos;re here to help you transform your gym
              management experience.
            </p>
          </m.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <m.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 p-8 rounded-xl border border-gray-700"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-6 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                >
                  <Send className="w-4 h-4 inline-block mr-2" />
                  Send Message
                </button>
                {formStatus && <p className="text-green-400 text-center mt-4">{formStatus}</p>}
              </form>
            </m.div>

            {/* Contact Information */}
            <m.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              {[
                {
                  icon: Phone,
                  title: 'Phone',
                  details: '+1 (555) 123-4567',
                  subtitle: 'Monday to Friday 9am to 6pm',
                },
                {
                  icon: Mail,
                  title: 'Email',
                  details: 'support@gymdominator.com',
                  subtitle: "We'll respond within 24 hours",
                },
                {
                  icon: MapPin,
                  title: 'Office',
                  details: '123 Fitness Street',
                  subtitle: 'San Francisco, CA 94105',
                },
              ].map((item, index) => (
                <div
                  key={index as number}
                  className="flex items-start space-x-4 bg-gray-800/30 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300"
                >
                  <div className="bg-blue-500/10 p-3 rounded-lg">
                    <item.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-blue-400">{item.details}</p>
                    <p className="text-gray-400 text-sm">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </m.div>
          </div>
        </div>
      </main>
    </>
  );
}

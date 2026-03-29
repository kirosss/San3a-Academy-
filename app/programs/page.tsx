'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Calendar, Users, ArrowRight, Search, Filter } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface Program {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  image: string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    const fetchPrograms = async () => {
      const querySnapshot = await getDocs(collection(db, 'programs'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Program));
      
      if (data.length === 0) {
        setPrograms([
          {
            id: '1',
            title: 'Digital Fabrication 101',
            description: 'Learn the basics of 3D printing, laser cutting, and CNC milling.',
            type: 'Hybrid',
            status: 'Open',
            image: 'https://picsum.photos/seed/fab/800/600'
          },
          {
            id: '2',
            title: 'STEM for Educators',
            description: 'A comprehensive guide for teachers to integrate STEM in classrooms.',
            type: 'Virtual',
            status: 'Upcoming',
            image: 'https://picsum.photos/seed/stem/800/600'
          },
          {
            id: '3',
            title: 'Robotics Workshop',
            description: 'Build and program your own robots from scratch.',
            type: 'In-Person',
            status: 'Open',
            image: 'https://picsum.photos/seed/robot/800/600'
          },
          {
            id: '4',
            title: 'Advanced CNC Machining',
            description: 'Master precision machining for industrial applications.',
            type: 'In-Person',
            status: 'Closed',
            image: 'https://picsum.photos/seed/cnc/800/600'
          }
        ]);
      } else {
        setPrograms(data);
      }
    };

    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || p.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="pt-32 pb-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Our Programs</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover hands-on learning experiences designed to develop practical skills and creative confidence.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search programs..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <Filter className="w-4 h-4 text-gray-400" />
              <div className="flex bg-white border border-gray-200 rounded-xl p-1">
                {['All', 'Hybrid', 'Virtual', 'In-Person'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      filterType === type ? 'bg-orange-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-orange-100 transition-all"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-orange-600 uppercase">
                      {program.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">{program.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {program.status}</span>
                      <span className="flex items-center"><Users className="w-3 h-3 mr-1" /> Limited Slots</span>
                    </div>
                    <Link href={`/programs/${program.id}`}>
                      <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredPrograms.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No programs found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

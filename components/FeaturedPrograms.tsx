'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Calendar, Users } from 'lucide-react';
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

export function FeaturedPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      const q = query(collection(db, 'programs'), where('featured', '==', true), limit(3));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Program));
      
      if (data.length === 0) {
        // Fallback mock data if DB is empty
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
          }
        ]);
      } else {
        setPrograms(data);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Featured Programs</h2>
            <p className="text-gray-500 mt-2">Explore our most popular courses and workshops.</p>
          </div>
          <Link href="/programs" className="text-orange-600 font-semibold flex items-center hover:underline">
            View All <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-orange-100 transition-all"
            >
              <div className="relative h-48 w-full overflow-hidden">
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
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

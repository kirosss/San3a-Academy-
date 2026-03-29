'use client';

import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import Image from 'next/image';

const stories = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    role: 'Digital Fabrication Specialist',
    story: 'San3a Academy changed my life. I went from knowing nothing about 3D printing to leading a fabrication lab in just two years.',
    image: 'https://picsum.photos/seed/person1/200/200'
  },
  {
    id: '2',
    name: 'Laila Mahmoud',
    role: 'STEM Educator',
    story: 'The K-12 STEM Lesson Sharing platform is a game-changer for teachers. It has made my classroom so much more interactive.',
    image: 'https://picsum.photos/seed/person2/200/200'
  },
  {
    id: '3',
    name: 'Omar Ali',
    role: 'Robotics Engineer',
    story: 'The hands-on experience I gained at San3a was exactly what I needed to land my dream job in robotics.',
    image: 'https://picsum.photos/seed/person3/200/200'
  }
];

export function AlumniStories() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Alumni Stories</h2>
          <p className="text-gray-500 mt-2">Hear from those who have transformed their careers with us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-8 bg-gray-50 rounded-3xl border border-gray-100 group hover:bg-orange-600 hover:text-white transition-all duration-500"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-orange-200 group-hover:text-orange-400 opacity-50" />
              <div className="relative z-10">
                <p className="text-lg italic leading-relaxed mb-8">&quot;{story.story}&quot;</p>
                <div className="flex items-center">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-white shadow-sm">
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{story.name}</h4>
                    <p className="text-xs opacity-70">{story.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

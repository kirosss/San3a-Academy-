'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  publishedAt: string;
}

export function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'), limit(4));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
      
      if (data.length === 0) {
        setNews([
          {
            id: '1',
            title: 'San3a Academy Launches New STEM Lab',
            content: 'Our new state-of-the-art laboratory is now open for students and researchers.',
            image: 'https://picsum.photos/seed/lab2/800/600',
            publishedAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Alumni Spotlight: Sarah Doe',
            content: 'How Sarah used her fabrication skills to launch a successful startup.',
            image: 'https://picsum.photos/seed/alumni/800/600',
            publishedAt: new Date().toISOString()
          }
        ]);
      } else {
        setNews(data);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">News & Events</h2>
            <p className="text-gray-500 mt-2">Stay updated with our latest initiatives and stories.</p>
          </div>
          <Link href="/news" className="text-orange-600 font-semibold flex items-center hover:underline">
            Read More <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-full sm:w-48 h-48 sm:h-auto">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center text-xs text-gray-400 mb-2">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{item.content}</p>
                </div>
                <Link href={`/news/${item.id}`} className="mt-4 text-orange-600 text-sm font-bold flex items-center hover:underline">
                  Read Article <ArrowRight className="ml-1 w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

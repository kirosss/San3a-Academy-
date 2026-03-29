'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, BookOpen, User, Calendar, CheckCircle, Clock, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  status: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export default function K12Page() {
  const { user, profile, login } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: '', description: '', content: '', tags: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      const q = query(collection(db, 'lessons'), where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
      
      if (data.length === 0) {
        setLessons([
          {
            id: '1',
            title: 'Introduction to 3D Geometry',
            description: 'A hands-on lesson plan for middle school students to explore 3D shapes using Tinkercad.',
            authorId: '1',
            authorName: 'Laila Mahmoud',
            status: 'approved',
            content: '...',
            tags: ['Math', '3D Design', 'Middle School'],
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Building Simple Circuits',
            description: 'Learn how to teach basic electronics using paper circuits and LEDs.',
            authorId: '2',
            authorName: 'Ahmed Hassan',
            status: 'approved',
            content: '...',
            tags: ['Science', 'Electronics', 'Elementary'],
            createdAt: new Date().toISOString()
          }
        ]);
      } else {
        setLessons(data);
      }
      setLoading(false);
    };

    fetchLessons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      login();
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'lessons'), {
        ...newLesson,
        tags: newLesson.tags.split(',').map(t => t.trim()),
        authorId: user.uid,
        authorName: profile?.displayName || 'Anonymous',
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setNewLesson({ title: '', description: '', content: '', tags: '' });
      alert('Lesson submitted for review!');
    } catch (error) {
      console.error('Error submitting lesson:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="pt-32 pb-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">K-12 STEM Lesson Sharing</h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                A community-driven space for educators to share, discover, and discuss lesson plans and educational resources.
              </p>
            </div>
            <Button 
              onClick={() => user ? setIsModalOpen(true) : login()}
              className="mt-6 md:mt-0 bg-orange-600 hover:bg-orange-700 text-white px-6 py-6 rounded-xl shadow-lg shadow-orange-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Post a Lesson
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-12">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search lesson plans..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="flex items-center space-x-2 mb-4">
                  {lesson.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{lesson.title}</h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">{lesson.description}</p>
                
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-3">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-gray-900">{lesson.authorName}</p>
                      <p className="text-gray-400">{new Date(lesson.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Link href={`/k12/${lesson.id}`}>
                    <Button variant="ghost" size="sm" className="text-orange-600">
                      View Plan
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Post Lesson Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Post a New Lesson Plan</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Lesson Title</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. Introduction to 3D Printing"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Short Description</label>
                  <textarea
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 h-24"
                    placeholder="Briefly describe what this lesson covers..."
                    value={newLesson.description}
                    onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. STEM, Math, Middle School"
                    value={newLesson.tags}
                    onChange={(e) => setNewLesson({ ...newLesson, tags: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Lesson Content (Markdown supported)</label>
                  <textarea
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 h-48 font-mono text-sm"
                    placeholder="Provide the full lesson plan details..."
                    value={newLesson.content}
                    onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={submitting} className="bg-orange-600 hover:bg-orange-700 text-white px-8">
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit for Review'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

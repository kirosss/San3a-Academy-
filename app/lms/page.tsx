'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle, Clock, Play, FileText, Download, Lock, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  progress: number;
  modules: Module[];
}

interface Module {
  id: string;
  title: string;
  lessons: LMSLesson[];
}

interface LMSLesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'task';
  completed: boolean;
}

export default function LMSPage() {
  const { user, profile, login } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchCourses = async () => {
      // In a real app, we'd query courses the user is enrolled in
      // For now, we'll show a mock list if they are a 'learner' or 'admin'
      if (profile?.role === 'learner' || profile?.role === 'admin' || profile?.role === 'member') {
        setCourses([
          {
            id: '1',
            title: 'Digital Fabrication 101',
            description: 'Master the basics of 3D printing and laser cutting.',
            image: 'https://picsum.photos/seed/fab/800/600',
            progress: 35,
            modules: [
              {
                id: 'm1',
                title: 'Module 1: Introduction',
                lessons: [
                  { id: 'l1', title: 'Welcome to the Course', type: 'video', completed: true },
                  { id: 'l2', title: 'Safety in the Lab', type: 'text', completed: true },
                  { id: 'l3', title: 'Quiz: Lab Safety', type: 'task', completed: false }
                ]
              },
              {
                id: 'm2',
                title: 'Module 2: 3D Design',
                lessons: [
                  { id: 'l4', title: 'Introduction to Tinkercad', type: 'video', completed: false },
                  { id: 'l5', title: 'Creating your first model', type: 'task', completed: false }
                ]
              }
            ]
          }
        ]);
      }
      setLoading(false);
    };

    fetchCourses();
  }, [user, profile]);

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-40 pb-20 max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-xl max-w-md mx-auto">
            <Lock className="w-16 h-16 mx-auto mb-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-500 mb-8">Please sign in to access your courses and learning materials.</p>
            <Button onClick={login} className="w-full bg-orange-600 hover:bg-orange-700">Sign In Now</Button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="pt-32 pb-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">My Courses</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Continue your learning journey and track your progress across all enrolled programs.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {courses.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <BookOpen className="w-16 h-16 mx-auto mb-6 text-gray-200" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Courses Found</h2>
              <p className="text-gray-500 mb-8">You are not currently enrolled in any programs.</p>
              <Link href="/programs">
                <Button className="bg-orange-600 hover:bg-orange-700">Explore Programs</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl">
                  <div className="flex flex-col lg:flex-row">
                    <div className="relative w-full lg:w-1/3 h-64 lg:h-auto">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-8 lg:w-2/3">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h2>
                          <p className="text-gray-500">{course.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-orange-600 mb-1">{course.progress}% Complete</p>
                          <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-orange-600 transition-all duration-500" 
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {course.modules.map((module) => (
                          <div key={module.id} className="border border-gray-100 rounded-2xl p-6 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                              <ChevronRight className="w-5 h-5 mr-2 text-orange-600" />
                              {module.title}
                            </h3>
                            <div className="space-y-3">
                              {module.lessons.map((lesson) => (
                                <div key={lesson.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 group hover:border-orange-200 transition-all">
                                  <div className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                                      lesson.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                      {lesson.type === 'video' && <Play className="w-4 h-4" />}
                                      {lesson.type === 'text' && <FileText className="w-4 h-4" />}
                                      {lesson.type === 'task' && <Download className="w-4 h-4" />}
                                    </div>
                                    <div>
                                      <p className="font-bold text-sm text-gray-900">{lesson.title}</p>
                                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">{lesson.type}</p>
                                    </div>
                                  </div>
                                  {lesson.completed ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <Button size="sm" variant="ghost" className="text-orange-600 group-hover:bg-orange-50">
                                      Start
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

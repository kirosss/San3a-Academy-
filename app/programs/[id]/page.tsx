'use client';

import { useEffect, useState, use } from 'react';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { Calendar, Users, Clock, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Program {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  image: string;
  longDescription?: string;
}

export default function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, profile, login } = useAuth();
  const router = useRouter();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchProgram = async () => {
      const docRef = doc(db, 'programs', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProgram({ id: docSnap.id, ...docSnap.data() } as Program);
      } else {
        // Fallback mock
        setProgram({
          id,
          title: 'Digital Fabrication 101',
          description: 'Learn the basics of 3D printing, laser cutting, and CNC milling.',
          longDescription: 'This course is designed for beginners who want to explore the world of digital fabrication. You will learn how to use various machines and software to bring your ideas to life. The program covers 3D design, file preparation, and hands-on machine operation.',
          type: 'Hybrid',
          status: 'Open',
          image: 'https://picsum.photos/seed/fab/1200/600'
        });
      }

      if (user) {
        const q = query(collection(db, 'applications'), where('userId', '==', user.uid), where('programId', '==', id));
        const querySnapshot = await getDocs(q);
        setHasApplied(!querySnapshot.empty);
      }

      setLoading(false);
    };

    fetchProgram();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      login();
      return;
    }

    setApplying(true);
    try {
      await addDoc(collection(db, 'applications'), {
        userId: user.uid,
        programId: id,
        status: 'submitted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        formData: {
          name: profile?.displayName,
          email: profile?.email
        }
      });
      setHasApplied(true);
      router.push('/profile');
    } catch (error) {
      console.error('Error applying:', error);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!program) return null;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/programs" className="inline-flex items-center text-sm text-gray-500 hover:text-orange-600 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Programs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative h-96 w-full rounded-3xl overflow-hidden mb-12 shadow-2xl"
            >
              <Image
                src={program.image}
                alt={program.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{program.title}</h1>
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2 text-orange-500" />
                <span>{program.type}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                <span>Status: {program.status}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2 text-orange-500" />
                <span>Limited Enrollment</span>
              </div>
            </div>

            <div className="prose prose-orange max-w-none text-gray-600 leading-relaxed">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Program</h2>
              <p className="mb-6">{program.longDescription || program.description}</p>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">What you will learn</h3>
              <ul className="space-y-3 mb-8">
                {[
                  'Introduction to Digital Fabrication tools',
                  'Safety protocols and machine maintenance',
                  '2D and 3D design software proficiency',
                  'Project management and documentation',
                  'Collaborative problem-solving in a lab environment'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Join the Program</h3>
              <div className="space-y-6 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Application Fee</span>
                  <span className="font-bold text-gray-900">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-bold text-gray-900">8 Weeks</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Commitment</span>
                  <span className="font-bold text-gray-900">10 hrs/week</span>
                </div>
              </div>

              {hasApplied ? (
                <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-green-700 text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold">Application Submitted!</p>
                  <p className="text-xs mt-1">Check your profile for updates.</p>
                  <Link href="/profile">
                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">View Dashboard</Button>
                  </Link>
                </div>
              ) : (
                <Button
                  onClick={handleApply}
                  disabled={applying || program.status !== 'Open'}
                  className="w-full py-6 text-lg bg-orange-600 hover:bg-orange-700 rounded-xl shadow-lg shadow-orange-200"
                >
                  {applying ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : program.status === 'Open' ? (
                    'Apply Now'
                  ) : (
                    'Applications Closed'
                  )}
                </Button>
              )}
              
              <p className="text-xs text-gray-400 text-center mt-4">
                By applying, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { User, Mail, Calendar, Shield, Clock, CheckCircle, AlertCircle, Loader2, BookOpen, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Application {
  id: string;
  programId: string;
  status: string;
  createdAt: string;
  programTitle?: string;
}

export default function ProfilePage() {
  const { user, profile, loading: authLoading, login } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      const q = query(collection(db, 'applications'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
      
      // Fetch program titles
      const appsWithTitles = await Promise.all(apps.map(async (app) => {
        const programDoc = await getDoc(doc(db, 'programs', app.programId));
        return { ...app, programTitle: programDoc.exists() ? programDoc.data().title : 'Unknown Program' };
      }));

      setApplications(appsWithTitles);
      setLoading(false);
    };

    fetchApplications();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-40 pb-20 max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-xl max-w-md mx-auto">
            <User className="w-16 h-16 mx-auto mb-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
            <p className="text-gray-500 mb-8">Please sign in to view your profile and applications.</p>
            <Button onClick={login} className="w-full bg-orange-600 hover:bg-orange-700">Sign In Now</Button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="pt-32 pb-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-orange-100 shadow-xl">
              <Image
                src={profile?.photoURL || 'https://picsum.photos/seed/user/200/200'}
                alt={profile?.displayName || 'User'}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">{profile?.displayName}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                <span className="flex items-center"><Mail className="w-4 h-4 mr-2 text-orange-500" /> {profile?.email}</span>
                <span className="flex items-center"><Shield className="w-4 h-4 mr-2 text-orange-500" /> Role: {profile?.role}</span>
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-orange-500" /> Joined {new Date(profile?.createdAt || '').toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" className="rounded-xl"><Settings className="w-4 h-4 mr-2" /> Edit Profile</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <BookOpen className="w-6 h-6 mr-3 text-orange-600" />
                  My Applications
                </h2>
                
                {applications.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 mb-6">You haven&apos;t applied to any programs yet.</p>
                    <Link href="/programs">
                      <Button className="bg-orange-600 hover:bg-orange-700">Explore Programs</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-all">
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{app.programTitle}</h3>
                          <p className="text-xs text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> Applied on {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mr-4 ${
                            app.status === 'accepted' ? 'bg-green-100 text-green-600' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-600' :
                            'bg-orange-100 text-orange-600'
                          }`}>
                            {app.status}
                          </span>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-orange-600">Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Learning Progress</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">Digital Fabrication 101</span>
                      <span className="font-bold text-orange-600">35%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-600" style={{ width: '35%' }} />
                    </div>
                  </div>
                  <Link href="/lms">
                    <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">Go to LMS</Button>
                  </Link>
                </div>
              </div>

              <div className="bg-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-200">
                <h2 className="text-xl font-bold mb-4">Need Help?</h2>
                <p className="text-orange-100 text-sm mb-6 leading-relaxed">
                  Our support team is here to help you with any questions about your applications or learning journey.
                </p>
                <Button variant="secondary" className="w-full bg-white text-orange-600 hover:bg-orange-50">Contact Support</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

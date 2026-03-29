'use client';

import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { FeaturedPrograms } from '@/components/FeaturedPrograms';
import { NewsSection } from '@/components/NewsSection';
import { AlumniStories } from '@/components/AlumniStories';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedPrograms />
      <NewsSection />
      <AlumniStories />
      <Footer />
    </main>
  );
}

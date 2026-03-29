'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white tracking-tighter mb-6 block">
              San3a Academy
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Bridging the gap between education and human potential by delivering inclusive, hands-on, and technology-enabled learning experiences.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/programs" className="hover:text-orange-500 transition-colors">Programs</Link></li>
              <li><Link href="/k12" className="hover:text-orange-500 transition-colors">K-12 STEM Sharing</Link></li>
              <li><Link href="/news" className="hover:text-orange-500 transition-colors">News & Events</Link></li>
              <li><Link href="/alumni" className="hover:text-orange-500 transition-colors">Alumni Stories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center"><Mail className="w-4 h-4 mr-3 text-orange-500" /> info@san3a.academy</li>
              <li className="flex items-center"><Phone className="w-4 h-4 mr-3 text-orange-500" /> +20 123 456 789</li>
              <li className="flex items-center"><MapPin className="w-4 h-4 mr-3 text-orange-500" /> Cairo, Egypt</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Follow Us</h4>
            <div className="flex space-x-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} San3a Academy. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

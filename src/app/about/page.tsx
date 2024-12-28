'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import {
  Globe2,
  Users,
  Heart,
  Shield,
} from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

const stats = [
  {
    label: 'Years of Experience',
    value: '10+',
  },
  {
    label: 'Happy Travelers',
    value: '50K+',
  },
  {
    label: 'Destinations',
    value: '100+',
  },
  {
    label: 'Local Partners',
    value: '200+',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Passion',
    description:
      'We are passionate about travel and committed to providing exceptional experiences.',
  },
  {
    icon: Shield,
    title: 'Trust',
    description:
      'Your safety and satisfaction are our top priorities. We maintain the highest standards.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'We believe in building lasting relationships with our travelers and partners.',
  },
  {
    icon: Globe2,
    title: 'Sustainability',
    description:
      'We are committed to responsible tourism and environmental conservation.',
  },
];

const team = [
  {
    name: 'John Smith',
    role: 'CEO & Founder',
    image: '/images/team/john-smith.jpg',
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Operations',
    image: '/images/team/sarah-johnson.jpg',
  },
  {
    name: 'Michael Chen',
    role: 'Lead Travel Expert',
    image: '/images/team/michael-chen.jpg',
  },
  {
    name: 'Emily Brown',
    role: 'Customer Experience Manager',
    image: '/images/team/emily-brown.jpg',
  },
];

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container py-10">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to make travel accessible, enjoyable, and
            unforgettable for everyone.
          </p>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 bg-card rounded-lg border"
              >
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <div className="space-y-4">
                <p>
                  Founded in 2014, we started with a simple idea: to make travel
                  more accessible and enjoyable for everyone. What began as a small
                  team of passionate travelers has grown into a trusted travel
                  company serving thousands of happy customers worldwide.
                </p>
                <p>
                  Our journey has been marked by continuous innovation,
                  unwavering commitment to customer satisfaction, and a deep
                  respect for the cultures and environments we explore. We've
                  built strong relationships with local partners across the globe,
                  enabling us to offer authentic and immersive travel experiences.
                </p>
                <p>
                  Today, we're proud to be one of the leading travel companies,
                  known for our exceptional service, attention to detail, and
                  commitment to responsible tourism.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              <OptimizedImage
                src="/images/about/story.jpg"
                alt="Our journey"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                objectFit="cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="p-6 bg-card rounded-lg border text-center"
                >
                  <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-card rounded-lg border overflow-hidden"
              >
                <div className="aspect-[4/3] relative">
                  <OptimizedImage
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-card rounded-lg border p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of happy travelers who have experienced our exceptional
            service.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <a href="/contact">Contact Us</a>
            </Button>
            <Button asChild>
              <a href="/tours">Browse Tours</a>
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
} 
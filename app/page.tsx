'use client';
import { Container } from '@/components/landing/Container';
import { Hero } from '@/components/landing/Hero';
import { SectionTitle } from '@/components/landing/SectionTitle';
import { Benefits } from '@/components/landing/Benefits';
import { Video } from '@/components/landing/Video';
import { Testimonials } from '@/components/landing/Testimonials';
import { Faq } from '@/components/landing/Faq';
import { Cta } from '@/components/landing/Cta';

import { benefitOne, benefitTwo } from '@/components/landing/data';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { USER_ROLE } from '@/constant/authorProtect';
export default function Home() {
  const { sessionClaims } = useAuth();

  useEffect(() => {
    interface Metadata {
      role?: string;
    }

    const metadata = sessionClaims?.metadata as Metadata;

    if (metadata?.role) {
      const role = metadata.role.toUpperCase() as USER_ROLE;
      // Check if the user has the required role
      if (role === USER_ROLE.ADMIN || role === USER_ROLE.STAFF) {
        // Redirect to home page if the user does not have the required role
        window.location.href = '/admin';
      }
    }
  }, [sessionClaims]);
  return (
    <Container>
      <Hero />
      <SectionTitle
        preTitle="Nextly Benefits"
        title=" Empower Kids to Learn English Smarter"
      >
                Snap a photo and let AI help children learn English vocabulary in a fun and effective way.

      </SectionTitle>

      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />

      <SectionTitle
        preTitle="Watch a video"
        title="Discover the Cambridge English Journey with SnapLearn"
      >
        Watch how SnapLearn helps children learn English vocabulary aligned with Cambridge YLE standards — 
      through fun, AI-powered interactions and real-world context.
      </SectionTitle>

      <Video videoId="LjcCOzsrzEY" />

      <SectionTitle
        preTitle="Testimonials"
        title="What people are saying about SnapLearn"
      >
        Trusted by families and educators to help children improve their English
        vocabulary through fun and interactive learning.
      </SectionTitle>

      <Testimonials />

      <SectionTitle preTitle="FAQ" title="Frequently Asked Questions">
        Answer your customers possible questions here, it will increase the
        conversion rate as well as support or chat requests.
      </SectionTitle>

      {/* <Faq /> */}
      <Cta />
    </Container>
  );
}

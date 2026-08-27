'use client';
import { useState, useCallback } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';

export default function PageClient() {
  const [isHeroComplete, setIsHeroComplete] = useState(false);
  const handleHeroComplete = useCallback(() => setIsHeroComplete(true), []);

  return (
    <>
      <Navbar show={isHeroComplete} />
      <Hero onComplete={handleHeroComplete} />
    </>
  );
}

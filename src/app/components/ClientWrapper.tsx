"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const VoiceAgent = dynamic(() => import('./VoiceAgent'), {
  ssr: false,
});

export default function ClientWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <VoiceAgent />;
} 
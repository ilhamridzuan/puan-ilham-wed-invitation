'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type PhotoboothContextType = {
  senderName: string;
  setSenderName: (name: string) => void;
  frameId: string;
  setFrameId: (id: string) => void;
  photos: string[];
  setPhotos: (photos: string[]) => void;
  filterId: string;
  setFilterId: (id: string) => void;
  filterCss: string;
  setFilterCss: (css: string) => void;
  finalImageUrl: string | null;
  setFinalImageUrl: (url: string | null) => void;
  message: string;
  setMessage: (msg: string) => void;
  reset: () => void;
};

const PhotoboothContext = createContext<PhotoboothContextType | undefined>(undefined);

export function PhotoboothProvider({ children }: { children: ReactNode }) {
  const [senderName, setSenderName] = useState('');
  const [frameId, setFrameId] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [filterId, setFilterId] = useState('original');
  const [filterCss, setFilterCss] = useState('none');
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const reset = () => {
    setSenderName('');
    setFrameId('');
    setPhotos([]);
    setFilterId('original');
    setFilterCss('none');
    setFinalImageUrl(null);
    setMessage('');
  };

  return (
    <PhotoboothContext.Provider
      value={{
        senderName,
        setSenderName,
        frameId,
        setFrameId,
        photos,
        setPhotos,
        filterId,
        setFilterId,
        filterCss,
        setFilterCss,
        finalImageUrl,
        setFinalImageUrl,
        message,
        setMessage,
        reset,
      }}
    >
      {children}
    </PhotoboothContext.Provider>
  );
}

export function usePhotobooth() {
  const context = useContext(PhotoboothContext);
  if (context === undefined) {
    throw new Error('usePhotobooth must be used within a PhotoboothProvider');
  }
  return context;
}

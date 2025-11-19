'use client';

import { useState, useEffect } from 'react';

interface LocalDateProps {
  dateString: string;
  options: Intl.DateTimeFormatOptions;
}

const LocalDate = ({ dateString, options }: LocalDateProps) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Render a placeholder on the server and during initial client render
    return <span>...</span>; 
  }

  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat('id-ID', options).format(date);

  return <span>{formattedDate}</span>;
};

export default LocalDate;

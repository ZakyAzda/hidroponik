'use client';

import { useState, useEffect } from 'react';

interface FormattedPriceProps {
  price: string | number;
}

const FormattedPrice = ({ price }: FormattedPriceProps) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Render a placeholder on the server and during initial client render
    return <span>Rp...</span>; 
  }

  const formattedPrice = new Intl.NumberFormat('id-ID').format(Number(price));

  return <span>Rp {formattedPrice}</span>;
};

export default FormattedPrice;

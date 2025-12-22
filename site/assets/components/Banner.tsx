// AdsterraBanner.tsx
import React, { useState, useEffect } from 'react';

type BannerProps = {
  desktopAdUrl: string; // Adsterra iframe URL for desktop
  mobileAdUrl?: string; // Optional iframe URL for mobile
};

export default function BannerOld({ desktopAdUrl, mobileAdUrl }: BannerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  if (isMobile && mobileAdUrl) {
    return (
      <div
        style={{
          width: '100%',
          maxWidth: 320,
          height: 50,
          margin: '1rem auto',
          textAlign: 'center',
        }}
        className="mobile-banner"
      >
        <iframe
          src={mobileAdUrl}
          width="320"
          height="50"
          frameBorder="0"
          scrolling="no"
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: 728,
        height: 90,
        margin: '1rem auto',
        textAlign: 'center',
      }}
      className="desktop-banner"
    >
      <iframe
        src={desktopAdUrl}
        width="728"
        height="90"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
}

export const Banner = () => {
    return (
        <iframe
            src="//www.effectivegatecpm.com/zjdb6vesjh?key=c2606c7cecd85597ddfc0430c61464cd"
            width="728"
            height="90"
            frameBorder="0"
            scrolling="no"
        />
    )
}
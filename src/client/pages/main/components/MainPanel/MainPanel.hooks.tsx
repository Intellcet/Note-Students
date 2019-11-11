import { useState } from 'react';

export function useCurrentPosition() {
  const [position, setPosition] = useState<Position['coords'] | null>(null);

  window.navigator.geolocation.getCurrentPosition(position => {
    setPosition(position.coords);
  });

  return position;
}

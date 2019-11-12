import React, { useState } from 'react';

import { useCurrentPosition } from './MainPanel.hooks';

import styles from './MainPanel.module.pcss';

const MainPanel = (): React.ReactElement => {
  // const position = useCurrentPosition();
  const [position, setPosition] = useState<Position['coords'] | null>(null);

  const handleGetPositionButtonClick = () => {
    window.navigator.geolocation.getCurrentPosition(position =>
      setPosition(position.coords)
    );
  };

  return (
    <div className={styles.mainPanelContainer}>
      <button onClick={handleGetPositionButtonClick}>
        Получить текущую позицию
      </button>
      {position && (
        <React.Fragment>
          <p>Широта: {position.latitude}</p>
          <p>Долгота: {position.longitude}</p>
          <p>Высота: {position.altitude}</p>
          <p>Точность: {position.accuracy}</p>
          <p>Точность Высоты: {position.altitudeAccuracy}</p>
        </React.Fragment>
      )}
    </div>
  );
};

export default MainPanel;

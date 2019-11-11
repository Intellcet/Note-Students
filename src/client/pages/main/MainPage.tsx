import React from 'react';

import { Socket } from '../../components/Socket';
import Header from './components/Header';
import Chat from './components/Chat';
import MainPanel from './components/MainPanel';

const MainPage = (): React.ReactElement => (
  <div>
    <Socket>
      <Header />
      <Chat />
      <MainPanel />
    </Socket>
  </div>
);

export default MainPage;

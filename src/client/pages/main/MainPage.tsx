import React from 'react';

import { Socket } from '../../components/Socket';
import Header from './components/Header';
import Chat from './components/Chat';

const MainPage = (): React.ReactElement => (
  <div>
    <Socket>
      <Header />
      <Chat />
    </Socket>
  </div>
);

export default MainPage;

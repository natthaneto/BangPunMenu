import React from 'react';
import { IonIcon } from '@ionic/react';
import { home, chatbubbles, pencil, person } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import './BottomTabs.css';

const BottomTabs: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  // ปิดการแสดงผลในหน้าเขียนโพสต์เพื่อให้พิมพ์ง่ายขึ้น [cite: 28]
  const hiddenPaths = ['/create-recipe', '/create-feed'];
  if (hiddenPaths.includes(location.pathname)) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="global-bottom-tabs">
      <div className="tabs-container">
        <IonIcon
          icon={home}
          className={isActive('/home') ? 'tab-btn active' : 'tab-btn'}
          onClick={() => history.push('/home')}
        />
        <IonIcon
          icon={chatbubbles}
          className={isActive('/feed') ? 'tab-btn active' : 'tab-btn'}
          onClick={() => history.push('/feed')}
        />
        <IonIcon
          icon={pencil}
          className={(isActive('/post')) ? 'tab-btn active' : 'tab-btn'}
          onClick={() => history.push('/post')}
        />
        <IonIcon
          icon={person}
          className={isActive('/profile') ? 'tab-btn active' : 'tab-btn'}
          onClick={() => history.push('/profile')}
        />
      </div>
    </div>
  );
};

export default BottomTabs;
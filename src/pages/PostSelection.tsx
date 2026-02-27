import React from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { restaurantOutline, chatbubbleEllipsesOutline } from 'ionicons/icons';
import BottomTabs from '../components/BottomTabs';
import './PostSelection.css';

const PostSelection: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      {/* Header สีเขียวพร้อมปุ่มย้อนกลับตามดีไซน์ */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="post-selection-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="" color="light" />
          </IonButtons>
          <IonTitle>โพสต์</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="post-selection-wrapper">
          
          {/* ส่วนเลือกโพสต์เมนูอาหาร */}
          <div className="selection-card" onClick={() => history.push('/create-recipe')}>
            <div className="icon-circle green-gradient">
              <img src="/assets/icon-food.png" alt="Food Icon" className="selection-svg" />
            </div>
            <p className="selection-text">โพสต์เมนูอาหาร</p>
          </div>

          {/* ส่วนเลือกโพสต์ฟีด */}
          <div className="selection-card" onClick={() => history.push('/create-feed')}>
            <div className="icon-circle green-gradient">
              <img src="/assets/icon-chat.png" alt="Feed Icon" className="selection-svg" />
            </div>
            <p className="selection-text">โพสต์ฟีด</p>
          </div>

        </div>
      </IonContent>

      
    </IonPage>
  );
};

export default PostSelection;
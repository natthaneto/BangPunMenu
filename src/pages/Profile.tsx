import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonAvatar,
  IonLoading,
  IonNote,    // ตรวจสอบว่ามีตัวนี้ด้วย
  IonToggle   // เพิ่ม IonToggle เข้าไปตรงนี้ครับ!
} from '@ionic/react';
import { personOutline, notificationsOutline, logOutOutline, moonOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './Profile.css';

const Profile: React.FC = () => {
  const history = useHistory();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // ติดตามสถานะการ Login
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // ดึงข้อมูลจาก Firestore โดยใช้ User ID (UID)
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        history.replace('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [history]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      history.replace('/login');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <IonLoading isOpen={true} message="กำลังโหลดข้อมูล..." />;

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="profile-header-toolbar">
          <IonTitle>โปรไฟล์</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="profile-header-section">
          <IonAvatar className="user-large-avatar">
            {/* ถ้ามีรูปใน Firebase ให้แสดงรูปนั้น ถ้าไม่มีให้ใช้รูป Default */}
            <img src={userData?.profileImage || "https://ionicframework.com/docs/img/demos/avatar.svg"} alt="User" />
          </IonAvatar>
          <div className="user-info-text">
            {/* แสดงชื่อจริงจาก Firestore */}
            <h2>{userData?.name || "ไม่ระบุชื่อ"}</h2>
            <p>{userData?.email}</p>
          </div>
        </div>

        <IonList lines="full" className="profile-menu-list">
          <IonItem button detail={true} className="profile-item" onClick={() => history.push('/edit-profile')}>
            <IonIcon icon={personOutline} slot="start" />
            <IonLabel>โปรไฟล์ของฉัน</IonLabel>
          </IonItem>

          <IonItem className="profile-item">
            <IonIcon icon={moonOutline} slot="start" />
            <IonLabel>โหมดมืด</IonLabel>
            <IonToggle slot="end" checked={isDarkMode} onIonChange={() => {
              document.body.classList.toggle('ion-palette-dark');
              setIsDarkMode(!isDarkMode);
            }} />
          </IonItem>

          <IonItem button onClick={handleLogout} className="logout-item">
            <IonIcon icon={logOutOutline} slot="start" color="danger" />
            <IonLabel color="danger">ออกจากระบบ</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
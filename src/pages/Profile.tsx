import React, { useState, useEffect } from 'react';
import {
  IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonList, IonItem, 
  IonLabel, IonIcon, IonAvatar, IonLoading, IonToggle, IonButtons, IonButton
} from '@ionic/react';
import { personOutline, logOutOutline, moonOutline, chevronForwardOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom'; // เพิ่ม useLocation
import { auth, db } from '../firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './Profile.css';

const Profile: React.FC = () => {
  const history = useHistory();
  const location = useLocation(); // ใช้เพื่อตรวจจับเมื่อกลับมาหน้านี้จะให้โหลดข้อมูลใหม่
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ฟังก์ชันดึงข้อมูลผู้ใช้
  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        history.replace('/login');
      }
    });
    return () => unsubscribe();
  }, [history, location]); // เมื่อ location เปลี่ยน (กลับมาจากหน้า Edit) จะรันซ้ำ

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
        <IonToolbar>
          <IonTitle>โปรไฟล์</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* ส่วน Header แสดงข้อมูลผู้ใช้ */}
        <div className="profile-header-section">
          <IonAvatar className="user-large-avatar">
            {/* ดึงรูปจาก Firestore ถ้าไม่มีใช้รูป Default */}
            <img 
              src={userData?.profileImage || "https://ionicframework.com/docs/img/demos/avatar.svg"} 
              alt="User Profile" 
              onError={(e: any) => { e.target.src = "https://ionicframework.com/docs/img/demos/avatar.svg" }}
            />
          </IonAvatar>
          <div className="user-info-text">
            <h2>{userData?.name || "กำลังโหลด..."}</h2>
            <p>{userData?.email || auth.currentUser?.email}</p>
          </div>
        </div>

        {/* รายการเมนูตั้งค่า */}
        <IonList lines="full" className="profile-menu-list">
          
          <IonItem button detail={false} className="profile-item" onClick={() => history.push('/edit-profile')}>
            <IonIcon icon={personOutline} slot="start" />
            <IonLabel>แก้ไขโปรไฟล์</IonLabel>
            <IonIcon icon={chevronForwardOutline} slot="end" color="medium" />
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
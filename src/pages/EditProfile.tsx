import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
  IonAvatar, IonIcon, IonList, IonItem, IonInput, IonButton, IonLoading, IonToast,
  IonTitle
} from '@ionic/react';
import { pencilSharp } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { auth, db, storage } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './EditProfile.css';

const EditProfile: React.FC = () => {
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State สำหรับเก็บข้อมูล
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string>('https://ionicframework.com/docs/img/demos/avatar.svg');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // 1. ดึงข้อมูลเดิมจาก Firebase มาแสดงตอนโหลดหน้า
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || '');
          setEmail(data.email || '');
          setProfileImage(data.profileImage || 'https://ionicframework.com/docs/img/demos/avatar.svg');
        }
      }
    };
    fetchUserData();
  }, []);

  // 2. จัดการเปลี่ยนรูปภาพ (Preview ในเครื่อง)
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // 3. ฟังก์ชันบันทึกข้อมูลลง Firebase
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      let finalImageUrl = profileImage;

      // ถ้ามีการเลือกรูปใหม่ (ตรวจสอบจาก file input)
      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        const storageRef = ref(storage, `profiles/${user.uid}`);
        await uploadBytes(storageRef, file);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      // อัปเดตข้อมูลลง Firestore
      await updateDoc(doc(db, "users", user.uid), {
        name: name,
        profileImage: finalImageUrl,
        updatedAt: new Date()
      });

      setLoading(false);
      setToastMsg("อัปเดตโปรไฟล์สำเร็จ!");
      setTimeout(() => history.push('/profile'), 1500);
    } catch (error: any) {
      setLoading(false);
      setToastMsg("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile" text="" color="dark" />
          </IonButtons>
          <IonTitle>แก้ไขโปรไฟล์</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="edit-profile-header">
          <div className="avatar-wrapper" onClick={() => fileInputRef.current?.click()}>
            <IonAvatar className="large-avatar">
              <img src={profileImage} alt="Profile" />
            </IonAvatar>
            <div className="edit-icon-badge">
              <IonIcon icon={pencilSharp} />
            </div>
          </div>
          <div className="header-text">
            <h2>{name || 'Loading...'}</h2>
            <p>{email}</p>
          </div>
          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
        </div>

        <IonList lines="full" className="edit-form-list">
          <IonItem className="edit-item">
            <div className="item-content">
              <span className="label">ชื่อ</span>
              <IonInput 
                value={name} 
                className="input-field" 
                onIonInput={(e) => setName(e.detail.value!)} 
                style={{ textAlign: 'right' }}
              />
            </div>
          </IonItem>

          <IonItem className="edit-item">
            <div className="item-content">
              <span className="label">รหัสผ่าน</span>
              <IonInput type="password" value="********" className="input-field" readonly style={{ textAlign: 'right' }} />
            </div>
          </IonItem>
        </IonList>

        <div className="button-container">
          <IonButton expand="block" className="confirm-button" onClick={handleSave}>
            ยืนยันการเปลี่ยนแปลง
          </IonButton>
        </div>

        <IonLoading isOpen={loading} message={"กำลังบันทึกข้อมูล..."} />
        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={2000} onDidDismiss={() => setToastMsg('')} />
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
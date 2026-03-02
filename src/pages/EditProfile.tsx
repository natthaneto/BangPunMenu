import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
  IonAvatar, IonIcon, IonList, IonItem, IonInput, IonButton, IonLoading, IonToast,
  IonTitle
} from '@ionic/react';
import { pencilSharp } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { auth, db, storage } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'; // เพิ่ม setDoc
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './EditProfile.css';

const EditProfile: React.FC = () => {
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string>('https://ionicframework.com/docs/img/demos/avatar.svg');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        // ดึงข้อมูลจาก Database "bangpunmenu" ตามที่คุณ Config ไว้
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || '');
          setEmail(user.email || ''); // ใช้อีเมลจาก Auth ชัวร์กว่า
          setProfileImage(data.profileImage || 'https://ionicframework.com/docs/img/demos/avatar.svg');
        } else {
            // ถ้ายังไม่มี Document ใน Firestore ให้ใช้อีเมลจาก Auth ไปแสดงก่อน
            setEmail(user.email || '');
        }
      }
    };
    fetchUserData();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // ทำ Preview
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
        setToastMsg("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
        return;
    }

    setLoading(true);
    try {
      let finalImageUrl = profileImage;

      // --- จุดสำคัญ: การอัปโหลดรูปภาพ ---
      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        
        // สร้างชื่อไฟล์ให้ Unique เพื่อป้องกัน Browser จำ Cache รูปเก่า
        const fileName = `profile_${user.uid}_${Date.now()}`;
        const storageRef = ref(storage, `profiles/${fileName}`);
        
        // อัปโหลด
        const snapshot = await uploadBytes(storageRef, file);
        // รับ URL จริงจาก Firebase Storage
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      // --- บันทึกลง Firestore ---
      const userRef = doc(db, "users", user.uid);
      
      // ใช้ setDoc แบบ merge: true เพื่อให้มัน "สร้างใหม่" หรือ "อัปเดต" ก็ได้ ไม่พังแน่นอน
      await setDoc(userRef, {
        name: name,
        profileImage: finalImageUrl,
        updatedAt: new Date()
      }, { merge: true });

      setLoading(false);
      setToastMsg("อัปเดตโปรไฟล์สำเร็จ!");
      
      // รอให้ Toast แสดงแป๊บหนึ่งแล้วค่อยกลับ
      setTimeout(() => history.goBack(), 1500); 
    } catch (error: any) {
      console.error("Error saving profile:", error);
      setLoading(false);
      setToastMsg("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  return (
    <IonPage>
      {/* ส่วน UI เหมือนเดิมของคุณเลยครับ (ถูกต้องแล้ว) */}
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
          {/* Input file แบบซ่อน */}
          <input 
            type="file" 
            ref={fileInputRef} 
            hidden 
            accept="image/*" 
            onChange={handleImageChange} 
          />
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
          {/* ส่วนรหัสผ่าน ใส่ไว้เท่ๆ เพราะแก้ตรงนี้ไม่ได้ (ต้องแก้ผ่าน Auth) */}
          <IonItem className="edit-item">
            <div className="item-content">
              <span className="label">อีเมล</span>
              <IonInput value={email} className="input-field" readonly style={{ textAlign: 'right' }} />
            </div>
          </IonItem>
        </IonList>

        <div className="button-container">
          <IonButton expand="block" className="confirm-button" onClick={handleSave}>
            ยืนยันการเปลี่ยนแปลง
          </IonButton>
        </div>

        <IonLoading isOpen={loading} message={"กำลังบันทึกข้อมูล..."} />
        <IonToast 
          isOpen={!!toastMsg} 
          message={toastMsg} 
          duration={2000} 
          onDidDismiss={() => setToastMsg('')} 
        />
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
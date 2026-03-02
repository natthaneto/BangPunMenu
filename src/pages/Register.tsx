import React, { useState } from 'react';
import {
  IonContent, IonPage, IonItem, IonInput, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonLabel, IonLoading, IonToast
} from '@ionic/react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import './Login.css';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const history = useHistory();

  const handleRegister = async () => {
    // 1. บังคับกรอกข้อมูล
    if (!name.trim() || !email.trim() || !password.trim()) {
      setToastMsg("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    if (password.length < 6) {
      setToastMsg("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);
    try {
      // 2. สร้าง User ใน Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. อัปเดต Profile (เพื่อให้ displayName ไม่เป็นค่าว่าง)
      await updateProfile(user, {
        displayName: name
      });

      // 4. บันทึกข้อมูลลง Firestore คอลเลกชัน users
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        avatar: "https://ionicframework.com/docs/img/demos/avatar.svg",
        createdAt: serverTimestamp() // ใช้ serverTimestamp จะแม่นยำกว่าครับ
      });

      setLoading(false);
      setToastMsg("สมัครสมาชิกสำเร็จ!");
      
      // 5. เด้งไปหน้า Login (หรือหน้า Home ก็ได้)
      setTimeout(() => {
        history.push('/login'); // เปลี่ยนเป็น /home ได้ถ้าต้องการให้เข้าแอปเลย
      }, 1500);

    } catch (error: any) {
      setLoading(false);
      // แปลข้อความ Error พื้นฐาน
      if (error.code === 'auth/email-already-in-use') {
        setToastMsg("อีเมลนี้ถูกใช้งานไปแล้ว");
      } else {
        setToastMsg("เกิดข้อผิดพลาด: " + error.message);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="create-recipe-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" color="light" text="" />
          </IonButtons>
          <IonTitle>สมัครสมาชิก</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="login-container" style={{ marginTop: '20px' }}>
          <div className="login-header">
            <h1>BangPunMenu</h1>
            <p>ร่วมแบ่งปันสูตรอาหารกับเรา</p>
          </div>
          
          <div className="form-group" style={{ marginTop: '30px' }}>
            <IonItem lines="none" className="custom-input-item">
              <IonLabel position="stacked">ชื่อผู้ใช้งาน <span style={{color:'red'}}>*</span></IonLabel>
              <IonInput 
                placeholder="กรอกชื่อของคุณ"
                value={name}
                onIonInput={(e) => setName(e.detail.value!)} 
              />
            </IonItem>

            <IonItem lines="none" className="custom-input-item">
              <IonLabel position="stacked">อีเมล <span style={{color:'red'}}>*</span></IonLabel>
              <IonInput 
                type="email" 
                placeholder="example@gmail.com"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)} 
              />
            </IonItem>

            <IonItem lines="none" className="custom-input-item">
              <IonLabel position="stacked">รหัสผ่าน <span style={{color:'red'}}>*</span></IonLabel>
              <IonInput 
                type="password" 
                placeholder="6 ตัวขึ้นไป"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)} 
              />
            </IonItem>
          </div>

          <IonButton expand="block" onClick={handleRegister} className="main-btn" style={{ marginTop: '40px' }}>
            ยืนยันการสมัคร
          </IonButton>
          
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
            มีบัญชีอยู่แล้ว? <a href="/login" style={{ color: '#688049', fontWeight: 'bold' }}>เข้าสู่ระบบ</a>
          </p>
        </div>

        <IonLoading isOpen={loading} message="กำลังสร้างบัญชี..." />
        <IonToast 
          isOpen={!!toastMsg} 
          message={toastMsg} 
          duration={2000} 
          onDidDismiss={() => setToastMsg('')} 
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
import React, { useState } from 'react';
import {
  IonContent, IonPage, IonItem, IonInput, IonButton, IonText, IonLoading, IonToast
} from '@ionic/react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    setShowLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLoading(false);
      history.push('/home');
    } catch (error: any) {
      setShowLoading(false);
      setErrorMsg("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding ion-text-center">
        <div style={{ marginTop: '80px', marginBottom: '40px' }}>
          <h1 style={{ color: '#688049', fontWeight: 'bold' }}>BangPunMenu</h1>
          <p>เข้าสู่ระบบเพื่อแบ่งปันเมนูอาหาร</p>
        </div>

        <IonItem lines="none" className="ion-margin-bottom">
          <IonInput
            label="Email" labelPlacement="stacked" fill="outline"
            type="email" placeholder="example@gmail.com"
            onIonInput={(e) => setEmail(e.detail.value!)}
          />
        </IonItem>

        <IonItem lines="none" className="ion-margin-bottom">
          <IonInput
            label="Password" labelPlacement="stacked" fill="outline"
            type="password" placeholder="********"
            onIonInput={(e) => setPassword(e.detail.value!)}
          />
        </IonItem>

        <IonButton expand="block" onClick={handleLogin} style={{ '--background': '#688049' }}>
          เข้าสู่ระบบ
        </IonButton>

        <IonText color="medium" onClick={() => history.push('/register')} style={{ cursor: 'pointer', display: 'block', marginTop: '20px' }}>
          <p>ยังไม่มีบัญชี? <span style={{ color: '#1e88e5' }}>สมัครสมาชิกที่นี่</span></p>
        </IonText>

        <IonLoading isOpen={showLoading} message={'กำลังเข้าสู่ระบบ...'} />
        <IonToast isOpen={!!errorMsg} message={errorMsg} duration={2000} onDidDismiss={() => setErrorMsg('')} color="danger" />
      </IonContent>
    </IonPage>
  );
};

export default Login;
import React, { useState } from 'react';
import {
  IonContent, IonPage, IonItem, IonInput, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton
} from '@ionic/react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const history = useHistory();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: new Date()
      });

      alert("สมัครสมาชิกสำเร็จ!");
      history.push('/home');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/login" /></IonButtons>
          <IonTitle>สมัครสมาชิก</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem lines="none" className="ion-margin-bottom">
          <IonInput label="Username" labelPlacement="stacked" fill="outline" onIonInput={(e) => setName(e.detail.value!)} />
        </IonItem>
        <IonItem lines="none" className="ion-margin-bottom">
          <IonInput label="Email" labelPlacement="stacked" fill="outline" type="email" onIonInput={(e) => setEmail(e.detail.value!)} />
        </IonItem>
        <IonItem lines="none" className="ion-margin-bottom">
          <IonInput label="Password" labelPlacement="stacked" fill="outline" type="password" onIonInput={(e) => setPassword(e.detail.value!)} />
        </IonItem>
        <IonButton expand="block" onClick={handleRegister} style={{ '--background': '#688049' }}>ยืนยันการสมัคร</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Register;
import React, { useState, useRef } from 'react';
import {
  IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonLoading, IonToast, IonIcon
} from '@ionic/react';
import { imageOutline, cameraOutline } from 'ionicons/icons';
import { auth, db, storage } from '../firebaseConfig'; // เพิ่ม storage
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // เพิ่มฟังก์ชัน storage
import { useHistory } from 'react-router-dom';
import './CreateRecipe.css'; 

const CreateFeed: React.FC = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  // --- ส่วนที่เพิ่มสำหรับรูปภาพ ---
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const history = useHistory();

  // ฟังก์ชันเลือกรูป
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // สร้าง Preview ให้ผู้ใช้เห็น
    }
  };

  const handlePostFeed = async () => {
    const user = auth.currentUser;
    if (!user) {
      setToastMsg("กรุณาเข้าสู่ระบบก่อนโพสต์");
      return;
    }

    if (!title.trim()) {
      setToastMsg("กรุณาใส่หัวข้อที่ต้องการคุย");
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = "/assets/2771401.png"; // ค่าเริ่มต้นถ้าไม่เลือกรูป

      // --- 1. อัปโหลดรูปภาพไปยัง Firebase Storage ---
      if (selectedImage) {
        const imageRef = ref(storage, `feeds/${Date.now()}_${selectedImage.name}`);
        const uploadResult = await uploadBytes(imageRef, selectedImage);
        finalImageUrl = await getDownloadURL(uploadResult.ref);
      }

      // --- 2. บันทึกข้อมูลลง Firestore ---
      const authorDisplayName = user.displayName || user.email?.split('@')[0] || "สมาชิก";

      await addDoc(collection(db, "feeds"), {
        title: title.trim(),
        desc: desc.trim(),
        img: finalImageUrl, // ใช้ URL จริงจาก Storage
        userName: authorDisplayName,
        userEmail: user.email,
        userAvatar: user.photoURL || "https://ionicframework.com/docs/img/demos/avatar.svg",
        userId: user.uid,
        comments: 0,
        createdAt: serverTimestamp()
      });

      setLoading(false);
      setToastMsg("โพสต์ฟีดสำเร็จ!");
      setTimeout(() => history.push('/home'), 1500);
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      setToastMsg("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="create-recipe-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/home" color="light" /></IonButtons>
          <IonTitle>เขียนโพสต์ใหม่</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* ส่วนแสดงพรีวิวและปุ่มเลือกรูป */}
        <div className="image-upload-box" onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer', border: '2px dashed #ccc', borderRadius: '15px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: '20px' }}>
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ textAlign: 'center', color: '#666' }}>
              <IonIcon icon={cameraOutline} style={{ fontSize: '48px' }} />
              <p>แตะเพื่อเลือกรูปภาพ</p>
            </div>
          )}
        </div>

        {/* Hidden Input สำหรับเลือกไฟล์ */}
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleImageSelect} 
        />

        <IonItem lines="none" className="custom-input-item">
          <IonLabel position="stacked">หัวข้อโพสต์ <span style={{color:'red'}}>*</span></IonLabel>
          <IonInput 
            placeholder="คุณคิดอะไรอยู่..." 
            value={title}
            onIonInput={(e) => setTitle(e.detail.value!)} 
          />
        </IonItem>

        <IonItem lines="none" className="custom-input-item">
          <IonLabel position="stacked">รายละเอียด (เรื่องเล่าของคุณ)</IonLabel>
          <IonTextarea 
            placeholder="เล่ารายละเอียดเพิ่มเติมที่นี่..." 
            value={desc}
            onIonInput={(e) => setDesc(e.detail.value!)} 
            rows={8} 
          />
        </IonItem>

        <IonButton expand="block" onClick={handlePostFeed} className="post-btn" style={{ marginTop: '20px' }}>
          โพสต์ลงหน้าฟีด
        </IonButton>
        
        <IonLoading isOpen={loading} message="กำลังอัปโหลดรูปและโพสต์..." />
        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={2000} onDidDismiss={() => setToastMsg('')} />
      </IonContent>
    </IonPage>
  );
};

export default CreateFeed;
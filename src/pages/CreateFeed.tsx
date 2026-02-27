import React, { useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButton, 
  IonItem, 
  IonInput, 
  IonTextarea, 
  IonLoading, 
  IonButtons, 
  IonBackButton,
  IonIcon,
  IonLabel
} from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';
import { auth, db, storage } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useHistory } from 'react-router-dom';
import './CreateFeed.css'; // *** ตรวจสอบชื่อไฟล์ CSS ให้ตรงกันนะครับ ***

const CreateFeed: React.FC = () => {
  const [title, setTitle] = useState(''); // เพิ่ม State สำหรับหัวข้อ
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handlePost = async () => {
    const user = auth.currentUser;
    if (!user || !imageFile || !title) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");

    setLoading(true);
    try {
      const fileRef = ref(storage, `feeds/${user.uid}_${Date.now()}`);
      await uploadBytes(fileRef, imageFile);
      const imageUrl = await getDownloadURL(fileRef);

      await addDoc(collection(db, "feeds"), {
        userId: user.uid,
        userName: user.displayName || "Natthanet",
        title: title, // บันทึกหัวข้อ
        caption: caption,
        imageUrl: imageUrl,
        createdAt: serverTimestamp()
      });

      setLoading(false);
      history.push('/feed');
    } catch (e) {
      console.error(e);
      setLoading(false);
      alert("เกิดข้อผิดพลาดในการโพสต์");
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="create-feed-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/feed" color="light" />
          </IonButtons>
          <IonTitle>สร้างโพสต์ใหม่</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="create-feed-container">
          
          {/* ส่วนอัปโหลดรูปภาพ */}
          <div className="image-upload-box" onClick={() => document.getElementById('file-input')?.click()}>
            {preview ? (
              <img src={preview} alt="Preview" className="feed-preview-img" />
            ) : (
              <div className="upload-placeholder">
                <IonIcon icon={cameraOutline} />
                <p>คลิกเพื่อเพิ่มรูปภาพ</p>
              </div>
            )}
            <input 
              id="file-input"
              type="file" 
              accept="image/*" 
              hidden 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setPreview(URL.createObjectURL(file));
                }
              }} 
            />
          </div>

          <div className="form-group">
            <IonItem lines="none" className="custom-input-item">
              <IonLabel position="stacked">หัวข้อโพสต์</IonLabel>
              <IonInput 
                placeholder="ระบุหัวข้อที่น่าสนใจ" 
                value={title}
                onIonInput={(e) => setTitle(e.detail.value!)} 
              />
            </IonItem>

            <IonItem lines="none" className="custom-input-item">
              <IonLabel position="stacked">คำบรรยาย</IonLabel>
              <IonTextarea 
                placeholder="เขียนอะไรบางอย่างเกี่ยวกับมื้อนี้..." 
                rows={4}
                value={caption}
                onIonInput={(e) => setCaption(e.detail.value!)} 
              />
            </IonItem>
          </div>

          <IonButton expand="block" className="post-btn" onClick={handlePost} disabled={loading}>
            แชร์โพสต์เลย
          </IonButton>
        </div>

        <IonLoading isOpen={loading} message="กำลังอัปโหลดโพสต์..." />
      </IonContent>
    </IonPage>
  );
};

export default CreateFeed;
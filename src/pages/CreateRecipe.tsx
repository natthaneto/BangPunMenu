import React, { useState, useRef } from 'react';
import {
  IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton,
  IonLoading, IonToast, IonIcon
} from '@ionic/react';
import { cameraOutline, restaurantOutline } from 'ionicons/icons';
import { auth, db, storage } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useHistory } from 'react-router-dom';
import './CreateRecipe.css';

const CreateRecipe: React.FC = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const history = useHistory();

  // 1. ฟังก์ชันเลือกรูปภาพและแสดงตัวอย่าง (Preview)
  const handleImagePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. ฟังก์ชันส่งข้อมูลสูตรอาหาร
  const handleSendRecipe = async () => {
    const user = auth.currentUser;

    if (!user) {
      setToastMsg("กรุณาเข้าสู่ระบบก่อนลงสูตรอาหาร");
      return;
    }

    // ตรวจสอบความครบถ้วนของข้อมูล
    if (!name.trim() || !category || !ingredients.trim() || !steps.trim()) {
      setToastMsg("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน");
      return;
    }

    setLoading(true);
    try {
      // รูปภาพเริ่มต้นกรณีไม่ได้เลือกรูป
      let finalImageUrl = "https://images.unsplash.com/photo-1495195129352-aec325a55b65?auto=format&fit=crop&q=80&w=500"; 

      // --- ขั้นตอนที่ 1: อัปโหลดรูปภาพไปยัง Firebase Storage (ถ้ามีการเลือกรูป) ---
      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        // ตั้งชื่อไฟล์ให้ไม่ซ้ำโดยใช้เวลาปัจจุบันและ UID
        const fileName = `recipes/${Date.now()}_${user.uid}`;
        const storageRef = ref(storage, fileName);
        
        const snapshot = await uploadBytes(storageRef, file);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      // --- ขั้นตอนที่ 2: บันทึกข้อมูลลงใน Firestore (Database: bangpunmenu) ---
      // ใช้ (db as any) เพื่อให้มั่นใจว่าคำสั่งทำงานได้กับ Database ID ที่ไม่ใช่ default
      const recipesCollection = collection(db as any, "recipes");

      await addDoc(recipesCollection, {
        name: name.trim(),
        category: category,
        ingredients: ingredients.trim(),
        steps: steps.trim(),
        imageUrl: finalImageUrl,
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || "เชฟปันเมนู",
        authorEmail: user.email,
        createdAt: serverTimestamp()
      });

      setLoading(false);
      setToastMsg("ลงสูตรอาหารสำเร็จ!");
      
      // หน่วงเวลาเล็กน้อยเพื่อให้ Toast แสดงผลแล้วค่อยเปลี่ยนหน้า
      setTimeout(() => {
        history.push('/home'); // หรือหน้าที่มีเมนูอาหาร
      }, 1500);

    } catch (error: any) {
      console.error("Error adding recipe: ", error);
      setLoading(false);
      setToastMsg("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>เพิ่มสูตรอาหาร</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* ส่วนอัปโหลดรูปภาพ */}
        <div 
          className="image-upload-container" 
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%',
            height: '220px',
            backgroundColor: '#f5f5f5',
            borderRadius: '16px',
            border: '2px dashed #ddd',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
        >
          {previewImage ? (
            <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ textAlign: 'center', color: '#999' }}>
              <IonIcon icon={cameraOutline} style={{ fontSize: '50px' }} />
              <p style={{ marginTop: '10px' }}>แตะเพื่อเพิ่มรูปภาพเมนูอร่อย</p>
            </div>
          )}
          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImagePick} />
        </div>

        {/* ฟอร์มกรอกข้อมูล */}
        <div className="input-form-wrapper">
          <IonItem lines="none" className="recipe-input-item">
            <IonLabel position="stacked">ชื่อเมนูอาหาร <span style={{color:'red'}}>*</span></IonLabel>
            <IonInput 
              placeholder="เช่น ข้าวมันไก่" 
              value={name} 
              onIonInput={(e) => setName(e.detail.value!)} 
            />
          </IonItem>

          <IonItem lines="none" className="recipe-input-item">
            <IonLabel position="stacked">หมวดหมู่ <span style={{color:'red'}}>*</span></IonLabel>
            <IonSelect 
              placeholder="เลือกหมวดหมู่" 
              value={category} 
              onIonChange={(e) => setCategory(e.detail.value)}
            >
              <IonSelectOption value="thai">อาหารไทย</IonSelectOption>
              <IonSelectOption value="esarn">อาหารอีสาน</IonSelectOption>
              <IonSelectOption value="halal">อาหารฮาลาล</IonSelectOption>
              <IonSelectOption value="national">อาหารต่างชาติ</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem lines="none" className="recipe-input-item">
            <IonLabel position="stacked">วัตถุดิบ <span style={{color:'red'}}>*</span></IonLabel>
            <IonTextarea 
              placeholder="ระบุรายการวัตถุดิบและสัดส่วน..." 
              value={ingredients} 
              onIonInput={(e) => setIngredients(e.detail.value!)} 
              rows={4}
            />
          </IonItem>

          <IonItem lines="none" className="recipe-input-item">
            <IonLabel position="stacked">ขั้นตอนการทำ <span style={{color:'red'}}>*</span></IonLabel>
            <IonTextarea 
              placeholder="อธิบายขั้นตอนการทำ 1, 2, 3..." 
              value={steps} 
              onIonInput={(e) => setSteps(e.detail.value!)} 
              rows={6}
            />
          </IonItem>
        </div>

        <div style={{ padding: '15px 0' }}>
          <IonButton 
            expand="block" 
            onClick={handleSendRecipe} 
            style={{ '--background': '#ff6b6b', '--border-radius': '12px', height: '50px' }}
          >
            <IonIcon icon={restaurantOutline} slot="start" />
            ลงสูตรอาหารเลย!
          </IonButton>
        </div>

        <IonLoading isOpen={loading} message={"กำลังส่งสูตรอาหาร..."} />
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

export default CreateRecipe;
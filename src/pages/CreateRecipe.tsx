import React, { useState, useRef } from 'react';
import { 
  IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonTitle, IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton,
  IonIcon, IonLoading, IonToast, IonItem, IonLabel
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { cameraOutline } from 'ionicons/icons';
import { auth, db, storage } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './CreateRecipe.css'; // *** ตรวจสอบชื่อไฟล์ให้ตรงกัน ***

const CreateRecipe: React.FC = () => {
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State สำหรับข้อมูลเมนู
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSendRecipe = async () => {
    const user = auth.currentUser;
    if (!user) return alert("กรุณาเข้าสู่ระบบก่อนโพสต์");
    if (!name || !imageFile) return alert("กรุณาระบุชื่อเมนูและใส่รูปภาพ");

    setLoading(true);
    try {
      const storageRef = ref(storage, `recipes/${Date.now()}_${user.uid}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "recipes"), {
        name,
        description,
        category,
        ingredients,
        steps,
        imageUrl,
        authorId: user.uid,
        authorName: user.displayName || "Natthanet",
        createdAt: serverTimestamp()
      });

      setLoading(false);
      setToastMsg("ลงสูตรอาหารสำเร็จแล้ว!");
      setTimeout(() => history.push('/recipes'), 1500);
    } catch (error: any) {
      setLoading(false);
      setToastMsg("Error: " + error.message);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="create-recipe-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/recipes" color="light" />
          </IonButtons>
          <IonTitle>โพสต์สูตรอาหาร</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="create-recipe-container">
          
          {/* ส่วนอัปโหลดรูปภาพสไตล์เดียวกับหน้าฟีด */}
          <div className="image-upload-box" onClick={() => fileInputRef.current?.click()}>
            {selectedImage ? (
              <img src={selectedImage} alt="Preview" className="recipe-preview-img" />
            ) : (
              <div className="upload-placeholder">
                <IonIcon icon={cameraOutline} />
                <p>คลิกเพื่อเพิ่มรูปภาพเมนู</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="form-group">
            <IonItem lines="none" className="custom-input-item">
              <IonLabel position="stacked">ชื่อเมนู</IonLabel>
              <IonInput placeholder="ระบุชื่อเมนู" onIonInput={e => setName(e.detail.value!)} />
            </IonItem>

            <IonItem lines="none" className="custom-input-item">
              <IonLabel position="stacked">ประเภทอาหาร</IonLabel>
              <IonSelect placeholder="เลือกประเภท" onIonChange={e => setCategory(e.detail.value)} interface="popover">
                <IonSelectOption value="esarn">อาหารอีสาน</IonSelectOption>
                <IonSelectOption value="thai">อาหารไทย</IonSelectOption>
                <IonSelectOption value="halal">อาหารฮาลาล</IonSelectOption>
                <IonSelectOption value="national">อาหารต่างชาติ</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem lines="none" className="custom-input-item">
              <IonLabel position="stacked">วัตถุดิบ</IonLabel>
              <IonTextarea placeholder="ระบุวัตถุดิบและปริมาณ..." onIonInput={e => setIngredients(e.detail.value!)} rows={3} />
            </IonItem>

            <IonItem lines="none" className="custom-input-item">
              <IonLabel position="stacked">ขั้นตอนการทำ</IonLabel>
              <IonTextarea placeholder="บอกวิธีการทำเป็นข้อๆ..." onIonInput={e => setSteps(e.detail.value!)} rows={4} />
            </IonItem>
          </div>

          <IonButton expand="block" className="post-btn" onClick={handleSendRecipe}>
            ส่งเมนูอาหาร
          </IonButton>
        </div>

        <IonLoading isOpen={loading} message="กำลังบันทึกข้อมูล..." />
        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={2000} onDidDismiss={() => setToastMsg('')} />
      </IonContent>
    </IonPage>
  );
};

export default CreateRecipe;
import React, { useState, useEffect } from 'react';
import {
  IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
  IonTitle, IonSearchbar, IonSegment, IonSegmentButton, IonLabel, IonList,
  IonItem, IonThumbnail, IonLoading
} from '@ionic/react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import './RecipeList.css';

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลเมนูอาหารทั้งหมด เรียงจากใหม่ไปเก่า
    const q = query(collection(db, "recipes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="recipe-list-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="" color="light" />
          </IonButtons>
          <IonTitle className="recipe-list-title">สูตรเมนูอาหาร</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="search-container">
          <IonSearchbar placeholder="ค้นหาเมนูอาหาร" className="custom-searchbar"></IonSearchbar>
        </div>

        <IonSegment scrollable={true} value="all" className="category-segment">
          <IonSegmentButton value="all"><IonLabel>ทั้งหมด</IonLabel></IonSegmentButton>
          <IonSegmentButton value="esarn"><IonLabel>อาหารอีสาน</IonLabel></IonSegmentButton>
          <IonSegmentButton value="thai"><IonLabel>อาหารไทย</IonLabel></IonSegmentButton>
          <IonSegmentButton value="halal"><IonLabel>อาหารฮาลาล</IonLabel></IonSegmentButton>
          <IonSegmentButton value="national"><IonLabel>อาหารต่างชาติ</IonLabel></IonSegmentButton>
        </IonSegment>

        <IonLoading isOpen={loading} message="กำลังโหลดสูตรอาหาร..." />

        <IonList className="recipe-main-list">
          {recipes.map((item) => (
            <IonItem key={item.id} lines="full" className="recipe-list-item" button>
              <IonThumbnail slot="start" className="recipe-thumb">
                <img src={item.imageUrl} alt={item.name} />
              </IonThumbnail>
              <IonLabel className="recipe-info">
                <h2 className="recipe-name">{item.name}</h2>
                <p className="recipe-author">โดย {item.authorName}</p>
                <p className="recipe-views">ประเภท: {item.category}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default RecipeList;
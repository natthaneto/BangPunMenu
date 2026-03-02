import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent, IonPage, IonIcon, IonGrid, IonRow, IonCol, IonList, IonItem,
  IonLabel, IonThumbnail, IonLoading
} from '@ionic/react';
import { restaurantOutline, chatbubbleEllipsesOutline } from 'ionicons/icons';
import { db, auth } from '../firebaseConfig';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ ดึงชื่อ Username (ถ้าไม่มีให้เอาชื่อหน้า Email)
  const username = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || "Member";

  const categories = [
    { id: 'esarn', name: 'อาหารอีสาน', img: 'https://www.thaifoodcookbook.net/wp-content/uploads/2025/05/%E0%B9%80%E0%B8%A1%E0%B8%99%E0%B8%B9%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B8%AD%E0%B8%B5%E0%B8%AA%E0%B8%B2%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%94%E0%B9%81%E0%B8%8B%E0%B9%88%E0%B8%9A%E0%B8%A2%E0%B8%AD%E0%B8%94%E0%B8%99%E0%B8%B4%E0%B8%A2%E0%B8%A12025.jpg' },
    { id: 'thai', name: 'อาหารไทย', img: 'https://www.allthaievent.com/images/event/25453.jpg' },
    { id: 'halal', name: 'อาหารฮาลาล', img: 'https://i0.wp.com/abunajirestaurant.com/wp-content/uploads/2025/07/halal-food.jpg?fit=1000%2C674&ssl=1' },
    { id: 'national', name: 'อาหารต่างชาติ', img: 'https://t4.ftcdn.net/jpg/02/25/96/47/360_F_225964798_yBf4tI79fmIGWwsZpo1K5lhsEQCXy2Pn.jpg' },
  ];

  useEffect(() => {
    const q = query(collection(db, "recipes"), orderBy("createdAt", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    history.push(`/recipes?category=${categoryId}`);
  };

  return (
    <IonPage>
      <IonContent fullscreen>


        {/* Banner */}
        <div className="hero-banner">
          <img src="/assets/imagebar.png" alt="Banner" className="banner-img" />
        </div>

        {/* ปุ่มเมนูหลัก */}
        <IonGrid className="action-buttons-grid">
          <IonRow>
            <IonCol size="6">
              <button className="btn-menu-action" onClick={() => history.push('/recipes')}>
                <IonIcon icon={restaurantOutline} /> เมนูอาหาร
              </button>
            </IonCol>
            <IonCol size="6">
              <button className="btn-menu-action" onClick={() => history.push('/feed')}>
                <IonIcon icon={chatbubbleEllipsesOutline} /> หน้าฟีด
              </button>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* ส่วนแสดงหมวดหมู่ */}
        <div className="recipe-display-grid">
          {categories.map((item) => (
            <div
              key={item.id}
              className="recipe-card-item"
              style={{ backgroundImage: `url(${item.img})` }}
              onClick={() => handleCategoryClick(item.id)}
            >
              <div className="recipe-overlay-text">
                <span>{item.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ส่วนแสดงเมนูอาหารล่าสุด */}
        <div className="community-feed-section">
          <h2 className="section-title">เมนูแนะนำล่าสุด</h2>

          {loading ? (
            <div className="ion-text-center ion-padding">กำลังโหลดเมนูอาหาร...</div>
          ) : recipes.length > 0 ? (
            <IonList className="feed-ion-list">
              {recipes.map((item) => {
                const authorDisplay = item.authorName || item.authorEmail?.split('@')[0] || 'สมาชิก';
                return (
                  <IonItem
                    key={item.id}
                    lines="inset" // หรือใช้ "full" ถ้าอยากให้เส้นยาวสุดขอบหน้าจอ
                    className="custom-feed-item"
                    onClick={() => history.push(`/recipe-detail/${item.id}`)}
                  >
                    <IonLabel className="label-container">
                      <h3 className="post-title">{item.name}</h3>
                      <p className="post-description">โดย {authorDisplay}</p>
                      <span className="post-comment-count">ประเภท: {item.category}</span>
                    </IonLabel>
                    <IonThumbnail slot="end" className="post-thumb">
                      <img src={item.imageUrl || '/assets/2771401.png'} alt={item.name} />
                    </IonThumbnail>
                  </IonItem>
                );
              })}
            </IonList>
          ) : (
            <div className="ion-text-center ion-padding" style={{ color: '#888' }}>
              <p>ยังไม่มีการโพสต์เมนูอาหารในขณะนี้</p>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
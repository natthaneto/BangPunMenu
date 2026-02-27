import React from 'react';
import BottomTabs from '../components/BottomTabs'; // ดึงบาร์ด้านล่างที่แยกไฟล์ไว้มาใช้ 
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonPage,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail
} from '@ionic/react';
import {
  searchOutline,
  restaurantOutline,
  chatbubbleEllipsesOutline
} from 'ionicons/icons';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();

  // ข้อมูลจำลองสำหรับเมนูอาหาร (Mockup Data) [cite: 39]
  const recipeMenus = [
    { id: 1, name: 'ข้าวผัดอเมริกัน', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'ส้มตำ', img: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'ผัดกะเพรา', img: 'https://images.unsplash.com/photo-1626804475297-4160aae013eb?auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'สปาเก็ตตี้', img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=400&q=80' },
  ];

  // ข้อมูลจำลองสำหรับหน้าฟีด (Community Feed) [cite: 3, 31, 33]
  const feedPosts = [
    {
      id: 1,
      title: 'คุณคิดยังไงกับเจ้านี่',
      desc: 'คือผมเพิ่งย้ายมาอยู่ที่ Sweden เมื่อเดือนก่อนเจ้านายผมมาแนะนำสูตรอาหารให้ คุณคิดว่ามันแปลกไหม',
      comments: 1,
      img: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 2,
      title: 'อาหารนี้มันโคตรบ้า',
      desc: 'คุณต้องไม่เชื่อแน่ๆว่าผมได้ทานเจ้านี่เข้าไป',
      comments: 2,
      img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=200&q=80'
    }
  ];

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* 1. ส่วน Header Search (ระบบจัดการผู้ใช้งานเบื้องต้น) [cite: 24, 29] */}
        <div className="custom-header">
          <div className="search-box">
            <IonIcon icon={searchOutline} className="search-icon" />
            <input type="text" placeholder="ค้นหาเมนูอาหาร" className="search-input" />
          </div>
          <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="Profile" className="profile-avatar" />
        </div>

        {/* 2. ส่วน Banner (ใช้ไฟล์ภาพ imagebar.png จากโฟลเดอร์ assets) [cite: 1] */}
        <div className="hero-banner">
          <img src="/assets/imagebar.png" alt="Banner" className="banner-img" />
        </div>

        {/* 3. ปุ่มเมนูหลัก (Action Buttons) [cite: 17, 31] */}
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

        {/* 4. ส่วนแสดงรูปภาพเมนูอาหาร (Recipe Grid) [cite: 27, 29] */}
        <div className="recipe-display-grid">
          {recipeMenus.map((menu) => (
            <div key={menu.id} className="recipe-card-item" style={{ backgroundImage: `url(${menu.img})` }}>
              <div className="recipe-overlay-text">
                <span>{menu.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 5. ส่วนหน้าฟีด (Community Section) [cite: 31, 33] */}
        <div className="community-feed-section">
          <h2 className="section-title">หน้าฟีด</h2>
          <IonList className="feed-ion-list">
            {feedPosts.map((post) => (
              <IonItem key={post.id} lines="none" className="custom-feed-item">
                <IonLabel className="label-container">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-description">{post.desc}</p>
                  <span className="post-comment-count">{post.comments} comments</span>
                </IonLabel>
                <IonThumbnail slot="end" className="post-thumb">
                  <img src={post.img} alt={post.title} />
                </IonThumbnail>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonContent>


    </IonPage>
  );
};

export default Home;
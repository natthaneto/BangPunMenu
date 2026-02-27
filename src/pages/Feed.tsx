import React, { useState, useEffect } from 'react';
import {
  IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonSearchbar,
  IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonThumbnail, IonLoading
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import './Feed.css';

const Feed: React.FC = () => {
  const history = useHistory();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลจากคอลเลกชัน "feeds" เรียงตามเวลาล่าสุด
    const q = query(collection(db, "feeds"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const feedData: any[] = [];
      querySnapshot.forEach((doc) => {
        feedData.push({ id: doc.id, ...doc.data() });
      });
      setPosts(feedData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching feeds: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="feed-toolbar">
          <IonTitle className="feed-header-title">หน้าฟีด</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="search-container">
          <IonSearchbar placeholder="ค้นหาโพสต์ในฟีด" className="custom-searchbar"></IonSearchbar>
        </div>

        <IonSegment scrollable value="all" className="feed-segment">
          <IonSegmentButton value="all"><IonLabel>ทั้งหมด</IonLabel></IonSegmentButton>
          <IonSegmentButton value="trending"><IonLabel>ยอดนิยม</IonLabel></IonSegmentButton>
          <IonSegmentButton value="new"><IonLabel>มาใหม่</IonLabel></IonSegmentButton>
        </IonSegment>

        <IonLoading isOpen={loading} message="กำลังโหลดฟีด..." />

        <IonList className="feed-main-list">
          {posts.length > 0 ? (
            posts.map((post) => (
              <IonItem key={post.id} lines="full" className="feed-post-item" button onClick={() => history.push(`/feed-detail/${post.id}`)}>
                <IonLabel className="post-content">
                  <h2 className="post-title">{post.title || post.caption}</h2>
                  <p className="post-desc">{post.desc || post.caption}</p>
                  <span className="post-comment-info">โดย {post.userName || 'สมาชิก'}</span>
                </IonLabel>
                <IonThumbnail slot="end" className="post-thumbnail-square">
                  <img src={post.imageUrl || post.img} alt="post" />
                </IonThumbnail>
              </IonItem>
            ))
          ) : (
            !loading && <div className="ion-padding ion-text-center">ยังไม่มีโพสต์ในขณะนี้</div>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Feed;
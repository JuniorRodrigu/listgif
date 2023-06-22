import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper';

import styles from "./styles.module.css"; // Importe o arquivo CSS do Banner

const firebaseConfig = {
  apiKey: "AIzaSyDz91V8iQGtKLc8C8TzhRwGOL2soBtsMXo",
  authDomain: "testedelyv.firebaseapp.com",
  projectId: "testedelyv",
  storageBucket: "testedelyv.appspot.com",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const Banner = () => {
  const [favoriteImages, setFavoriteImages] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection('dados')
      .where('favorito', '==', 'sim')
      .onSnapshot((querySnapshot) => {
        const images = querySnapshot.docs.map((doc) => doc.data().imageUrl);
        setFavoriteImages(images);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.container}>
      <Swiper
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        slidesPerView={1}
        className={styles.swiper}
        modules={[Autoplay]}
        loop={true}
      >
        {favoriteImages.map((imageUrl) => (
          <SwiperSlide key={imageUrl} className={styles.slide}>
            <img src={imageUrl} alt="" className={styles.slideImage} /> {/* Adicione a classe "slideImage" aqui */}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;

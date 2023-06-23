import React, { useState, useEffect } from 'react';
import style from './styles.module.css';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDz91V8iQGtKLc8C8TzhRwGOL2soBtsMXo",
  authDomain: "testedelyv.firebaseapp.com",
  projectId: "testedelyv",
  storageBucket: "testedelyv.appspot.com",
};

export default function Produtor({ imageUrl }) {
  const [progress, setProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dados, setDados] = useState({ title: '', value: 0 });

  useEffect(() => {
    const fetchData = async () => {
      // Inicializar o app do Firebase
      initializeApp(firebaseConfig);

      // Configurar o Firebase Storage
      const storage = getStorage();

      // Referência para o arquivo no Firebase Storage
      const storageRef = ref(storage, imageUrl);

      // Obter a URL de download da imagem
      try {
        const url = await getDownloadURL(storageRef);
        setImageLoaded(true);
        // Fazer algo com a URL, se necessário
      } catch (error) {
        console.log('Erro ao obter a URL da imagem:', error);
      }

      // Configurar o Firestore
      const db = getFirestore();

      // Função para obter os dados do Firestore
      const fetchFirestoreData = async () => {
        // Referência para a coleção "dados"
        const dadosCollection = collection(db, 'dados');

        // Obter todos os documentos da coleção "dados"
        try {
          const querySnapshot = await getDocs(dadosCollection);
          const data = querySnapshot.docs.map((doc) => doc.data());
          const item = data.find((item) => item.imageUrl === imageUrl);
          if (item) {
            setDados(item);
            const percentage = item.valop && item.value ? (item.valop / item.value) * 100 : 0;
            setProgress(Math.round(percentage));
          } else {
            setProgress(0);
          }
        } catch (error) {
          console.log('Erro ao obter os dados do Firestore:', error);
        }
      };

      // Buscar os dados do Firestore inicialmente
      fetchFirestoreData();

      const interval = setInterval(fetchFirestoreData, 3000);

      return () => {
        clearInterval(interval);
      };
    };

    fetchData();
  }, [imageUrl]);

  if (!imageLoaded) {
    return (
      <div className={style.container}>
        <div className={style.head}></div>

        <div className={style.info}>
          <div className={style.img}>
            {/* Exibir um indicador de carregamento enquanto a imagem está sendo carregada */}
            <div className={style.loadingIndicator}></div>
          </div>
          <div className={style.progressBar}>
            <div className={style.progressFill} style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <div className={style.head}></div>

      <div className={style.info}>
        <div className={style.img}>
          <img src={imageUrl} alt="" />
        </div>
        <h3>{dados.title}</h3>
        <p className={style.valor}>Valor R${dados.value}</p>
        {dados.value && dados.valop ? (
          <p>Falta R${dados.value - dados.valop}</p>
        ) : (
          <p>Falta R${dados.value}</p>
        )}
        <div className={style.progressBar}>
          <div className={style.progressFill} style={{ width: `${progress}%` }}>
            <div className={style.progressnabe}> {progress}% </div>
          </div>
        </div>
      </div>
    </div>
  );
}

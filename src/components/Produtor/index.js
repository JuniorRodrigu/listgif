import React, { useState, useEffect } from 'react';
import style from './styles.module.css';
import firebase from 'firebase/compat/app'; // Atualização da importação
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from '../firebaseConfig';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function Produtor({ imageUrl }) {
  const [progress, setProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dados, setDados] = useState({ title: '', value: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const storage = getStorage();
      const storageRef = ref(storage, imageUrl);

      try {
        const url = await getDownloadURL(storageRef);
        setImageLoaded(true);
      } catch (error) {
        console.log('Erro ao obter a URL da imagem:', error);
      }

      const db = getFirestore();

      const fetchFirestoreData = async () => {
        const dadosCollection = collection(db, 'dados');

        try {
          const querySnapshot = await getDocs(dadosCollection);
          const data = querySnapshot.docs.map((doc) => doc.data());
          const item = data.find((item) => item.imageUrl === imageUrl);
          if (item) {
            setDados(item);
            const valorEnviadoTotal = item.modificacoes.reduce((acc, cur) => {
              if (cur.status === 'A') {
                return acc + cur.valorEnviado;
              }
              return acc;
            }, 0);
            const valorFalta = item.value - valorEnviadoTotal;
            setDados({ ...item, valop: valorEnviadoTotal });
            const percentage = valorEnviadoTotal && item.value ? (valorEnviadoTotal / item.value) * 100 : 0;
            setProgress(Math.round(percentage));
          } else {
            setProgress(0);
          }
        } catch (error) {
          console.log('Erro ao obter os dados do Firestore:', error);
        }
      };

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
          dados.value - dados.valop <= 0 ? (
            <p>Concluído</p>
          ) : (
            <p>Falta R${dados.value - dados.valop}</p>
          )
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

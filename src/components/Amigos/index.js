import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import styles from './styles.module.css';

// Configurar a conexão com o Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDz91V8iQGtKLc8C8TzhRwGOL2soBtsMXo",
  authDomain: "testedelyv.firebaseapp.com",
  projectId: "testedelyv",
  storageBucket: "testedelyv.appspot.com",
  messagingSenderId: "280921941952",
  appId: "1:280921941952:web:94cc4b8002e3de4de34a25",
  measurementId: "G-NBT902G1TC"
};

// Inicializar o Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore(); // Obtenha uma referência para o Firestore

const About = () => {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    // Buscar os dados do Firestore
    db.collection('dados').onSnapshot((querySnapshot) => {
      const donorsData = querySnapshot.docs.map((doc) => {
        const { modificacoes, title, value, favorito } = doc.data();
        let nomesPessoa = [];
        let valorPorPessoa = {};

        if (modificacoes && modificacoes.length > 0) {
          nomesPessoa = modificacoes.map((modificacao) => modificacao.nomePessoa).filter(Boolean);
          valorPorPessoa = modificacoes.reduce((valor, modificacao) => {
            valor[modificacao.nomePessoa] = modificacao.valorEnviado || 0;
            return valor;
          }, {});
        }

        return {
          id: doc.id,
          title: title,
          value: value,
          favorito: favorito,
          nomesPessoa: nomesPessoa,
          valorPorPessoa: valorPorPessoa,
        };
      });

      setDonors(donorsData);
    });
  }, []);

  return (
    <div className={styles.container} style={{ height: '300px', overflow: 'auto' }}>
    
      {donors.length === 0 ? (
        <p>Carregando...</p>
      ) : (
        <div className={`${styles.donorList} marquee`}>
          {donors.map((donor) =>
            donor.nomesPessoa.map((nomePessoa) => (
              <marquee direction="left">
              <span key={nomePessoa}>
                {nomePessoa} <strong>R$:</strong>
                {donor.valorPorPessoa[nomePessoa]} &nbsp;
              </span>
              </marquee>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default About;

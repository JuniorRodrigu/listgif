import React, { useState, useEffect } from 'react';
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
  const [title, setTitle] = useState('');
  const [value, setValue] = useState(0);
  const [image, setImage] = useState(null);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    // Buscar os dados do Firestore
    db.collection('dados').onSnapshot((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDataList(data);
    });
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleValueChange = (e) => {
    setValue(Number(e.target.value));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    const storageRef = firebase.storage().ref(`images/${image.name}`);
    storageRef
      .put(image)
      .then((snapshot) => {
        console.log('Imagem enviada para o Firebase Storage com sucesso!');
        return snapshot.ref.getDownloadURL();
      })
      .then((imageUrl) => {
        db.collection('dados')
          .add({
            title: title,
            value: value,
            imageUrl: imageUrl,
            favorito: 'não'
          })
          .then(() => {
            console.log('Dados salvos no Firestore com sucesso!');
            setTitle('');
            setValue(0);
            setImage(null);
          })
          .catch((error) => {
            console.error('Erro ao salvar os dados:', error);
          });
      })
      .catch((error) => {
        console.error('Erro ao enviar a imagem:', error);
      });
  };

  const handleToggleFavorito = (dataId) => {
    const dataRef = db.collection('dados').doc(dataId);
    dataRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const favoritoValue = doc.data().favorito === 'não' ? 'sim' : 'não';
          dataRef
            .update({ favorito: favoritoValue })
            .then(() => {
              console.log('Valor do campo favorito atualizado com sucesso!');
            })
            .catch((error) => {
              console.error('Erro ao atualizar o valor do campo favorito:', error);
            });
        } else {
          console.error('Documento não encontrado!');
        }
      })
      .catch((error) => {
        console.error('Erro ao obter o documento:', error);
      });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Enviar Dados para o Firebase</h1>
      <div>
        <label className={styles.label}>Título:</label>
        <input type="text" value={title} onChange={handleTitleChange} className={styles.input} />
      </div>
      <div>
        <label className={styles.label}>Valor:</label>
        <input type="number" value={value} onChange={handleValueChange} className={styles.input} />
      </div>
      <div>
        <label className={styles.label}>Imagem:</label>
        <input type="file" onChange={handleImageChange} className={`${styles.input} ${styles['file-input']}`} />
      </div>
      <button onClick={handleSubmit} className={styles.button}>
        Enviar Dados
      </button>

      <h2>Dados no Firestore:</h2>
      <table className={styles['table-container']}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Valor</th>
            <th>Favorito</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((data) => (
            <tr key={data.id}>
              <td>{data.title}</td>
              <td>{data.value}</td>
              <td>{data.favorito}</td>
              <td>
                <button onClick={() => handleToggleFavorito(data.id)}>Alternar Favorito</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default About;

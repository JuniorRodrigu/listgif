import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import Produtor from '../../components/Produtor';
import Banner from '../../components/Banner';
import styles from './Home.module.css';
import {Link} from 'react-router-dom'


const firebaseConfig = {
  apiKey: "AIzaSyDz91V8iQGtKLc8C8TzhRwGOL2soBtsMXo",
  authDomain: "testedelyv.firebaseapp.com",
  projectId: "testedelyv",
  storageBucket: "testedelyv.appspot.com",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Home = () => {
  const [dados, setDados] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [valorBanco, setValorBanco] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [nomePessoa, setNomePessoa] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore();

      const snapshot = await db.collection('dados').get();
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setDados(data);
    };

    fetchData();
  }, []);

  const openModal = (itemId, imageUrl) => {
    setSelectedItemId(itemId);
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleNomeChange = (event) => {
    setNomePessoa(event.target.value);
  };

  const handleSubmit = () => {
    if (inputValue !== '' && selectedItemId) {
      enviarValorParaBanco(selectedItemId, parseFloat(inputValue), nomePessoa);
      setInputValue('');
      setNomePessoa('');
    }
  };

  const enviarValorParaBanco = async (itemId, valor, nomePessoa) => {
    const db = firebase.firestore();
    const dadosRef = db.collection('dados').doc(itemId);

    try {
      const doc = await dadosRef.get();

      if (doc.exists) {
        const valopAtual = doc.data().valop || 0;
        const contadorAtual = doc.data().contador || 0;
        const novoValor = valopAtual + valor;
        const novoContador = contadorAtual + 1;
        const modificacoes = doc.data().modificacoes || [];

        const novaModificacao = {
          numero: novoContador,
          nomePessoa: nomePessoa,
          valorEnviado: valor
        };

        modificacoes.push(novaModificacao);

        await dadosRef.update({
          valop: novoValor,
          contador: novoContador,
          modificacoes: modificacoes
        });

        console.log('Valor atualizado no banco:', novoValor);
        console.log('Contador atualizado no banco:', novoContador);
        console.log('Modificações atualizadas no banco:', modificacoes);
      } else {
        console.log('O documento com o ID', itemId, 'não existe.');
      }
    } catch (error) {
      console.error('Erro ao enviar valor para o banco:', error);
    }
  };

  const handleSearch = (searchValue) => {
    // Lógica de pesquisa aqui
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTopLeft}>
            <div className={styles.headerTitle}>Seja bem-vindo(a) 👋</div>
            <div className={styles.headerSubtitle}>O que deseja para hoje?</div>
          </div>
          <div className={styles.headerTopRight}>
         
            <Link to="/components/Painel">
              <div className={styles.menuButton}>
                <div className={styles.menuButtonLine}></div>
                <div className={styles.menuButtonLine}></div>
                <div className={styles.menuButtonLine}></div>
              </div>
            </Link>
          
          </div>
        </div>
      </header>
      <Banner />

      <div className={styles.grid}>
        {dados.map((item, index) => (
          <div key={index} className={styles.produtorContainer} onClick={() => openModal(item.id, item.imageUrl)}>
            <Produtor imageUrl={item.imageUrl} />
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <img src={modalImage} alt="Imagem do produto" />
          
            <input type="text" value={nomePessoa} onChange={handleNomeChange} placeholder="Nome da pessoa" />
            <input type="text" value={inputValue} onChange={handleInputChange}  placeholder="valor" />
            <button onClick={handleSubmit}>Enviar Valor</button>
            <button onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

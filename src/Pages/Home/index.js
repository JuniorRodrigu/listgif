import React, { useState, useEffect } from "react";
import axios from "axios";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import Produtor from '../../components/Produtor';
import Banner from '../../components/Banner';
import Amigos from '../../components/Amigos';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';

const api = axios.create({
  baseURL: "https://api.mercadopago.com",
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer APP_USR-8695569384609059-042822-a13531b6ad0df397a0052de6523a47b6-200617663`;
  return config;
});

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
  const [showModal, setShowModal] = useState(false);
  const [dados, setDados] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [nomePessoa, setNomePessoa] = useState('');
  const [enviadoComSucesso, setEnviadoComSucesso] = useState(false);
  const [valorPagamento, setValorPagamento] = useState('');
  const [responsePayment, setResponsePayment] = useState(null);
  const [statusPayment, setStatusPayment] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  let intervalId;

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
    setEnviadoComSucesso(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleNomeChange = (event) => {
    setNomePessoa(event.target.value);
  };

  function handleCopyClick() {
  // Selecione o elemento que contém os dados do código QR
  var qrCodeDataElement = document.getElementById('qr_code');

  // Verifique se o elemento existe
  if (qrCodeDataElement) {
    // Selecione o texto dentro do elemento
    var textToCopy = qrCodeDataElement.innerText;

    // Verifique se há suporte para a API Clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Use a API Clipboard para copiar o texto
      navigator.clipboard.writeText(textToCopy)
        .then(function() {
          // Copiado com sucesso
          console.log('Dados do código QR copiados com sucesso!');
        })
        .catch(function(error) {
          // Ocorreu um erro ao copiar
          console.error('Erro ao copiar os dados do código QR:', error);
        });
    } else {
      // Caso contrário, use uma abordagem alternativa para copiar o texto (por exemplo, usando o document.execCommand)
      // ...
    }
  }
}

  
  
  
  const handleSubmit = () => {
    if (inputValue !== '' && selectedItemId) {
      enviarValorParaBanco(selectedItemId, parseFloat(inputValue), nomePessoa);
      setValorPagamento(parseFloat(inputValue));
      setInputValue('');
      setNomePessoa('');
      setEnviadoComSucesso(true);
      gerarPagamentoPix();
    }
  };

  const handleInputKeyPress = (event) => {
    const keyCode = event.which || event.keyCode;
    const keyValue = String.fromCharCode(keyCode);
    const isNumber = /^\d+$/.test(keyValue);
    if (!isNumber) {
      event.preventDefault();
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
          valorEnviado: valor,
          status: "P"
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

  const gerarPagamentoPix = () => {
    const body = {
      transaction_amount: parseFloat(inputValue),
      description: "Produto teste de desenvolvimento",
      payment_method_id: "pix",
      payer: {
        email: "gerson@gmail.com",
        first_name: "Gerson Dev",
        last_name: "JS python html",
        identification: {
          type: "CPF",
          number: "01234567890",
        },
      },
      notification_url: "https://eodvum2vysvd4fb.m.pipedream.net",
    };

    api
      .post("v1/payments", body)
      .then((response) => {
        setResponsePayment(response);
        setQrCodeData(response.data.point_of_interaction);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const checkPaymentStatus = () => {
    if (responsePayment) {
      api.get(`v1/payments/${responsePayment.data.id}`).then((response) => {
        if (response.data.status === "approved") {
          setStatusPayment(true);
          clearInterval(intervalId);
          setShowModal(true);
        }
      });
    }
  };
  
  const handleReset = () => {
    setModalImage(null);
    setSelectedItemId(null);
    setEnviadoComSucesso(false);
    setStatusPayment(false);
    setShowModal(false);
  };
  
  useEffect(() => {
    intervalId = setInterval(checkPaymentStatus, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [responsePayment]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTopLeft}>
            <div className={styles.headerTitle}>Seja bem-vindo(a) 👋</div>
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
        <Amigos />
      </header>
      <Banner />

      <div className={styles.grid}>
        {dados.map((item, index) => (
          <div key={index} className={styles.produtorContainer} onClick={() => openModal(item.id, item.imageUrl)}>
            <Produtor imageUrl={item.imageUrl} />
          </div>
        ))}
      </div>

      {isModalOpen && selectedItemId && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <img src={modalImage} alt="Imagem do produto" />
            <div className="modal-input">
              <input className={styles.minput} type="text" value={nomePessoa} onChange={handleNomeChange} placeholder="Nome da pessoa" />
              <br />
              <input className={styles.minput} type="text" value={inputValue} onChange={handleInputChange} placeholder="Valor" onKeyPress={handleInputKeyPress} />
            </div>
            {selectedItemId && (
              <p>Falta R${dados.find(item => item.id === selectedItemId).value - dados.find(item => item.id === selectedItemId).valop}</p>
            )}
            {enviadoComSucesso ? (
              <div>
            {qrCodeData && !statusPayment && (
  <>
 <img id="qr_code" src={`data:image/jpeg;base64,${qrCodeData.transaction_data.qr_code_base64}`} alt="QR Code" />

    <button onClick={handleCopyClick} type="button">Copiar Chave Pix</button>
  </>
)}
                <button onClick={handleReset} type="button">Fechar</button>
              </div>
            ) : (
              <div>
                <button onClick={handleSubmit} type="button">Enviar Valor</button><br></br>
                <button onClick={handleReset} type="button">Fechar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

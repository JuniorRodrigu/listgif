import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDz91V8iQGtKLc8C8TzhRwGOL2soBtsMXo",
  authDomain: "testedelyv.firebaseapp.com",
  projectId: "testedelyv",
  storageBucket: "testedelyv.appspot.com",
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const MyComponent = () => {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const donorsRef = ref(database, 'donors');

    onValue(donorsRef, (snapshot) => {
      const donorsData = snapshot.val();
      const donorsArray = Object.keys(donorsData).map((key) => ({
        id: key,
        ...donorsData[key]
      }));

      // Filtrar os doadores com nomePessoa igual a "testedelyv"
      const filteredDonors = donorsArray.filter((donor) => donor.nomePessoa === 'testedelyv');

      setDonors(filteredDonors);
    });

    return () => {
      // Cleanup function
    };
  }, []);

  return (
    <div>
      <h1>Lista de Doadores</h1>
      <ul>
        {donors.map((donor) => (
          <li key={donor.id}>
            <strong>Nome:</strong> {donor.nomePessoa}, <strong>Número:</strong> {donor.numero}, <strong>Valor Enviado:</strong> {donor.valorEnviado}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.mercadopago.com",
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer APP_USR-8695569384609059-042822-a13531b6ad0df397a0052de6523a47b6-200617663`;
  return config;
});

function Paga(props) {
  const [showModal, setShowModal] = useState(false);
  const [responsePayment, setResponsePayment] = useState(null);
  const [statusPayment, setStatusPayment] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState(
    parseFloat(props.transactionAmount)
  );
  const [qrCodeData, setQrCodeData] = useState(null);
  let intervalId;

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    closeModal(); // Close the previous modal if it's open

    const body = {
      transaction_amount: 10,
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

  useEffect(() => {
    intervalId = setInterval(checkPaymentStatus, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [responsePayment]);

  useEffect(() => {
    handleSubmit();
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="pix">
      <header>
        {qrCodeData && !statusPayment && (
          <img src={`data:image/jpeg;base64,${qrCodeData.transaction_data.qr_code_base64}`} alt="QR Code" />
        )}
      </header>
    </div>
  );
}

export default Paga;

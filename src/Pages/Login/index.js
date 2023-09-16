import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const containerStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
    padding: '20px',
    width: '300px',
    margin: 'auto', // Centraliza horizontalmente
  };

  const h2Style = {
    fontSize: '24px',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
  };

  const inputStyle = {
    width: '90%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '20px',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    cursor: 'pointer',
    width: '100%',
  };

  const errorStyle = {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px',
  };

  const handleLogin = () => {
    if (!password) {
      setError('Por favor, insira sua senha.');
    } else if (password === '1234') {
      navigate('/components/Painel');
    } else {
      setError('Senha incorreta.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center', // Centraliza horizontalmente
        alignItems: 'center', // Centraliza verticalmente
        minHeight: '100vh', // Altura da tela inteira
      }}
    >
      <div style={containerStyle}>
        <h2 style={h2Style}>Login</h2>
        <div>
          <label style={labelStyle}>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>
        <button onClick={handleLogin} style={buttonStyle}>
          Entrar
        </button>
        {error && <p style={errorStyle}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;

import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';

const Modal = ({
  isOpen,
  imageUrl,
  closeModal,
  inputValue,
  handleInputChange,
  handleInputKeyPress,
  nomePessoa,
  handleNomeChange,
  handleSubmit,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <img src={imageUrl} alt="Imagem do produto" />
        <div className={styles['modal-input']}>
          <input
            type="text"
            value={nomePessoa}
            onChange={handleNomeChange}
            placeholder="Nome da pessoa"
          />
          <br />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="valor"
            onKeyPress={handleInputKeyPress}
          />
        </div>
        <button className={styles.button} onClick={handleSubmit}>
          Enviar Valor
        </button>
        <button className={styles.button} onClick={closeModal}>
          Fechar
        </button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleInputKeyPress: PropTypes.func.isRequired,
  nomePessoa: PropTypes.string.isRequired,
  handleNomeChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default Modal;

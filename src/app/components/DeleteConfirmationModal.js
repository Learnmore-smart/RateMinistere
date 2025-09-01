import React, { useEffect, useRef, useState } from 'react';
import styles from './DeleteConfirmationModal.module.css';
import { useTranslation } from 'react-i18next';

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, message }) {
    const { t } = useTranslation();
    const [isClosing, setIsClosing] = useState(false);
    const modalRef = useRef(null);

    // Single effect to handle both opening and closing
    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
            if (modalRef.current) {
                modalRef.current.classList.remove(styles.closing);
                modalRef.current.classList.add(styles.showing);
                document.body.classList.add('modal-open');
            }
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        if (modalRef.current) {
            modalRef.current.classList.remove(styles.showing);
            modalRef.current.classList.add(styles.closing);
            setTimeout(() => {
                document.body.classList.remove('modal-open');
                onClose();
            }, 500); // Match this with your animation duration
        }
    };

    const handleConfirm = () => {
        setIsClosing(true);
        if (modalRef.current) {
            modalRef.current.classList.remove(styles.showing);
            modalRef.current.classList.add(styles.closing);
            setTimeout(() => {
                document.body.classList.remove('modal-open');
                onConfirm();
            }, 500);
        }
    };

    if (!isOpen && !isClosing) {
        return null;
    }

    return (
        <div className={`${styles.overlay} ${isOpen && !isClosing ? styles.show : ''}`}>
            <div ref={modalRef} className={styles.modal}>
                <div className={styles.message}><p>{message}</p></div>
                <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={handleClose}>
                        <p>{t('Delete.cancel')}</p>
                    </button>
                    <button className={styles.confirmButton} onClick={handleConfirm}>
                        <p>{t('Delete.delete')}</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;
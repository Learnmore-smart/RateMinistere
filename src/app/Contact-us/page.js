'use client'
import React, { useState } from 'react';
import styles from './ContactPage.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/app/profile/ToastCustom.css';
import { useTranslation } from 'react-i18next';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    recipient: 'rateministere@gmail.com'
                }),
            });

            if (response.ok) {
                setFormData({ name: '', email: '', message: '' });
                toast.success(t('Contact.messageSent'));
            } else {
                toast.error(t('Common.errorTryAgain'));
            }
        } catch (error) {
            toast.error(t('Common.connectionError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.bg}></div>
            <h1 className={styles.heading}>{t("Contact.title")}</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t("Contact.name")}</label>
                    <input
                        type="text"
                        required
                        placeholder='ex. John Doe'
                        className={styles.input}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('Contact.email')}</label>
                    <input
                        type="email"
                        required
                        placeholder='exemple@gmail.com'
                        className={styles.input}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('Contact.message')}</label>
                    <textarea
                        required
                        placeholder={t('Contact.placeholder.message')}
                        className={`${styles.input} ${styles.textarea}`}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    className={styles.button}
                    disabled={isSubmitting}
                >
                    <p>{isSubmitting ? t('Contact.sending') : t('Contact.send')}</p>
                </button>
            </form>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                limit={1}
            />
        </div>
    );
};

export default ContactPage;
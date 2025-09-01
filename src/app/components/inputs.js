import React from 'react';
import styles from './inputs.module.css';

export const CustomToggle = ({ checked, onChange, label, ...props }) => {
    return (
        <div className={styles.toggleContainer}>
            {label && <label className={styles.toggleLabel}>{label}</label>}
            <label className={styles.switch}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className={styles.checkbox}
                />
                <span className={`${styles.slider} ${styles.round}`}></span>
            </label>
        </div>
    );

};

export default { CustomToggle };

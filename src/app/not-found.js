"use client";
import React from "react";
import styles from "./not-found.module.css";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function FourOhFour() {
    const { t } = useTranslation();

    const createParticles = (e) => {
        const container = e.currentTarget;
        const particleCount = 32;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add(styles.particle);

            const containerRect = container.getBoundingClientRect();
            const x = Math.random() * containerRect.width;
            const y = Math.random() * containerRect.height;

            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;

            container.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.bg}></div>
            <div
                className={styles.header}
                onMouseOver={createParticles}
            >
                <h1 className={styles.title}>404</h1>
            </div>
            <h4 className={styles.subtitle}>{t('404.title')}</h4>
            <div className={styles.errorDescription}>
                <h5 className={styles.description}>{t('404.description')}</h5>
                <p className={styles.suggestion}>{t('404.suggestion')}</p>
            </div>
            <div className={styles.links}>
                <Link href="/" legacyBehavior>
                    <a className={styles.homeLink}>{t('404.goHome')}</a>
                </Link>
            </div>
        </div>
    );
};
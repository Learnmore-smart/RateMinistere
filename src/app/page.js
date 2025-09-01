/*
 * Copyright 2025 Learnmore_Smart
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import SignOutButton from "./components/SignOutButton";
import { useTranslation } from "react-i18next";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaDiscord } from "react-icons/fa";
import ChristmasLetter from './components/ChristmasLetter';
import FAQ from './components/FAQ/FAQ';

const Typewriter = ({
    text,
    speed = 100,
    delay = 0,
    cursor = true,
    onComplete,
    deleteSpeed = 50,
    ...otherprops
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const indexRef = useRef(0);
    const timeoutRef = useRef(null);

    const deleteText = useCallback(() => {
        if (indexRef.current > 0) {
            setDisplayedText(text.slice(0, indexRef.current - 1));
            indexRef.current -= 1;

            timeoutRef.current = setTimeout(deleteText, deleteSpeed);
        } else {
            setIsDeleting(false);
            indexRef.current = 0;
            onComplete && onComplete();
            type();
        }
    }, [text, deleteSpeed, onComplete]);

    const type = useCallback(() => {
        if (indexRef.current < text.length) {
            setDisplayedText(text.slice(0, indexRef.current + 1));
            indexRef.current += 1;

            timeoutRef.current = setTimeout(type, speed);
        } else {
            setIsTyping(false);
            setIsDeleting(true);
            timeoutRef.current = setTimeout(deleteText, 1000);
        }
    }, [text, speed, deleteText]);

    useEffect(() => {
        setDisplayedText('');
        indexRef.current = 0;
        setIsTyping(true);
        setIsDeleting(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        const startTimeout = setTimeout(() => {
            type();
        }, delay);
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            clearTimeout(startTimeout);
        };
    }, [text, type, delay]);

    return (
        <span {...otherprops} style={{ display: 'inline-block' }}>
            {displayedText}
            {cursor && (isTyping || isDeleting) && (
                <span
                    className={styles.typingball}
                />
            )}
        </span>
    );
}

export default function Home() {
    const { t } = useTranslation();
    const { data: session, status: sessionStatus } = useSession();
    const [showChristmasLetter, setShowChristmasLetter] = useState(true);

    const status = useMemo(() => [
        "Loving",
        "Wondering about",
        "Complaints about",
        "Issues with",
        "Happy with",
        "Dislike",
        "Frustrated by",
        "Impressed by",
        "Satisfied by",
        "Amazed by",
        "Worried about",
        "Bothered by",
        "Disappointed in"
    ], []);

    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            setShowChristmasLetter(true);
        }
    }, [sessionStatus]);

    const [cStatus, setStatus] = useState(status[0]);
    const [key, setKey] = useState(0);

    const changeStatus = useCallback(() => {
        setStatus((prevStatus) => {
            const currentIndex = status.indexOf(prevStatus);
            const nextIndex = (currentIndex + 1) % status.length;
            return status[nextIndex];
        });
        setKey(prev => prev + 1);
    }, [status]);

    useEffect(() => {
        const interval = setInterval(() => {
            setStatus((prevStatus) => {
                const currentIndex = status.indexOf(prevStatus);
                const nextIndex = (currentIndex + 1) % status.length;
                return status[nextIndex];
            });
        }, 6000);
        return () => clearInterval(interval);
    }, [status]);

    function TranslatedPImage(p) {
        const originalText = p.replace(/<special>/g, `<span class="${styles["emphasis-word"]}">`).replace(/<\/special>/g, '</span>');

        return <p className={styles["image-text"]} dangerouslySetInnerHTML={{ __html: originalText }} />;
    }

    function TranslatedP(p) {
        const originalText = p.replace(/<special>/g, `<span class="${styles["featured-emphasis"]}">`).replace(/<\/special>/g, '</span>');

        return <p className={styles["featured-description"]} dangerouslySetInnerHTML={{ __html: originalText }} />;
    }

    return (
        <div className={styles.page}>
            <div className={styles["background"]}></div>
            <main className={styles.main}>
                <div className={styles.frontpage}>
                    <Link
                        href="https://discord.gg/zaDJtKkuVG"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.discordButton}
                    >
                        <div className={styles.lightHolder}>
                            <div className={styles.dot}></div>
                            <div className={styles.light}></div>
                        </div>
                        <div className={styles.buttonHolder}>
                            <FaDiscord className={styles.discordIcon} />
                        </div>
                    </Link>
                    <h1>
                        <Typewriter
                            text={t('Home.status.' + cStatus)}
                            key={key}
                            className={styles.cStatus}
                            onComplete={changeStatus}
                        />
                        <br />
                        <span className={styles.heading}>{t('Home.title')}</span>
                    </h1>
                    <div className={styles["heading-wrapper"]}>
                        <h2>{t('Home.subtitle')}</h2>
                    </div>
                    <div className={styles["image-row"]}>
                        <div className={styles["image-container"]}>
                            <div className={styles["image-box"]}>
                                <Image
                                    src="/images/Homepage/1. Anonymous.png"
                                    alt="1. Anonymous"
                                    fill
                                    priority
                                />
                            </div>
                            {TranslatedPImage(t('Home.privacy'))}
                        </div>
                        <div className={styles["image-container"]}>
                            <div className={styles["image-box"]}>
                                <Image
                                    src="/images/Homepage/2. Thumbs up.png"
                                    alt="2. Thumbs up"
                                    fill
                                    priority
                                />
                            </div>
                            {TranslatedPImage(t('Home.matters'))}
                        </div>
                        <div className={styles["image-container"]}>
                            <div className={styles["image-box"]}>
                                <Image
                                    src="/images/Homepage/3. Erase and edit.png"
                                    alt="3. Erase and edit"
                                    fill
                                    priority
                                />
                            </div>
                            {TranslatedPImage(t('Home.control'))}
                        </div>
                    </div>
                </div>
                <div className={styles["signup-section"]}>
                    <div className={styles["featured-section"]}>
                        <div className={styles["featured-image-container"]}>
                            <Image
                                src="/images/Homepage/1st.png"
                                alt="Featured Image"
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                        </div>
                        <div className={styles["featured-content"]}>
                            <h2 className={styles["featured-title"]}>{t('Home.redefiningExcellence')}</h2>
                            <div className={styles["featured-description-wrapper"]}>
                                {TranslatedP(t('Home.p1'))}
                                {TranslatedP(t('Home.p2-1'))}
                            </div>
                        </div>
                    </div>

                    <div>
                        {sessionStatus !== 'authenticated' && (
                            <SignOutButton
                                text={t('Home.signup-1')}
                            />
                        )}
                        {showChristmasLetter && sessionStatus === 'authenticated' && (
                            <ChristmasLetter
                                onClose={() => setShowChristmasLetter(false)}
                            />
                        )}
                    </div>
                    {/* <Link href="/Crew" target="_blank" rel="noopener noreferrer"  style={{ textDecoration: 'none' }}>
                        <button className={styles['animated-button']}>
                            <svg viewBox="0 0 24 24" className={styles['arr-2']} xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                                ></path>
                            </svg>
                            <span className={styles.text}  style={{ textDecoration: 'none' }}>{t("Crew.meet-us")}</span>
                            <span className={styles.circle}></span>
                            <svg viewBox="0 0 24 24" className={styles['arr-1']} xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                                ></path>
                            </svg>
                        </button>
                    </Link> */}
                </div>
            </main>
            <FAQ />
        </div>
    );
}
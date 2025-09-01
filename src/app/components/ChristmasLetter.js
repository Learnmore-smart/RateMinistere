"use strict";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronUp, ChevronDown, X } from 'lucide-react'; // Add missing icons
import styles from './ChristmasLetter.module.css';

const ChristmasLetter = ({ onClose }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkEligibility = async () => {
            try {
                const response = await fetch('/api/user/check-beta-eligibility');
                const data = await response.json();
                setIsVisible(data.isEligible);
            } catch (error) {
                console.error('Failed to check eligibility:', error);
                setIsVisible(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkEligibility();
    }, []);

    const handlePageChange = (direction) => {
        setCurrentPage(prev => {
            const nextPage = direction === 'up'
                ? Math.max(prev - 1, 0)
                : Math.min(prev + 1, 3);
            return nextPage;
        });
    };

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    const pageContent = {
        0: {
            title: "A Special Christmas Surprise!",
            content: "Wait a second! We've discovered a magical Christmas letter addressed just to you! \n\n As one of our most valued beta users, let's open it together!"
        },
        1: {
            title: "Our Journey Begins",
            content: "Dear Beta user, as you know, we don't have the decades of market position, connections, and brand built by international corporations, nor the investments they receive from other giants, to rely on. We have nothing to depend on except working harder than others—working during the time others spend drinking coffee and relaxing, and treating our clients with utmost sincerity."
        },
        2: {
            title: "Thank You Beta Users",
            content: "So we thank every beta user for trusting us and giving us the opportunity to grow and improve. It's you who inspire us to keep going, to believe that a small team with a big dream can achieve greatness. It's you who prove that innovation and dedication matter more than resources and backing."
        },
        3: {
            title: "Just the Beginning",
            content: "We created our website just one month ago, and thanks to you, we already have 30+ beta users. This is just the beginning, and your trust fuels our ambition to create something truly extraordinary.",
            showBadge: true
        }
    };

    if (isLoading || !isVisible) return null;

    return (
        <div className={styles.fullscreenOverlay}>
            {currentPage > 0 && (
                <div className={styles.navigationIconUp} onClick={() => handlePageChange('up')}>
                    <ChevronUp size={32} />
                </div>
            )}
            <div className={styles.pageContainer}>
                <div
                    className={styles.pageContent}
                    style={{ transform: `translateY(-${currentPage * 100}vh)` }}
                >
                    {Object.entries(pageContent).map(([pageNum, content]) => (
                        <div
                            key={pageNum}
                            className={styles.page}
                            data-page={pageNum}
                        >
                            <div className={styles.contentWrapper}>
                                <h2 className={styles.titleText}>{content.title}</h2>
                                <p className={styles.subtitleText}>{content.content}</p>
                                {pageNum === "3" && (
                                    <div className={styles.badgeContainer}>
                                        <p className={styles.giftText}>
                                            Here is your christmas gift - Beta User Badge!!!
                                        </p>
                                        <div className={styles.badgeImageWrapper}>
                                            <Image
                                                src="/images/Badges/Beta-Christmas.png"
                                                alt="Beta User Christmas Badge"
                                                width={300}
                                                height={300}
                                                priority
                                                quality={100}
                                                className={styles.badgeImage}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {currentPage < 3 ? (
                <div className={styles.navigationIconDown} onClick={() => handlePageChange('down')}>
                    <ChevronDown size={32} />
                </div>
            ) : (
                <div className={styles.closeIcon} onClick={handleClose}>
                    <X size={32} />
                </div>
            )}
        </div>
    );
};

export default ChristmasLetter;
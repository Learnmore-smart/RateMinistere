"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './SchoolBanner.module.css';

const SchoolBanner = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const schools = [
        {
            name: "Collège Charlemagne",
            image: "/images/SchoolBanner/College-Charlemagne.jpg",
            url: "https://www.collegecharlemagne.ca/"
        },
        {
            name: "Collège Beaubois",
            image: "/images/SchoolBanner/College-Beaubois.jpg",
            url: "https://collegebeaubois.qc.ca/"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((current) => (current + 1) % schools.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.bannerContainer}>
            <div className={styles.sliderWrapper}>
                <div
                    className={styles.imageSlider}
                    style={{ transform: `translateY(-${activeIndex * 50}%)` }}
                >
                    {schools.map((school, index) => (
                        <Link
                            key={index}
                            href={school.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.slideLink}
                        >
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={school.image}
                                    alt={school.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    priority={index === 0}
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className={styles.dotsContainer}>
                {schools.map((_, index) => (
                    <div
                        key={index}
                        className={`${styles.dot} ${index === activeIndex ? styles.activeDot : ''}`}
                        onClick={() => setActiveIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default SchoolBanner;
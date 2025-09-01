"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from './points.module.css';

const PointsHistory = () => {
    const { data: session } = useSession();
    const [pointsHistory, setPointsHistory] = useState([]);

    useEffect(() => {
        const fetchPointsHistory = async () => {
            if (session) {
                try {
                    const response = await fetch(`/api/user/activity`);
                    const data = await response.json();
                    if (data?.history && Array.isArray(data.history)) {
                        setPointsHistory(data.history);
                    }
                } catch (error) {
                    console.error('Error fetching points history:', error);
                }
            }
        };
        fetchPointsHistory();
    }, [session]);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.bg}></div>
            <h1>Points History</h1>
            <ul className={styles.list}>
                {pointsHistory.map((entry, index) => (
                    <li key={index} className={styles.listItem}>
                        <span className={styles.points}>
                            {entry.points > 0 && '+'}
                            {entry.points}
                        </span>
                        <span className={styles.action}>{entry.action}</span>
                        <span className={styles.date}>{formatDate(entry.timestamp)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PointsHistory;
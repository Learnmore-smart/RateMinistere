"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from './leaderboard.module.css';
import { Award } from 'lucide-react';

const leaderboardData = [
    { name: "Obsidian", image: "/images/trophies/1. Obsidian.png" },
    { name: "Jade", image: "/images/trophies/2. Jade.png" },
    { name: "Citrine", image: "/images/trophies/3. Citrine.png" },
    { name: "Topaz", image: "/images/trophies/4. Topaz.png" },
    { name: "Amethyst", image: "/images/trophies/5. Amethyst.png" },
    { name: "Ruby", image: "/images/trophies/6. Ruby.png" },
    { name: "Sapphire", image: "/images/trophies/7. Sapphire.png" },
    { name: "Emerald", image: "/images/trophies/8. Emerald.png" },
    { name: "Diamond", image: "/images/trophies/9. Diamond.png" },
    { name: "Celestite", image: "/images/trophies/10. Celestite.png" },
    { name: "Moonstone", image: "/images/trophies/11. Moonstone.png" },
    { name: "Solar Flare", image: "/images/trophies/12. SolarFlare.png" },
    { name: "AstrArena", image: "/images/trophies/13. AstrArena.png" }
];

const Leaderboard = () => {
    const [levelLeaderboard, setLevelLeaderboard] = useState([
        { _id: '1', rank: 1, name: "mmmmmmmmmmmmmmm", points: 1000 },
        { _id: '2', rank: 2, name: "Level Leader 2", points: 950 },
        { _id: '3', rank: 3, name: "Level Leader 3", points: 920 },
        { _id: '4', rank: 4, name: "Level Leader 4", points: 900 },
        { _id: '5', rank: 5, name: "Level Leader 5", points: 880 },
        { _id: '6', rank: 6, name: "Level Leader 6", points: 860 },
        { _id: '7', rank: 7, name: "Level Leader 7", points: 840 },
        { _id: '8', rank: 8, name: "Level Leader 8", points: 820 },
        { _id: '9', rank: 9, name: "Level Leader 9", points: 800 },
        { _id: '10', rank: 10, name: "Level Leader 10", points: 780 },
        { _id: '11', rank: 11, name: "Level Leader 11", points: 760 },
        { _id: '12', rank: 12, name: "Level Leader 12", points: 740 },
        { _id: '13', rank: 13, name: "Level Leader 13", points: 720 },
        { _id: '14', rank: 14, name: "Level Leader 14", points: 700 },
        { _id: '15', rank: 15, name: "Level Leader 15", points: 680 },
        { _id: '16', rank: 16, name: "Level Leader 16", points: 660 },
        { _id: '17', rank: 17, name: "Level Leader 17", points: 640 },
        { _id: '18', rank: 18, name: "Level Leader 18", points: 620 },
        { _id: '19', rank: 19, name: "Level Leader 19", points: 600 },
        { _id: '20', rank: 20, name: "Level Leader 20", points: 580 },
        { _id: '21', rank: 21, name: "Level Leader 21", points: 560 },
        { _id: '22', rank: 22, name: "Level Leader 22", points: 540 },
        { _id: '23', rank: 23, name: "Level Leader 23", points: 520 },
        { _id: '24', rank: 24, name: "Level Leader 24", points: 500 },
        { _id: '25', rank: 25, name: "Level Leader 25", points: 480 },
        { _id: '26', rank: 26, name: "Level Leader 26", points: 460 },
        { _id: '27', rank: 27, name: "Level Leader 27", points: 440 },
        { _id: '28', rank: 28, name: "Level Leader 28", points: 420 },
        { _id: '29', rank: 29, name: "Level Leader 29", points: 400 },
        { _id: '30', rank: 30, name: "Level Leader 30", points: 380 },
    ]);

    const [userLevel, setUserLevel] = useState(7);
    const [leaderboardName, setLeaderboardName] = useState("Sapphire");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const trophyRowRef = useRef(null);
    const trophyRefs = useRef([]);

    // Initialize trophyRefs with empty objects
     useEffect(() => {
        trophyRefs.current = trophyRefs.current.slice(0, leaderboardData.length);
      }, []);

    useEffect(() => {
        centerActiveTrophy();

        // Unlock previous trophies when level is 7
        if (userLevel === 7) {
            unlockPreviousTrophies(6);
        }
    }, [userLevel]);

    const centerActiveTrophy = () => {
        // Set the --offset variable on the trophyRow
        if (trophyRowRef.current) {
            trophyRowRef.current.style.setProperty('--offset', userLevel);
        }
    };

    const unlockPreviousTrophies = (level) => {
        // No need to set state for trophy unlock, unlock logic is now in isTrophyUnlocked method.
    };

    const getRankBadge = (rank) => {
        switch (rank) {
            case 1:
                return <Award color="#FFD700" size={20} />;
            case 2:
                return <Award color="#C0C0C0" size={20} />;
            case 3:
                return <Award color="#CD7F32" size={20} />;
            default:
                return `${rank}`;
        }
    };

    // Functions to determine trophy states
    const isTrophyUnlocked = (index) => {
        return index + 1 <= userLevel;
    };

    const isCurrentTrophy = (index) => {
        return index + 1 === userLevel;
    };

    const getTrophyClasses = (index) => {
        let classes = `${styles.trophy}`;
        if (isCurrentTrophy(index)) {
            classes += ` ${styles.activeTrophy}`;
        } else if (isTrophyUnlocked(index)) {
            classes += ` ${styles.unlockedTrophy}`;
        } else {
            classes += ` ${styles.lockedTrophy}`;
        }
        return classes;
    };

      const handleImageLoad = (e, index) => {
         if (trophyRefs.current[index]) {
           const img = e.target;
           const imageHeight = img.offsetHeight;
             trophyRefs.current[index].style.setProperty('--image-offset', `${(60 - imageHeight)/2}px`);
        }
    };

    return (
        <div className={styles.leaderboardContainer}>
            <div className={styles.leaderboardSection}>
                <div className={styles.trophyRowContainer}  >
                    <div className={styles.trophyRow} ref={trophyRowRef}>
                        {leaderboardData.map((trophy, index) => (
                             <div
                                key={trophy.name}
                                className={styles.trophyWrapper}
                                title={trophy.name}
                                ref={el => (trophyRefs.current[index] = el)}

                                >
                                    <img
                                        src={trophy.image}
                                        alt={trophy.name}
                                        className={getTrophyClasses(index)}
                                         onLoad={(e) => handleImageLoad(e, index)}
                                    />
                                     {isCurrentTrophy(index) && (
                                        <div className={styles.activeTrophyLines}>
                                           <div className={styles.line} />
                                            <div className={styles.line} style={{transform: 'rotate(45deg)'}}/>
                                            <div className={styles.line} style={{transform: 'rotate(90deg)'}}/>
                                             <div className={styles.line} style={{transform: 'rotate(135deg)'}}/>
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
                <h2>{leaderboardName}</h2>
                <div className={styles.leaderboardContent}>
                    <div className={styles.rankColumn}>
                        {levelLeaderboard.map(student => (
                            <div key={student._id} className={styles.leaderboardCard}>
                                <div className={styles.studentInfo}>
                                    <span className={styles.rank}>{getRankBadge(student.rank)}</span>
                                    <h3>{student.name}</h3>
                                </div>
                                <div className={styles.pointsDisplay}>
                                    <span>{student.points} XP</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
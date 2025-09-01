'use client';
import styles from './navbar.module.css';
import SearchBar from './components/SearchBar';
import SignOut from './components/SignOutButton';
import { House, CircleUserRound, Bell, BellRing } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { Ranking, CheckCircle, PiggyBank } from "@phosphor-icons/react";
import { useSession } from 'next-auth/react';
import CompareButton from './components/CompareButton';
import { createPortal } from 'react-dom';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationModalRef = useRef(null);
  const session = useSession({ required: false });
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isComparing, setIsComparing] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const fetchOrigin = async (type, originId) => {
    switch (type) {
      case 'reply':
        return await fetch('/api/comments/reply/' + originId).then(result => result.json()).then(data => data.comment);
      case 'comment':
        return await fetch('/api/comments/' + originId).then(result => result.json()).then(data => data.comment);
      case 'schoolComment':
        return await fetch('/api/schoolcomments/' + originId).then(result => result.json()).then(data => data.comment);
    }
  }

  const userDisplayCache = []

  const fetchUserDisplay = async (userId) => {
    try {
      if (userDisplayCache[userId]) return userDisplayCache[userId];

      const res = await fetch('/api/user/display/' + userId);
      if (!res.ok) {
        throw new Error(`Failed to fetch display: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      userDisplayCache[userId] = data;
      return data
    } catch (error) {
      console.error("Error fetching user display:", error);
    }
  }

  const fetchPoints = async () => {
    try {
      const res = await fetch('/api/user');
      if (!res.ok) {
        throw new Error(`Failed to fetch points: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setPoints(data.points);
    } catch (error) {
      console.error("Error fetching points:", error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) {
        throw new Error(`Failed to fetch notifications: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();

      // Process all notifications concurrently
      const processedNotifications = await Promise.all(
        data.notifications.map(async (notif) => {
          try {
            const originType = notif.content.translationKey.endsWith(".ReplyLiked") ? "reply" :
              notif.content.translationKey.endsWith(".CommentLiked") ? "comment" :
                notif.content.translationKey.endsWith(".SchoolLiked") ? "schoolComment" :
                  null;

            const origin = await fetchOrigin(originType, notif.originId);

            const display = await fetchUserDisplay(notif.content.data.userId)

            return {
              ...notif,
              origin: origin ? origin.substring(0, 30) : '',
              content: {
                ...notif.content,
                data: {
                  ...notif.content.data,
                  name: display.name,
                },
              },
            };
          } catch (error) {
            console.error('Error processing notification origin:', error);
            return {
              ...notif,
              origin: ''
            };
          }
        })
      );

      setNotifications(processedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('/api/notifications/unread/count');
      if (!res.ok) {
        throw new Error(`Failed to fetch unread count: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
      });
      if (!res.ok) {
        throw new Error(`Failed to mark as read: ${res.status} ${res.statusText}`);
      }

      setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, read: true } : n));
      setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  // New function to mark all notifications as read
  const markAllAsRead = async () => {
    // Loop through notifications and mark each unread one as read
    notifications.forEach(notification => {
      if (!notification.read) {
        markAsRead(notification._id);
      }
    });
  };

  useEffect(() => {
    if (session.status === 'authenticated') {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [session.status]);

  useEffect(() => {
    if (session.status === 'authenticated') {
      fetchPoints();
    }
  }, [session.status]);


  const handleClickOutside = (event) => {
    if (
      notificationModalRef.current &&
      !notificationModalRef.current.contains(event.target) &&
      !event.target.closest(`.${styles.notificationButton}`)
    ) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const handleButtonClick = (e, action) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }
    if (action) {
      action();
    }
  };

  const handleCompareClick = () => {
    setIsComparing(!isComparing);
    document.body.style.overflow = !isComparing ? 'hidden' : 'auto';
  };

  return (
    <>
      <header className={styles.navbar}>
        <div style={{ display: 'none' }}>{i18n.language}</div>
        <div className={styles.container}>
          <div className={styles["left-group"]}>
            <Link href="/" className={styles["home-button"]} onClick={(e) => handleButtonClick(e)}>
              <House className={styles.homeIcon} />
            </Link>
            {/*             <Link href="/astrarena" className={styles.rankingButton} onClick={(e) => handleButtonClick(e)}>
              <Ranking weight="duotone" className={styles.rankingIcon} />
              <p className={styles.now}>battle!</p>
              <p className={styles.play}>AstrArena</p>
            </Link> */}
            <SearchBar className={styles.searchbar} />

          </div>
          <div className={styles["right-group"]}>
            <CompareButton onClick={handleCompareClick} />
            {session.status == "authenticated" && (
              <>
                <button
                  className={styles.notificationButton}
                  onClick={(e) => handleButtonClick(e, toggleNotifications)}
                >
                  {/* Added a span here for the badge */}
                  {unreadCount > 0 ? (
                    <p className={styles.unreadnumber}>
                      {unreadCount}
                    </p>
                  ) : null}
                  {unreadCount > 0 ? (
                    <BellRing className={styles.Bell} />
                  ) : (
                    <Bell className={styles.Bell} />
                  )}
                </button>
                <div
                  className={`${styles.notificationModal} ${showNotifications ? styles.show : ''}`}
                  ref={notificationModalRef}
                >
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className={styles.readAllButton}>
                      {t("Notification.markAllRead")}
                    </button>
                  )}
                  {loading ? (
                    <div className={styles.notificationItem}>
                      <p>{t("signup.loading")}</p>
                    </div>
                  ) :
                    notifications && notifications.length > 0
                      ? notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`${styles.notificationItem} ${notification.read ? styles.read : styles.unread
                            }`}
                        >
                          <div className={styles.notificationHeader}>
                            <p>
                              {typeof notification.content === 'object'
                                ? t(notification.content.translationKey, notification.content.data)
                                : notification.type
                              }
                            </p>
                            <p className={styles.CommentPreview}>
                              &quot;{notification.origin?.substring(0, 30) || ''} ...&quot;
                            </p>
                            <small className={styles.notificationTimestamp}>
                              {new Date(notification.createdAt).toLocaleString()}
                            </small>
                            <div className={styles.markAsReadButton}>
                              {!notification.read && (
                                <div className={styles.markAsReadButton}>
                                  <button onClick={() => markAsRead(notification._id)} className={styles.markAsReadButton}>
                                    <CheckCircle weight="duotone" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                      : (
                        <div className={styles.notificationItem}>
                          <p>{t("Notification.empty")}</p>
                        </div>
                      )}
                </div>
              </>
            )}
            <div className={styles['signout']}>
              <SignOut
                navbar
                icon={CircleUserRound}
              />
              {session.status == "authenticated" && (
                <>
                  <Link href="/points" target="_blank" rel="noopener noreferrer">
                    <span className={styles['points-badge']}>
                      {points}
                      <PiggyBank weight="duotone" className={styles['points-icon']} />
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header >
      {isComparing && createPortal(
        <div className={styles.splitContainer}>
          <div className={`${styles.splitView} ${styles.left}`}>
            <iframe src="/" style={{ width: '100%', height: '100%', border: 'none' }} />
          </div>
          <div className={`${styles.splitView} ${styles.right}`}>
            <iframe src="/" style={{ width: '100%', height: '100%', border: 'none' }} />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

'use client'
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from 'next/link';
import SignOutButton from "../components/SignOutButton";
import SaveBar from "./SaveBar";
import styles from '../profile/Style.module.css';
import { ChromePicker } from 'react-color';
import { ToastContainer, toast } from 'react-toastify';
import TeacherRatingModal from "../[schoolId]/teachers/TeacherRatingModal";
import { CaretCircleDown } from "@phosphor-icons/react";
import { User, Palette, Lock, Undo2, LogOut, LoaderCircle, Camera, ChevronDown, MessageSquareText, Pencil, Trash2 } from 'lucide-react';
import { createPortal } from "react-dom";
import { PiggyBank } from "@phosphor-icons/react";
import BadgeIcon from '../profile/badges/BadgeIcon';
import BadgeModal from '../profile/badges/BadgeModal';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Image from "next/image";
import './ToastCustom.css';
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Tooltip from '../components/Tooltip';
import Footer from "../components/footer";
import { CustomToggle } from "../components/inputs"
import { useTranslation } from 'react-i18next';
import { Notepad, Rows, ArrowSquareOut } from '@phosphor-icons/react';

const getBackgroundStyle = (settings) => {
  if (settings.gradientEndColor !== null) {
    return {
      background: `linear-gradient(to right, ${settings.backgroundColor}, ${settings.gradientEndColor})`,
      backgroundSize: '400% 400%',
      animation: 'fluide 16s ease infinite'
    };
  }

  if (settings.backgroundColor) {
    return { background: settings.backgroundColor };
  }

  return {
    background: 'linear-gradient(135deg, #4568DC, #B06AB3, #4568DC)',
    backgroundSize: '400% 400%',
    animation: 'fluide 16s ease infinite'
  };
};

function useToastManager() {
  const isToastActive = useRef(false);

  const showToast = useCallback((type, message, options = {}) => {
    if (!isToastActive.current) {
      isToastActive.current = true;
      toast[type](message, {
        ...options,
        onClose: () => {
          isToastActive.current = false;
          if (options.onClose) options.onClose();
        }
      });
    }
  }, []);

  return showToast;
}

export default function Profile() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      return redirect("/");
    }
  });
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const defaultImage = "/images/Default-user-image.png";
  const presetBackgrounds = {
    Buildings: "/images/Buildings.jpg",
    Island: "/images/Comment.jpg",
    Mountains: "/images/All-comments.jpg",
    Ocean: "/images/Ocean.jpg",
  };
  const [mounted, setMounted] = useState(false);
  const [showSaveBar, setShowSaveBar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("Profile");
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useToastManager();
  const [expandedCommentIndex, setExpandedCommentIndex] = useState(null);
  const { t } = useTranslation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [points, setPoints] = useState(0);

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

  useEffect(() => {
    if (session.status === 'authenticated') {
      fetchPoints();
    }
  }, [session.status]);

  function getRandomMessage(messages) {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }

  const handleDelete = async (comment) => {
    const deleteMessages = t('Profile.deleteMessages', { returnObjects: true });
    const query = comment.comment?.substring(0, 20) + '...'; // Get first 20 chars of comment
    const message = getRandomMessage(deleteMessages).replace('{query}', query);

    setDeleteMessage(message); // Set the random message in the state
    setSelectedComment(comment);
    setShowDeleteDialog(true); // Show the delete confirmation modal
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch('/api/teachers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherId: selectedComment.teacherId,
          deleteComment: true
        }),
      });

      if (response.ok) {
        fetchComments(); // Your existing function to refresh comments
        setShowDeleteDialog(false);
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };


  const handleModify = async (comment) => {
    setSelectedComment(comment);
    setShowModifyModal(true);
  };

  const toggleComment = (commentIndex) => {
    setExpandedCommentIndex((prevIndex) =>
      prevIndex === commentIndex ? null : commentIndex
    );
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const defaultSettings =
  {
    name: '',
    lastUsernameUpdate: null,
    profileDescription: '',
    profilePicture: null,
    profilePictureFile: null,
    selectedTheme: 'light',
    backgroundColor: null,
    gradientEndColor: null,
    backgroundImage: null,
    notificationsEnabled: true,
    profileVisibility: 'public',
    allowDirectMessages: true,
    showProfileInSearch: true,
    badges: { owned: [], current: null },
    customCursor: true
  }

  const [settings, setSettings] = useState(defaultSettings);
  const [originalProfile, setOriginalProfile] = useState(defaultSettings);

  const fetchComments = useCallback(async () => {
    if (session.status !== 'authenticated') return;

    setCommentsLoading(true);

    try {
      const res = await fetch(`/api/comments?aid=${session?.data?.user?.id}`);
      if (!res.ok) {
        console.error(`Failed to fetch comments: ${res.status} - ${res.statusText}`);
        setComments([]); // Set to empty array in case of error
        return;
      }
      const data = await res.json();
      console.log("Comments data:", data); // Log the initial comments data
      if (!data || !data.dbResults) {
        console.error("Invalid data structure (dbResults does not exist)", data);
        setComments([]); // Set to empty array in case of error
        return;
      }

      if (!Array.isArray(data.dbResults)) {
        console.error("Invalid data structure (dbResults is not an array)", data);
        setComments([]); // Set to empty array in case of error
        return;
      }

      const commentsWithTeacherNames = await Promise.all(
        data.dbResults.map(async (comment) => {
          try {
            const teacherId = comment.teacherId
            console.log("Fetching teacher with ID:", teacherId);
            const teacherRes = await fetch(`/api/teachers?tid=${teacherId}`);
            if (!teacherRes.ok) {
              console.error(`Failed to fetch user details for id ${teacherId}:`, teacherRes.status, teacherRes.statusText);
              return {
                ...comment,
                teacherName: 'Unknown Teacher',
              };
            }
            const teacherData = await teacherRes.json();
            // console.log(`Teacher name for ID ${teacherId}:`, teacherData);
            return {
              ...comment,
              teacherName: teacherData.dbResults.name || 'Unknown Teacher',
            };
          } catch (error) {
            console.error("Error fetching teacher data:", error);
            return {
              ...comment,
              teacherName: 'Unknown Teacher',
            };
          }
        })
      );
      setComments(commentsWithTeacherNames);

    } catch (error) {
      console.error("Error in fetchComments:", error);
      setComments([]); // Set to empty array in case of error

    } finally {
      setCommentsLoading(false);
    }
  }, [session.data]);

  useEffect(() => {
    async function fetchUserData() {
      if (session.status === "authenticated") {
        const response = await fetch(`/api/user`);
        if (response.ok) {
          const userData = await response.json();
          const fetchedSettings = {
            name: userData?.name,
            lastUsernameUpdate: userData?.lastUsernameUpdate ? new Date(userData.lastUsernameUpdate) : null,
            profileDescription: userData?.profileDescription,
            profilePicture: userData?.profilePicture,
            profilePictureFile: null,
            selectedTheme: userData?.appearence?.selectedTheme ?? 'light',
            backgroundColor: userData?.appearence?.backgroundColor,
            gradientEndColor: userData?.appearence?.gradientEndColor,
            backgroundImage: userData?.appearence?.backgroundImage,
            notificationsEnabled: userData?.privacySettings?.notificationsEnabled ?? true,
            profileVisibility: userData?.privacySettings?.profileVisibility ?? 'public',
            allowDirectMessages: userData?.privacySettings?.allowDirectMessages ?? true,
            showProfileInSearch: userData?.privacySettings?.showProfileInSearch ?? true,
            badges: userData?.badges || { owned: [], current: null },
            customCursor: userData?.appearence?.customCursor ?? true
          }

          setOriginalProfile(fetchedSettings);
          setSettings(fetchedSettings);
          setIsLoading(false);

          // Remove default background from body (if it was applied)
          document.body.style.background = '';
          document.body.style.backgroundSize = '';
          document.body.style.animation = '';

        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      }
    }

    fetchUserData();
  }, [session.status, session.data?.user?.name]);

  const teacherNameCache = {}

  const getTeacherName = async (teacherId) => {
    if (!teacherId) {
      console.error("Invalid teacherId");
      return null;
    }

    if (teacherId in teacherNameCache) {
      return teacherNameCache[teacherId];
    }

    if (session.status === "authenticated") {
      const response = await fetch(`/api/teachers?tid=${teacherId}`);
      if (response.ok) {
        const data = await response.json();

        const teacherName = data.dbResults.name;

        teacherNameCache[teacherId] = teacherName

        return teacherName;

      } else {
        console.error("Failed to fetch user data:", response.statusText);
      }
    }
  }

  const handleInputChange = (field, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [field]: value,
    }));
    setShowSaveBar(true);
  };

  const handleThemeChange = (theme) => {
    handleInputChange("selectedTheme", theme);
    handleInputChange("gradientEndColor", null)
    handleInputChange("backgroundImage", null)
    handleInputChange("backgroundColor", null)

    document.body.classList.remove("light-theme", "dark-theme", "custom-theme");
    document.body.classList.add(`${theme}-theme`);
  };

  const handleUsernameChange = (event) => {
    if (event.target.value.length <= 20) {
      handleInputChange("name", event.target.value);
    }
  };

  const handleProfileDescriptionChange = (event) => {
    if (event.target.value.length <= 200) {
      handleInputChange("profileDescription", event.target.value);
    }
  };

  /* const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        showToast('warn', 'Please upload a JPG or PNG image.');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        showToast('warn', 'File is too big. Please choose an image under 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange("profilePicture", e.target.result);
        setSettings((prevSettings) => ({
          ...prevSettings,
          profilePictureFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  }; */

  const handleCustomColorChange = (color) => {
    handleInputChange("backgroundColor", color.hex);
    handleInputChange("backgroundImage", null);
    document.body.style.background = color.hex;
  };

  const handleGradientToggle = () => {
    const newShowGradientBackground = !(settings.gradientEndColor !== null);
    handleInputChange("gradientEndColor", newShowGradientBackground ? "#fff" : null);

    if (newShowGradientBackground) {
      document.body.style.background = `linear-gradient(to right, ${settings.backgroundColor}, ${settings.gradientEndColor})`;
    }
  };

  const handleGradientColorChange = (which, color) => {
    handleInputChange(which === "start" ? "backgroundColor" : "gradientEndColor", color.hex);
    if (which === "end" && settings.backgroundColor == null) {
      handleInputChange("backgroundColor", "#fff");
    }
    document.body.style.background = `linear-gradient(to right, ${settings.backgroundColor}, ${settings.gradientEndColor})`;
  };

  const handleBadgeSelect = async (badge) => {
    try {
      if (badge) {
        setSettings(prevProfile => ({
          ...prevProfile,
          badges: {
            owned: settings.badges.owned,
            current: badge.id
          }
        }));
        setShowSaveBar(true);
      } else {
        console.error('Failed to save badge:', await response.json());
        showToast('error', t("Profile.saveprofile"));
      }
    } catch (error) {
      console.error('Error saving badge:', error);
      showToast('error', t("Profile.savebadge"));
    } finally {
      setShowBadgeModal(false);
    }
  };

  const handleDefaultClick = () => {
    handleInputChange("selectedTheme", 'custom');
    handleInputChange("gradientEndColor", null)
    handleInputChange("backgroundImage", null)
    handleInputChange("backgroundColor", null)
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);

    if (section == "Comments") {
      fetchComments()
    }
  };

  const selectBadge = async (badgeId) => {
    try {
      const response = await fetch('/api/user/badge', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ badgeId }),
      });

      if (!response.ok) {
        console.error('Failed to save badge:', await response.json());
      }
    } catch (error) {
      console.error('Error saving badge:', error);
    }
  }

  const saveProfile = async (e) => {
    if (isSaving) return;

    const now = new Date();
    const cooldownTime = 7 * 24 * 60 * 60 * 1000;

    // Check username cooldown
    if (settings.name !== originalProfile.name && settings.lastUsernameUpdate &&
        (now - new Date(settings.lastUsernameUpdate)) < cooldownTime) {
        const timeRemaining = cooldownTime - (now - new Date(settings.lastUsernameUpdate));
        const daysRemaining = Math.ceil(timeRemaining / (24 * 3600 * 1000));
        showToast('warn', t('Profile.username_update_wait_days', { daysRemaining: daysRemaining }));
        return;
    }

    setIsSaving(true);

    try {
        const dataToSend = {
            name: settings.name,
            profileDescription: settings.profileDescription,
            profilePicture: settings.profilePicture,
            selectedTheme: settings.selectedTheme,
            backgroundColor: settings.backgroundColor,
            gradientEndColor: settings.gradientEndColor,
            backgroundImage: settings.backgroundImage,
            profileVisibility: settings.profileVisibility,
            allowDirectMessages: settings.allowDirectMessages,
            showProfileInSearch: settings.showProfileInSearch,
            notificationsEnabled: settings.notificationsEnabled,
            customCursor: settings.customCursor
        };

        const response = await fetch('/api/user', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            throw new Error('Failed to save profile');
        }

        const updatedUser = await response.json();

        // Update the original profile with the new data including the new lastUsernameUpdate
        setOriginalProfile({
            ...dataToSend,
            lastUsernameUpdate: updatedUser.lastUsernameUpdate,
            badges: originalProfile.badges,
        });

        // Update settings with new lastUsernameUpdate
        setSettings(prev => ({
            ...prev,
            lastUsernameUpdate: updatedUser.lastUsernameUpdate
        }));

        if (settings.badges.current !== null) {
            await selectBadge(settings.badges.current);
        }

        showToast('success', t("Profile.profile_updated"));
        setShowSaveBar(false);
    } catch (error) {
        console.error('Error saving profile:', error);
        showToast('error', t("Profile.profile_updated_error"));
    } finally {
        setIsSaving(false);
    }
};

  const resetProfile = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...originalProfile
    }));

    setShowSaveBar(false);
  };

  const handleUndo = () => {
    window.history.back();
  }
  const profileContainerClasses = `${styles['profile-container']} ${styles[`${settings.selectedTheme}-theme`]} ${settings.backgroundImage || settings.backgroundColor || settings.gradientEndColor ? "" : styles['profile-background']}`; return (
    <div className={profileContainerClasses}>
      <div className={styles['profile-background']}></div>
      <button className={styles['undo-button']} onClick={handleUndo}>
        <Undo2 size={24} />
      </button>
      <div className={styles['profile-sidebar']}>
        <Tooltip text="Profile">
          <button
            onClick={() => handleSectionClick("Profile")}
            className={activeSection === "Profile" ? styles.active : ""}
          >
            <User className={styles['profile-icons']} />
          </button>
        </Tooltip>
        <Tooltip text="Appearance">
          <button
            onClick={() => handleSectionClick("Appearance")}
            className={activeSection === "Appearance" ? styles.active : ""}
          >
            <Palette className={styles['profile-icons']} />
          </button>
        </Tooltip>
        <Tooltip text="Privacy">
          <button
            onClick={() => handleSectionClick("Privacy")}
            className={activeSection === "Privacy" ? styles.active : ""}
          >
            <Lock className={styles['profile-icons']} />
          </button>
        </Tooltip>
        <Tooltip text="Comments">
          <button
            onClick={() => handleSectionClick("Comments")}
            className={activeSection === "Comments" ? styles.active : ""}
          >
            <MessageSquareText className={styles['profile-icons']} />
          </button>
        </Tooltip>
      </div>
      <div className={styles['profile-content']}>
        <div className={styles['glassmorphism-container']}>
          {isLoading ? (
            <div className={styles.loaderContainer}>
              <h2><LoaderCircle className={styles.loadingIcon} />{t("Profile.loading")}</h2>
            </div>
          ) : (
            <>
              {activeSection === "Profile" && (
                <div>
                  <div className={styles['profile-header']}>
                    <div>
                      <div className={styles['profile-image-container']}>
                        <Image
                          width={100}
                          height={100}
                          src={settings.profilePicture || defaultImage}
                          alt="Profile"
                          className={styles['profile-image']}
                        />
                        {/* isImageHovered && (
                                <div
                                  className="camera-overlay"
                                  onClick={() => fileInputRef.current.click()}
                                >
                                  <Camera size={24} className="text-white" />
                                </div>
                              ) */}
                        <BadgeIcon
                          onClick={() => setShowBadgeModal(true)}
                          activeBadge={settings?.badges?.owned.includes(settings?.badges?.current) && settings?.badges?.current}
                        />
                        <Link href="/points" target="_blank" rel="noopener noreferrer">
                          <button className={styles['points-badge']} target="_blank" rel="noopener noreferrer">
                            <span>{points}</span>
                            <PiggyBank weight="duotone" className={styles['points-icon']} />
                          </button>
                        </Link>

                      </div>
                      {/* <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.gif"
                              ref={fileInputRef}
                              onChange={handleImageUpload}
                              style={{ display: 'none' }}
                            /> */}
                    </div>
                    <div className={styles['username-section']}>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={handleUsernameChange}
                        placeholder={t("Profile.placeholder.username")}
                        maxLength={20}
                      />
                      <span className={styles['character-count']}>{settings.name.length}/20</span>
                    </div>
                  </div>
                  <div className={styles['profile-description']}>
                    <textarea
                      value={settings.profileDescription}
                      onChange={handleProfileDescriptionChange}
                      placeholder={t("Profile.placeholder.description")}
                      maxLength={200}
                    />
                    <span className={styles['character-count']}>{settings.profileDescription.length}/200</span>
                  </div>
                  <LanguageSwitcher />
                  <Link href="/articles" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} className={styles.articlesButton} onClick={(e) => handleButtonClick(e)}>
                    <Notepad className={styles.articlesIcon} /><span>Articles</span><ArrowSquareOut weight="bold" />
                  </Link>
                  <Link href="/ChangeLog" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} className={styles.changelogButton} onClick={(e) => handleButtonClick(e)}>
                    <Rows className={styles.changelogIcon} /><span>Changelog</span><ArrowSquareOut weight="bold" />
                  </Link>
                  <div className={styles['profile-sections']}>
                    <SignOutButton icon={LogOut} />
                  </div>
                </div>
              )}

              {activeSection === "Appearance" && (
                <div className={styles['appearance-section']}>
                  <h2>{t("Profile.appearance")}</h2>

                  <div className={styles['privacy-setting']}>
                    <label htmlFor="customCursor">{t("Profile.customCursor")}</label>
                    <CustomToggle
                      id="customCursor"
                      checked={settings.customCursor}
                      onChange={(e) => handleInputChange("customCursor", e.target.checked)}
                    />
                  </div>

                  <button
                    className={styles['color-button-light']}
                    onClick={() => handleThemeChange("light")}
                  />
                  <button
                    className={styles['color-button-dark']}
                    onClick={() => handleThemeChange("dark")}
                  />
                  <button
                    className={`${styles['color-button-custom']} ${settings.selectedTheme == "custom" ? styles.active : ''}`}
                    onClick={() => handleThemeChange("custom")}
                  />
                  {settings.selectedTheme == "custom" && (
                    <>
                      <ChromePicker
                        className={styles['chrome-picker']}
                        color={settings?.backgroundColor || "#fff"}
                        onChange={(color) => {
                          settings.gradientEndColor == null ?
                            handleCustomColorChange(color) :
                            handleGradientColorChange('start', color)
                        }}
                      />

                      <div className={styles['appearance-gradient']}>
                        <label htmlFor="gradientToggle">{t("Profile.gradient.use_gradient")}</label>
                        <CustomToggle
                          id="gradientToggle"
                          checked={settings.gradientEndColor !== null}
                          onChange={handleGradientToggle}
                        />
                      </div>

                      {settings.gradientEndColor !== null && (
                        <div>
                          <p>{t("Profile.gradient.gradient")}</p>
                          <ChromePicker
                            className={styles['chrome-picker']}
                            color={settings?.gradientEndColor || "#fff"}
                            onChange={(color) => handleGradientColorChange('end', color)} />
                        </div>
                      )}

                      <div className={styles['profile-buttons-background']}>
                        <div>
                          <label>{t("Profile.bgs")}</label>
                          {Object.keys(presetBackgrounds).map((imageName) => (
                            <button key={imageName} onClick={() => handleInputChange("backgroundImage", imageName)}><p>{imageName}</p></button>
                          ))}
                        </div>
                      </div>

                      <div className={styles['background-image-tabs']}>
                        <button onClick={() => handleDefaultClick()} className={styles.active}><p>{t("Profile.default")}</p></button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeSection === "Privacy" && (
                <div className={styles['privacy-section']}>
                  <h2>{t("Profile.privacy")}</h2>
                  <div className={styles['privacy-setting']}>
                    <label htmlFor="profileVisibility">{t("Profile.visibility")}</label>
                    <select
                      id="profileVisibility"
                      name="profileVisibility"
                      value={settings.profileVisibility}
                      onChange={(e) => handleInputChange("profileVisibility", e.target.value)}
                      className={styles['custom-select']} // Add your custom styling class here
                    >
                      <option value="public"><span>{t("Profile.options.public")}</span></option>
                      <option value="private"><span>{t("Profile.options.private")}</span></option>
                      <option value="friends"><span>{t("Profile.options.friends_only")}</span></option>
                    </select>
                  </div>
                  <div className={styles['privacy-setting']}>
                    <label htmlFor="directMessages">{t("Profile.messages.direct_message")}</label>
                    <CustomToggle
                      id="directMessages"
                      checked={settings.allowDirectMessages}
                      onChange={(e) => handleInputChange("allowDirectMessages", e.target.checked)}
                    />
                  </div>

                  <div className={styles['privacy-setting']}>
                    <label htmlFor="searchVisibility">{t("Profile.messages.search_result")}</label>
                    <CustomToggle
                      id="searchVisibility"
                      checked={settings.showProfileInSearch}
                      onChange={(e) => handleInputChange("showProfileInSearch", e.target.checked)}
                    />
                  </div>
                  <Footer />
                </div>
              )}

              {activeSection === "Comments" && (
                <div>
                  {commentsLoading ? (
                    <div className={styles.loaderContainer}>
                      <h2><LoaderCircle className={styles.loadingIcon} /> {t("Profile.comments.gathering")}</h2>
                    </div>
                  ) : comments.length === 0 ? (
                    <h2>{t("Profile.comments.title")}</h2>
                  ) : (
                    comments.map((comment, commentIndex) => (
                      <div
                        key={comment._id || commentIndex}
                        className={`${styles["comment-container"]} ${expandedCommentIndex === commentIndex ? styles.expanded : ""
                          }`}
                      >
                        <div className={styles["comment-rating-number"]}>
                          {comment.overallRating}
                        </div>
                        <div key={commentIndex} className={styles['comment-organise']}>
                          <div className={styles["comment-main"]}>
                            <div className={styles["comment-display"]}>
                              <div className={styles["comment-teacher-name"]}>
                                {comment.teacherName}
                              </div>
                              {comment.comment || (
                                <span className={styles["comment-no-comment"]}>
                                  {t("Profile.comments.no_comment")}
                                </span>
                              )}
                            </div>
                            <div className={styles["comment-actions"]}>
                              <Tooltip text="Modify">
                                <Pencil
                                  className={styles["comment-action-icon"]}
                                  onClick={() => handleModify(comment)}
                                />
                              </Tooltip>
                              <Tooltip text="Delete">
                                <Trash2
                                  className={styles["comment-action-icon"]}
                                  onClick={() => handleDelete(comment)}
                                />
                              </Tooltip>
                              <Tooltip text="Expand">
                                <CaretCircleDown
                                  className={styles["comment-expand-icon"]}
                                  onClick={() => toggleComment(commentIndex)}
                                />
                              </Tooltip>
                            </div>
                          </div>
                          <div
                            className={`${styles["comment-criteria-details"]} ${expandedCommentIndex === commentIndex ? styles.expanded : ""}`}
                          >
                            <p>
                              {t("ratingCriteria.Teaching Quality.name")}:{" "}
                              {comment.teachingQuality}
                            </p>
                            <p>
                              {t("ratingCriteria.Engagement.name")}: {comment.engagement}
                            </p>
                            <p>
                              {t("ratingCriteria.Fairness.name")}: {comment.fairness}
                            </p>
                            <p>
                              {t("ratingCriteria.Support.name")}: {comment.support}
                            </p>
                            <p>
                              {t("ratingCriteria.Ease.name")}: {comment.ease}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {mounted && createPortal(
          <SaveBar
            showSaveBar={showSaveBar}
            resetClick={resetProfile}
            saveClick={saveProfile}
            originalProfile={originalProfile}
            settings={settings}
          />,
          document.body
        )}

        {mounted && showBadgeModal && createPortal(
          <BadgeModal
            onClose={() => setShowBadgeModal(false)}
            onSelectBadge={handleBadgeSelect}
            badges={originalProfile.badges.owned}
          />,
          document.body
        )}

        {showDeleteDialog && createPortal(
          <div className={styles.overlay}>
            <DeleteConfirmationModal
              isOpen={showDeleteDialog}
              onClose={handleCancelDelete}
              onConfirm={handleConfirmDelete}
              message={deleteMessage}
            />
          </div>,
          document.body
        )}

        {showModifyModal && selectedComment && createPortal(
          <TeacherRatingModal
            isOpen={showModifyModal}
            onClose={() => setShowModifyModal(false)}
            teacher={{ _id: selectedComment.teacherId, name: selectedComment.teacherName }}
            initialRating={{
              teachingQuality: selectedComment.teachingQuality,
              engagement: selectedComment.engagement,
              fairness: selectedComment.fairness,
              support: selectedComment.support,
              ease: selectedComment.ease
            }}
            initialComment={selectedComment.comment}
          />,
          document.body
        )}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnBottom
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme={settings.selectedTheme === 'dark' ? 'dark' : 'light'}
        />
      </div>
    </div>
  );
}
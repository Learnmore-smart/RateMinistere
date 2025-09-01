"use client";
import React, { useState, useEffect } from "react";
import styles from './admin.module.css';
import { getSubjects } from "../utils/subjectUtils";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useSession } from "next-auth/react";
import NotFound from "@/app/not-found";
import { ToastContainer, toast } from 'react-toastify';
import '../profile/ToastCustom.css';

const AdminPage = () => {
    const subjectList = getSubjects('en')
    const { t } = useTranslation();

    const admins = [
        "kendrick.nguyen.huu@gmail.com", "noahzh52@gmail.com"
    ]

    const session = useSession({
        required: true,
        onUnauthenticated() {
            return (<NotFound />)
        }
    })

    const [teachers, setTeachers] = useState([
        {
            name: "",
            role: "",
            schoolId: "",
        }
    ]);

    const [school, setSchool] = useState({
        name: "",
        location: ""
    });

    const [schoolList, setSchoolList] = useState([]);
    const [teacherMessage, setTeacherMessage] = useState("");
    const [schoolMessage, setSchoolMessage] = useState("");

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const response = await fetch('/api/schools');
                const data = await response.json();
                const sortedSchools = data.dbResults.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                setSchoolList(sortedSchools);
            } catch (error) {
                console.error("Error fetching schools:", error);
            }
        };

        fetchSchools();
    }, []);

    const handleTeacherChange = (index, e) => {
        const { name, value } = e.target;
        const updatedTeachers = [...teachers];
        updatedTeachers[index] = { ...updatedTeachers[index], [name]: value };
        setTeachers(updatedTeachers);
    };

    const handleSchoolChange = (e) => {
        const { name, value } = e.target;
        setSchool((prev) => ({ ...prev, [name]: value }));
    };

    const addTeacherField = () => {
        setTeachers([...teachers, { name: "", role: "", schoolId: "" }]);
    };

    const removeTeacherField = (index) => {
        if (teachers.length > 1) {
            const updatedTeachers = [...teachers];
            updatedTeachers.splice(index, 1);
            setTeachers(updatedTeachers);
        }
    };

    const addTeachers = async (e) => {
        e.preventDefault();

        // Validate all teacher entries have required fields
        const invalidTeachers = teachers.filter(teacher =>
            !teacher.name || !teacher.role || !teacher.schoolId
        );

        if (invalidTeachers.length > 0) {
            toast.error("Please fill out all fields for each teacher", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        try {
            // Add each teacher sequentially
            let successCount = 0;

            for (const teacher of teachers) {
                const response = await fetch('/api/teachers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(teacher),
                });

                if (response.ok) {
                    successCount++;
                } else {
                    const data = await response.json();
                    toast.error(`Failed to add teacher ${teacher.name}: ${data.message || "Unknown error"}`, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            }

            if (successCount > 0) {
                toast.success(`${successCount} teacher${successCount > 1 ? 's' : ''} added successfully!`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                // Reset the form with a single empty teacher
                setTeachers([{ name: "", role: "", schoolId: "" }]);
            }
        } catch (error) {
            toast.error("An error occurred while adding teachers.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const addSchool = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/schools', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(school),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("School added successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setSchool({ name: "", location: "" });

                // Refresh school list
                const schoolsResponse = await fetch('/api/schools');
                const schoolsData = await schoolsResponse.json();
                const sortedSchools = schoolsData.dbResults.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                setSchoolList(sortedSchools);
            } else {
                toast.error(data.message || "Failed to add school", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            toast.error("An error occurred while adding the school.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };


    if (session.status == "authenticated" && admins.includes(session.data.user.email)) {
        return (
            <div className={styles.adminContainer}>
                <ToastContainer />
                <div className={styles.adminHeader}>
                    <LanguageSwitcher />
                </div>

                <div className={styles.adminSection}>
                    <h1>{t('AdminPage.addTeacher')}</h1>
                    <form
                        className={styles.adminForm}
                        onSubmit={addTeachers}
                    >
                        {teachers.map((teacher, index) => (
                            <div key={index} className={styles.teacherEntryContainer}>
                                <div className={styles.formGroup}>
                                    <input
                                        className={styles.adminInput}
                                        type="text"
                                        name="name"
                                        placeholder="Teacher Name"
                                        value={teacher.name}
                                        onChange={(e) => handleTeacherChange(index, e)}
                                        required
                                    />
                                    <select
                                        className={styles.adminSelect}
                                        name="schoolId"
                                        value={teacher.schoolId}
                                        onChange={(e) => handleTeacherChange(index, e)}
                                        required
                                    >
                                        <option value="">{t('AdminPage.selectSchool')}</option>
                                        {schoolList.map((school) => (
                                            <option
                                                key={school._id}
                                                value={school.schoolId}
                                            >
                                                {school.name} ({school.geolocation})
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className={styles.adminSelect}
                                        name="role"
                                        value={teacher.role}
                                        onChange={(e) => handleTeacherChange(index, e)}
                                        required
                                    >
                                        <option value="">{t('AdminPage.selectSubject')}</option>
                                        {subjectList.map((subject) => (
                                            <option key={subject} value={subject}>
                                                {subject}
                                            </option>
                                        ))}
                                    </select>
                                    {teachers.length > 1 && (
                                        <button
                                            type="button"
                                            className={styles.removeButton}
                                            onClick={() => removeTeacherField(index)}
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>
                                {index === teachers.length - 1 && (
                                    <div className={styles.teacherActionsContainer}>
                                        <button
                                            type="button"
                                            className={styles.addTeacherButton}
                                            onClick={addTeacherField}
                                        >
                                            + Add Another Teacher
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className={styles.submitContainer}>
                            <button
                                className={styles.adminSubmitButton}
                                type="submit"
                            >
                                <p>{teachers.length > 1 ? t('AdminPage.addTeachers') : t('AdminPage.addTeacher')}</p>
                            </button>
                        </div>
                        {teacherMessage && (
                            <p className={styles.adminMessage}>
                                {teacherMessage}
                            </p>
                        )}
                    </form>
                </div>

                <div className={styles.adminSection}>
                    <h1>{t('AdminPage.addSchool')}</h1>
                    <form
                        className={styles.adminForm}
                        onSubmit={addSchool}
                    >
                        <div className={styles.formGroup}>
                            <input
                                className={styles.adminInput}
                                type="text"
                                name="name"
                                placeholder="School Name"
                                value={school.name}
                                onChange={handleSchoolChange}
                                required
                            />
                            <input
                                className={styles.adminInput}
                                type="text"
                                name="location"
                                placeholder="Location"
                                value={school.location}
                                onChange={handleSchoolChange}
                                required
                            />
                            <button
                                className={styles.adminSubmitButton}
                                type="submit"
                            >
                                <p>{t('AdminPage.addSchool')}</p>
                            </button>
                        </div>
                        {schoolMessage && (
                            <p className={styles.adminMessage}>
                                {schoolMessage}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        );
    } else {
        return (<NotFound />)
    };
};

export default AdminPage;
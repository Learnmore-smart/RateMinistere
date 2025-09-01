// src/app/components/ProgressBar/ProgressBar.js
'use client';
import React, { useState, useEffect, useId } from 'react';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ totalQuestions, onComplete, isCorrect }) => { // Add props
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [progress, setProgress] = useState(0);
  const [questionsLeft, setQuestionsLeft] = useState(totalQuestions); // Track questions remaining
  const baseId = useId();


  // --- Update Progress ---
  useEffect(() => {
    if (totalQuestions <= 0) {
      setProgress(0);
      return;
    }

    if (questionsLeft <= 0) {
      if (correctAnswers === totalQuestions) {
        setProgress(100);
        onComplete && onComplete(true);
      } else {
        onComplete && onComplete(false);
      }
      return; // Prevent further calculations
    }


    let newProgress = 0;
    if (isCorrect === true) {
      setCorrectAnswers((prev) => prev + 1);
      newProgress = ((correctAnswers + 1) / totalQuestions) * 100; // +1 for the current correct answer
    } else if (isCorrect === false) {
      // Apply a 3% penalty, but don't go below 0
      newProgress = Math.max(0, progress - (progress * 0.03));
    } else {
      newProgress = progress; // No change if isCorrect is null (initial state)
    }

    setProgress(newProgress);

    // Only decrement questionsLeft if isCorrect is not null
    if (isCorrect !== null) {
      setQuestionsLeft((prev) => prev - 1);
    }

  }, [isCorrect, totalQuestions, correctAnswers, progress, questionsLeft, onComplete]);



  return (
    <div className={styles.container}>
      <div className={styles.transparentbar} />
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
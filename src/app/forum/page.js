'use client';
import React, { useState } from 'react';
import styles from './ForumPage.module.css';

const ForumPage = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newReply, setNewReply] = useState({});
  const [replies, setReplies] = useState({});

  const submitQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const question = {
      id: Date.now(),
      text: newQuestion,
      author: 'Anonymous Student',
      timestamp: new Date(),
      ratings: {},
    };

    setQuestions([question, ...questions]);
    setNewQuestion('');
  };

  const submitReply = (questionId) => {
    if (!newReply[questionId]?.trim()) return;

    setReplies((prev) => ({
      ...prev,
      [questionId]: [...(prev[questionId] || []), { text: newReply[questionId], author: 'Anonymous' }],
    }));
    setNewReply((prev) => ({ ...prev, [questionId]: '' }));
  };

  const getCircleColor = (position) => {
    switch (position) {
      case 1:
        return styles['circle-red'];
      case 2:
        return styles['circle-orange'];
      case 3:
        return styles['circle-yellow'];
      case 4:
        return styles['circle-green'];
      case 5:
        return styles['circle-blue'];
      default:
        return '';
    }
  };

  return (
    <div className={styles.forumContainer}>
      <h1 className={styles.pageTitle}>Student Success Forum</h1>
      <form onSubmit={submitQuestion} className={styles.questionForm}>
        <textarea
          placeholder="Ask a study-related question..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className={styles.questionInput}
          required
        />
        <button type="submit" className={styles.submitQuestionButton}>
          Post Question
        </button>
      </form>

      <div className={styles.questionsContainer}>
        {questions.map((question) => (
          <div key={question.id} className={styles.questionCard}>
            <div className={styles.questionHeader}>
              <span>{question.author}</span>
              <span>{question.timestamp.toLocaleString()}</span>
            </div>
            <p className={styles.questionText}>{question.text}</p>

            <div className={styles.repliesSection}>
              {(replies[question.id] || []).map((reply, index) => (
                <div key={index} className={styles.reply}>
                  <strong>{reply.author}:</strong> {reply.text}
                </div>
              ))}
              <textarea
                placeholder="Write a reply..."
                value={newReply[question.id] || ''}
                onChange={(e) =>
                  setNewReply((prev) => ({ ...prev, [question.id]: e.target.value }))
                }
                className={styles.replyInput}
              />
              <button
                onClick={() => submitReply(question.id)}
                className={styles.submitReplyButton}
              >
                Reply
              </button>
            </div>

            <div className={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((circle) => (
                <button
                  key={circle}
                  className={`${styles.circleButton} ${getCircleColor(circle)}`}
                  aria-label={`Rate ${circle}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumPage;
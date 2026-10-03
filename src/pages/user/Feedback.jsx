import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getRequests, submitFeedback } from "../../utils/requestStorage";
import { feedbackQuestions } from "../../utils/feedbackData";
import "./Feedback.css";

function Feedback() {
  const navigate = useNavigate();
  const location = useLocation();
  const request = location.state?.request || getRequests().slice(-1)[0];
  const questions = feedbackQuestions[request?.service] || [];
  const [rating, setRating] = useState(0);
  const [answers, setAnswers] = useState({});
  const [comment, setComment] = useState("");

  if (!request) {
    return (
      <div className="feedback-page">
        <div className="feedback-empty">
          <h2>No Request Found</h2>
          <p>There is no care request available for feedback.</p>
          <button onClick={() => navigate("/services")}>Choose a Service</button>
        </div>
      </div>
    );
  }

  const handleAnswer = (questionId, value) => setAnswers((previous) => ({ ...previous, [questionId]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!rating) {
      alert("Please select an overall rating.");
      return;
    }
    submitFeedback(request.id, { rating, answers, comment });
    alert("Thank you! Your feedback has been submitted.");
    navigate("/request-status");
  };

  return (
    <div className="feedback-page">
      <div className="feedback-topbar"><div className="feedback-shell"><span>NOOR AL AFIYA</span><span>24/7 Home Care Support • Bahrain</span></div></div>
      <header className="feedback-navbar">
        <div className="feedback-shell">
          <Link to="/" className="feedback-logo"><strong>Bahrain</strong><span>HOME HEALTH CARE SERVICE</span></Link>
        </div>
      </header>

      <section className="feedback-hero">
        <div className="feedback-shell">
          <p>YOUR EXPERIENCE MATTERS</p>
          <h1>Share your feedback</h1>
          <p>Your feedback helps us understand your experience with {request.service}.</p>
        </div>
      </section>

      <main className="feedback-main">
        <div className="feedback-shell">
          <div className="feedback-card">
            <div className="feedback-card-header">
              <div><p>SERVICE FEEDBACK</p><h2>{request.service}</h2></div>
              <span className="feedback-request-id">REQUEST · {request.id}</span>
            </div>

            <form className="feedback-form" onSubmit={handleSubmit}>
              <div className="feedback-section">
                <h3>Overall Service Rating</h3>
                <p>How would you rate your overall experience?</p>
                <div className="feedback-stars">
                  {[1,2,3,4,5].map((star) => <button type="button" key={star} className={`feedback-star ${star <= rating ? "active" : ""}`} onClick={() => setRating(star)}>★</button>)}
                </div>
                <div className="feedback-rating-label">{rating === 1 && "Very Poor"}{rating === 2 && "Poor"}{rating === 3 && "Average"}{rating === 4 && "Good"}{rating === 5 && "Excellent"}</div>
              </div>

              {questions.map((question) => (
                <div className="feedback-section" key={question.id}>
                  <h3>{question.question}</h3>
                  <div className="feedback-answer-options">
                    {[1,2,3,4,5].map((value) => (
                      <label key={value}><input type="radio" name={question.id} value={value} checked={answers[question.id] === value} onChange={() => handleAnswer(question.id, value)} /><span>{value}</span></label>
                    ))}
                  </div>
                  <div className="feedback-scale"><span>Very Poor</span><span>Excellent</span></div>
                </div>
              ))}

              <div className="feedback-section">
                <h3>Additional Comments</h3>
                <p>Optional: tell us anything else about your experience.</p>
                <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows="5" placeholder="Write your comments here..." />
              </div>

              <div className="feedback-submit-row">
                <p>Request ID: <strong>{request.id}</strong></p>
                <button type="submit" className="feedback-submit">Submit Feedback →</button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="feedback-footer">© 2026 NOOR AL AFIYA. All rights reserved.</footer>
    </div>
  );
}

export default Feedback;

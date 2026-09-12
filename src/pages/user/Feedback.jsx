import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getRequests,
  submitFeedback,
} from "../../utils/requestStorage";
import { feedbackQuestions } from "../../utils/feedbackData";
import "./Feedback.css";

function Feedback() {
  const navigate = useNavigate();
  const location = useLocation();

  const requestFromState = location.state?.request;

  const request =
    requestFromState ||
    getRequests().slice(-1)[0];

  const questions =
    feedbackQuestions[request?.service] || [];

  const [rating, setRating] = useState(0);
  const [answers, setAnswers] = useState({});
  const [comment, setComment] = useState("");

  if (!request) {
    return (
      <div className="feedback-page">
        <div className="feedback-card">
          <h2>No Request Found</h2>
          <p>
            There is no care request available for feedback.
          </p>

          <button onClick={() => navigate("/services")}>
            Choose a Service
          </button>
        </div>
      </div>
    );
  }

  const handleAnswer = (questionId, value) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select an overall rating.");
      return;
    }

    submitFeedback(request.id, {
      rating,
      answers,
      comment,
    });

    alert("Thank you! Your feedback has been submitted.");

    navigate("/request-status");
  };

  return (
    <div className="feedback-page">

      <div className="feedback-card">

        <div className="feedback-header">
          <span className="feedback-icon">★</span>

          <div>
            <h1>Service Feedback</h1>
            <p>
              {request.service}
            </p>
          </div>
        </div>

        <div className="feedback-request">
          <strong>Request ID:</strong>
          <span>{request.id}</span>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="feedback-section">

            <h3>
              Overall Service Rating
            </h3>

            <p>
              How would you rate your overall experience?
            </p>

            <div className="stars">

              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={
                    star <= rating
                      ? "star active"
                      : "star"
                  }
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}

            </div>

            <div className="rating-label">
              {rating === 1 && "Very Poor"}
              {rating === 2 && "Poor"}
              {rating === 3 && "Average"}
              {rating === 4 && "Good"}
              {rating === 5 && "Excellent"}
            </div>

          </div>

          {questions.map((question) => (
            <div
              className="feedback-section"
              key={question.id}
            >

              <h3>
                {question.question}
              </h3>

              <div className="answer-options">

                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>

                    <input
                      type="radio"
                      name={question.id}
                      value={value}
                      checked={
                        answers[question.id] === value
                      }
                      onChange={() =>
                        handleAnswer(
                          question.id,
                          value
                        )
                      }
                    />

                    <span>{value}</span>

                  </label>
                ))}

              </div>

              <div className="scale-labels">
                <span>Very Poor</span>
                <span>Excellent</span>
              </div>

            </div>
          ))}

          <div className="feedback-section">

            <h3>
              Additional Comments
            </h3>

            <textarea
              placeholder="Tell us about your experience..."
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              rows="5"
            />

          </div>

          <button
            type="submit"
            className="submit-feedback"
          >
            Submit Feedback
          </button>

        </form>

      </div>

    </div>
  );
}

export default Feedback;
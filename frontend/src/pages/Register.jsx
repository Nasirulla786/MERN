import axios from "axios";
import React, { useState } from "react";
import { ServerURl } from "../App";
import {Link , useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitted(true);
      const res = await axios.post(
        `${ServerURl}/api/register-user`,
        {
          username,
          email,
          password,
        },
        { withCredentials: true },
      );

      if (res.status == 201) {
        toast.success(res.data.message);
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Register Error", error);
      toast.error(error?.response?.data?.message);
    }
  };

  // Password kitna strong hai — simple point-based check
  const getPasswordScore = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordScore = getPasswordScore(password);
  const strengthLabels = ["Too short", "Weak", "Okay", "Good", "Strong"];
  const strengthLabel = strengthLabels[passwordScore];

  return (
    <div className="glint-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .glint-root {
          --ink: #120f1a;
          --ink-soft: #1c1728;
          --panel-line: rgba(255,255,255,0.08);
          --violet: #6c2bd9;
          --magenta: #e1306c;
          --amber: #ffe500;
          --cloud: #f7f5fb;
          --lilac: #9c93b8;
          --lilac-dim: #6f6789;
          --gradient: linear-gradient(135deg, var(--violet) 0%, var(--magenta) 55%, var(--amber) 100%);

          min-height: 100vh;
          width: 100%;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          background: var(--ink);
          font-family: 'Inter', sans-serif;
          color: var(--cloud);
        }

        @media (prefers-reduced-motion: reduce) {
          .glint-root *, .glint-root *::before, .glint-root *::after {
            animation-duration: 0.001ms !important;
            transition-duration: 0.001ms !important;
          }
        }

        /* ---------- Brand panel ---------- */
        .glint-brand {
          position: relative;
          overflow: hidden;
          background: var(--gradient);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
        }

        .glint-brand::before,
        .glint-brand::after {
          content: '';
          position: absolute;
          border-radius: 999px;
          border: 1.5px solid rgba(255,255,255,0.25);
        }
        .glint-brand::before {
          width: 420px;
          height: 420px;
          right: -140px;
          top: -120px;
        }
        .glint-brand::after {
          width: 260px;
          height: 260px;
          left: -90px;
          bottom: -80px;
          border-color: rgba(255,255,255,0.15);
        }

        .glint-mark-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .glint-mark {
          width: 40px;
          height: 40px;
          animation: glint-pulse 1.8s ease-out 1;
        }

        @keyframes glint-pulse {
          0% { transform: scale(0.7); opacity: 0; }
          55% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        .glint-wordmark {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 1.35rem;
          letter-spacing: -0.02em;
          color: #fff;
        }

        .glint-brand-copy {
          position: relative;
          z-index: 1;
          max-width: 420px;
        }

        .glint-brand-copy h1 {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: clamp(2.1rem, 3vw, 2.9rem);
          line-height: 1.08;
          letter-spacing: -0.02em;
          margin: 0 0 0.9rem;
          color: #fff;
        }

        .glint-brand-copy p {
          font-size: 1rem;
          line-height: 1.55;
          color: rgba(255,255,255,0.88);
          margin: 0;
        }

        .glint-brand-foot {
          position: relative;
          z-index: 1;
          display: flex;
          gap: 1.75rem;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.75);
        }

        .glint-brand-foot span { font-weight: 600; }

        /* ---------- Form panel ---------- */
        .glint-form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          background: var(--ink);
        }

        .glint-card {
          width: 100%;
          max-width: 380px;
        }

        .glint-mark-mobile {
          display: none;
        }

        .glint-card h2 {
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 1.6rem;
          letter-spacing: -0.01em;
          margin: 0 0 0.35rem;
        }

        .glint-card .glint-sub {
          color: var(--lilac);
          font-size: 0.92rem;
          margin: 0 0 1.75rem;
        }

        .glint-field {
          margin-bottom: 1.15rem;
        }

        .glint-field label {
          display: block;
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--lilac-dim);
          margin-bottom: 0.4rem;
        }

        .glint-input-shell {
          position: relative;
          border-radius: 12px;
          background: var(--ink-soft);
          border: 1.5px solid var(--panel-line);
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }

        .glint-input-shell.is-focused {
          border-color: transparent;
          background:
            linear-gradient(var(--ink-soft), var(--ink-soft)) padding-box,
            var(--gradient) border-box;
          box-shadow: 0 0 0 4px rgba(225, 48, 108, 0.12);
        }

        .glint-input-shell input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: var(--cloud);
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          padding: 0.85rem 1rem;
          padding-right: 2.6rem;
        }

        .glint-input-shell input::placeholder {
          color: var(--lilac-dim);
        }

        .glint-toggle-visibility {
          position: absolute;
          right: 0.6rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--lilac-dim);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          padding: 0.3rem 0.4rem;
        }

        .glint-toggle-visibility:hover { color: var(--cloud); }

        .glint-strength {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .glint-strength-bar {
          flex: 1;
          height: 4px;
          border-radius: 999px;
          background: var(--panel-line);
          overflow: hidden;
        }

        .glint-strength-bar > span {
          display: block;
          height: 100%;
          border-radius: 999px;
          background: var(--gradient);
          transition: width 0.25s ease;
        }

        .glint-strength-label {
          font-size: 0.72rem;
          color: var(--lilac-dim);
          min-width: 60px;
          text-align: right;
        }

        .glint-submit {
          width: 100%;
          border: none;
          border-radius: 12px;
          padding: 0.9rem 1rem;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 0.98rem;
          color: #17101c;
          background: var(--gradient);
          cursor: pointer;
          margin-top: 0.35rem;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .glint-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px -12px rgba(225, 48, 108, 0.55);
        }

        .glint-submit:active { transform: translateY(0); }

        .glint-submit:focus-visible,
        .glint-login-link:focus-visible,
        .glint-toggle-visibility:focus-visible {
          outline: 2px solid var(--amber);
          outline-offset: 2px;
        }

        .glint-confirm {
          margin-top: 0.85rem;
          font-size: 0.82rem;
          color: var(--amber);
          text-align: center;
        }

        .glint-terms {
          font-size: 0.76rem;
          color: var(--lilac-dim);
          line-height: 1.5;
          margin: 0.9rem 0 0;
        }

        .glint-terms a { color: var(--lilac); text-decoration: underline; }

        .glint-divider {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin: 1.6rem 0;
          color: var(--lilac-dim);
          font-size: 0.76rem;
        }

        .glint-divider::before,
        .glint-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--panel-line);
        }

        .glint-login {
          text-align: center;
          font-size: 0.88rem;
          color: var(--lilac);
        }

        .glint-login-link {
          color: var(--amber);
          font-weight: 600;
          text-decoration: none;
          margin-left: 0.3rem;
          border-bottom: 1px solid transparent;
          transition: border-color 0.15s ease;
        }

        .glint-login-link:hover { border-color: var(--amber); }

        /* ---------- Responsive ---------- */
        @media (max-width: 900px) {
          .glint-root {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
          }

          .glint-brand {
            padding: 2rem 1.75rem;
            min-height: 220px;
          }

          .glint-brand-copy h1 { font-size: 1.7rem; }
          .glint-brand-copy p { font-size: 0.9rem; }
          .glint-brand-foot { display: none; }

          .glint-form-panel { padding: 2rem 1.5rem 3rem; }
        }

        @media (max-width: 480px) {
          .glint-brand {  min-height: 190px; padding: 1.75rem 1.25rem; }
          .glint-brand-copy p { display: none; }
          .glint-card h2 { font-size: 1.4rem; }
        }
      `}</style>

      {/* Brand / hero panel */}
      <div className="glint-brand " aria-hidden="true">
        <div className="glint-mark-wrap">
          <GlintMark className="glint-mark" />
          <span className="glint-wordmark">SnapGram</span>
        </div>

        <div className="glint-brand-copy">
          <h1>Every moment, in the moment.</h1>
          <p>
            Share what's happening now, build a feed people actually want to
            see, and keep the ones who matter close. Glint is quick to post and
            worth sticking around for.
          </p>
        </div>

        <div className="glint-brand-foot">
          <span>12M+ moments shared daily</span>
          <span>Free forever</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="glint-form-panel">
        <div className="glint-card">
          <div className="glint-mark-mobile" />

          <h2>Create your account</h2>
          <p className="glint-sub">Join Glint — it takes less than a minute.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="glint-field">
              <label htmlFor="username">Username</label>
              <div
                className={`glint-input-shell ${focusField === "username" ? "is-focused" : ""}`}
              >
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusField("username")}
                  onBlur={() => setFocusField(null)}
                  required
                />
              </div>
            </div>

            <div className="glint-field">
              <label htmlFor="email">Email</label>
              <div
                className={`glint-input-shell ${focusField === "email" ? "is-focused" : ""}`}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusField("email")}
                  onBlur={() => setFocusField(null)}
                  required
                />
              </div>
            </div>

            <div className="glint-field">
              <label htmlFor="password">Password</label>
              <div
                className={`glint-input-shell ${focusField === "password" ? "is-focused" : ""}`}
              >
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusField("password")}
                  onBlur={() => setFocusField(null)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="glint-toggle-visibility"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>

              {password && (
                <div className="glint-strength" aria-live="polite">
                  <div className="glint-strength-bar">
                    <span style={{ width: `${(passwordScore / 4) * 100}%` }} />
                  </div>
                  <span className="glint-strength-label">{strengthLabel}</span>
                </div>
              )}
            </div>

            <button type="submit" className="glint-submit">
              Sign up
            </button>

            {submitted && (
              <p className="glint-confirm" role="status">
                Welcome in — check your inbox to confirm your email.
              </p>
            )}

            <p className="glint-terms">
              By signing up, you agree to Glint's <a href="#terms">Terms</a> and{" "}
              <a href="#privacy">Privacy Policy</a>.
            </p>
          </form>

          <div className="glint-divider">or</div>

          <p className="glint-login">
            Already have an account?
            <Link to="/login" className="glint-login-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const GlintMark = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="glint-mark-gradient"
        x1="4"
        y1="4"
        x2="36"
        y2="36"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#ffe500" />
      </linearGradient>
    </defs>
    <circle
      cx="20"
      cy="20"
      r="17"
      stroke="url(#glint-mark-gradient)"
      strokeWidth="2.4"
    />
    <path
      d="M22.5 8L13 22.5H19L17 32L27 17H21L22.5 8Z"
      fill="url(#glint-mark-gradient)"
    />
  </svg>
);

export default Register;

import { useEffect, useState } from 'react';
import "../styles/Credentials.css";

export default function Credentials() {
  const [email, setEmail] = useState('Loading...');

  useEffect(() => {
    if (window.google?.script?.run) {
      google.script.run
        .withSuccessHandler((email) => {
          setEmail(email || 'No email available');
        })
        .withFailureHandler((err) => {
          console.error('Error fetching email:', err);
          setEmail('Error fetching email');
        })
        .getUserEmail();
    } else {
      setEmail('Not running inside Google Docs');
    }
  }, []);

  return (
    <div className="credentials-container">
      <div className="hamburger-icon">&#9776;</div>
      <p>{email}</p>
    </div>
  );
}

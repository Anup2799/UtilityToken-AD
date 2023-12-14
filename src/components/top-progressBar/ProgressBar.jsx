import React, { useState, useEffect } from "react";
import "./ProgressBar.css"; // Create a CSS file for styling the progress bar

const ProgressBar = () => {
  //initial state
  const [scrollPercentage, setScrollPercentage] = useState(0);

  /**
   * handling the top progress bar while scrolling
   */
  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDistance = documentHeight - windowHeight;
    const percentage = (scrollTop / scrollDistance) * 100;
    setScrollPercentage(percentage);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{ width: `${scrollPercentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;

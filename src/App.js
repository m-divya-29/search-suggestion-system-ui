import React, { useState, useEffect } from "react";

function App() {
  const [product, setProduct] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const BASE_URL = "https://search-suggestions-backend-mdmpir6dgq-uc.a.run.app";
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (product.trim() !== "") {
        setLoading(true);
        fetch(`${BASE_URL}/api/suggestion/${product}`)
          .then((res) => res.json())
          .then((data) => {
            setSuggestions(data);
            setLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setSuggestions([]);
            setLoading(false);
          });
      } else {
        setSuggestions([]);
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [product]);

  const handleSelect = (value) => {
    setProduct(value);
    setSuggestions([]);
  };

  const highlightMatch = (text) => {
    const index = text.toLowerCase().indexOf(product.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <strong style={{ color: "#06b6d4" }}>{text.substring(index, index + product.length)}</strong>
        {text.substring(index + product.length)}
      </>
    );
  };

  const theme = {
    background: darkMode ? "#1e1e2f" : "#f4f4f9",
    color: darkMode ? "#f4f4f9" : "#1e1e2f",
    inputBackground: darkMode ? "#2c2c3b" : "#fff",
    suggestionBg: darkMode ? "#2a2a3a" : "#fff",
    suggestionHover: darkMode ? "#3c3c4c" : "#f0f0f0",
  };

  return (
    <div style={{
      backgroundColor: theme.background,
      color: theme.color,
      transition: "0.3s",
      minHeight: "100vh",
      padding: "2rem",
      fontFamily: "Segoe UI, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          padding: "0.6rem 1rem",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#06b6d4",
          color: "#fff",
          fontWeight: "bold",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
        }}
      >
        {darkMode ? "☀ Light" : "🌙 Dark"}
      </button>

      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍 Smart Search</h1>

      <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
        <input
          type="text"
          placeholder="Search for a product..."
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          style={{
            padding: "0.75rem 1rem",
            width: "100%",
            borderRadius: "12px",
            border: "1px solid #ccc",
            backgroundColor: theme.inputBackground,
            color: theme.color,
            fontSize: "1rem",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          }}
        />

        {loading && (
          <div style={{ marginTop: "0.5rem", fontStyle: "italic", color: "#aaa" }}>
            🔄 Loading...
          </div>
        )}

        {suggestions.length > 0 && !loading && (
          <ul style={{
            listStyle: "none",
            marginTop: "0.5rem",
            padding: "0",
            position: "absolute",
            width: "100%",
            backgroundColor: theme.suggestionBg,
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            overflow: "hidden",
          }}>
            {suggestions.map((sug, index) => (
              <li
                key={index}
                onClick={() => handleSelect(sug)}
                style={{
                  padding: "0.75rem 1rem",
                  borderBottom:
                    index !== suggestions.length - 1 ? "1px solid #eee" : "none",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.suggestionHover}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.suggestionBg}
              >
                {highlightMatch(sug)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;

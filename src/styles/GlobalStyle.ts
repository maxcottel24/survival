import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    // On peut garder une palette de couleurs simple pour le moment
    --primary-color: #4CAF50;
    --dark-bg: #121212;
    --light-text: #EAEAEA;
    --dark-text: #333333;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    
    background-image: url('/images/background.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    color: var(--light-text);
    line-height: 1.6;
    overflow: hidden;
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: var(--primary-color);
  }

  button, input, select, textarea {
    font-family: inherit;
  }

  button {
    cursor: pointer;
  }
`;
import * as styledComponents from 'styled-components';
import reset from 'styled-reset';

export const lightTheme = {
  fontFamily: 'Montserrat, Arial, sans-serif',
  minFontSize: '10px',
  maxFontSize: '20px',
  responsiveFontSize: '1vw',

  mainBackground: '#f0f0f0',
  mainColor: '#222',

  globalCss: '',
};

export const Themes = {
  light: lightTheme,
};

const { default: styled, css, createGlobalStyle, keyframes, ThemeProvider } = styledComponents;

export { styled, css, createGlobalStyle, keyframes, ThemeProvider };

export const GlobalStyles = createGlobalStyle`
  @import url(https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap);
	${reset}

  * {
    box-sizing: border-box;
  }

  html {
    font-size: clamp(10px, 1vw, 20px);
  }

	body {
		font-family: ${(p) => p.theme.fontFamily};
    font-size: clamp(${(p) => p.theme.minFontSize}, ${(p) => p.theme.respFontSize}, ${(p) => p.theme.maxFontSize});
		color: ${(p) => p.theme.mainColor};
    
		background-color: ${(p) => p.theme.mainBackground};
	}

  button {
    font-family: ${(p) => p.theme.fontFamily};
    font-size: ${(p) => p.theme.textSize};
  }

  .container {
    width: 100%;
    margin: auto;
    padding: 0 30px;
    box-sizing: border-box;
    overflow: hidden;
  }

  @media (min-width: 768px) {
    .container {
      width: 100%;
    }
  }

  @media (min-width: 992px) { 
    .container {
      width: 800px;
    }
  }

  @media (min-width: 1200px) { 
    .container {
      width: 1100px;
    }
  }

	${(p) => p.theme.globalCss}
`;

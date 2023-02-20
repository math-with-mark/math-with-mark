import { MathJaxContext } from 'better-react-mathjax';
import MathJax from 'better-react-mathjax/MathJax';

function App() {
  return (
    <MathJaxContext>
      <MathJax>{'\\(\\frac{10}{4x} \\approx 2^{12}\\)'}</MathJax>
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </MathJaxContext>
  );
}

export default App;

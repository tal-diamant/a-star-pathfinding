import Canvas from './components/Canvas/Canvas';
import Header from './components/Header/Header';
import './App.css'

function App() {

  return (
    <div className="App">
      <Header />
      <Canvas />
      <hr />
      <section>some section stuff</section>
      <footer>footer</footer>
    </div>
  )
}

export default App
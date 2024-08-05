import Footer from './components/Footer'
import Header from './components/Header'
import Navbar from './components/Navbar'
import Slider from './components/Slider'
import image1 from './assets/slider1.jpg';
import './App.css'

const slides = [
    {
        mainImage: image1,
        title: 'Slide 1',
        subtitle: 'Subtitle 1',
        description: 'Description 1',
    },
    {
        mainImage: image1,
        title: 'Slide 2',
        subtitle: 'Subtitle 2',
        description: 'Description 2',
    },
];

function App() {
    return (
      <>
        <Header></Header>
        <Navbar></Navbar>
        <Slider slides={slides}></Slider>
        <Footer></Footer>
      </>
    )
}

export default App

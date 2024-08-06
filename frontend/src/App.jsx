import Footer from './components/Footer'
import Header from './components/Header'
import Navbar from './components/Navbar'
import Slider from './components/Slider'
import image1 from './assets/slider1.jpg';
import image2 from './assets/slider2.png';
import image3 from './assets/slider3.jpg';
import image4 from './assets/slider4.png';

import './App.css'
import ProductcardUsage from './components/Productcardusage'


const slides = [
    {
        mainImage: image1,
    },
    {
      mainImage: image2,
  }, {
    mainImage: image3,
}, {
  mainImage: image4,
},
];

function App() {
    return (
      <>
        <Header></Header>
        <Navbar></Navbar>
        <Slider slides={slides}></Slider>
        <ProductcardUsage/>
        <ProductcardUsage/>
        <ProductcardUsage/>
        <Footer></Footer>
      </>
    )
}

export default App

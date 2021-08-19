import React from 'react'
import { Carousel } from 'react-bootstrap'
import { Navbar,Nav,Container, Button} from 'react-bootstrap'

import Footer from '../Components/Footer';
import Navbars from '../Components/Navbars';

export default function Home() {
  return (
    <>
    
   {/* <Navbar bg="light" expand="lg">
  <Container>
    <Navbar.Brand href="#home">ePaws</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
      </Nav>
      <Nav >
      <Nav.Link href="/login">Login</Nav.Link>
        <Nav.Link href="/signup">Register</Nav.Link>
        <Nav.Link href="/about">About</Nav.Link>
        <Nav.Link href="/contact">Contact Us</Nav.Link>
        
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar> */}
  <section className="banner-area" id="home">
  </section>
  <div id="cover-photo">
 
  <div className="img">
  <Carousel fade controls={false} interval={1000}>
    <Carousel.Item>
      <img
        className="d-block w-100"
        src="https://i.pinimg.com/originals/19/9d/da/199dda88fbca22eae7b3c5f3c022e16b.jpg"
        alt="First slide"
      />
    </Carousel.Item>
    <Carousel.Item>
      <img
        className="d-block w-100"
        src="https://i.pinimg.com/originals/f2/e2/5f/f2e25fa89ad3e970aeb994db60a81303.jpg"
        alt="Second slide"
      />
    </Carousel.Item>
    <Carousel.Item>
      <img
        className="d-block w-100"
        src="https://i.pinimg.com/originals/45/d5/01/45d501f3ed39f8e616f27c98bc4a0e24.jpg"
        alt="Third slide"
      />
    </Carousel.Item>
</Carousel>
</div>
</div>
  <section className="about-area" id="about">
    <div className="second-section">
        <div className="start-section">
        <div className="inner">
          <h1>Section Title</h1>
          <div className="border"></div>
            <h3><i>"We understand your pets are a big part of your family. And we are here for you every step of the way when it comes to your pets' health."</i></h3>    
        </div>
      </div>
    </div>
    <div className="about-section-1">
        <div className="inner-container-1">
            <h1>Title</h1>
            <p className="text">
            your pet's health is our top priority and excellent service is our goal. We strive to provide the very best in medical care, and our hospitals provide a 
            full range of general, surgical and specialized care. This is how our Veterinarians would treat their own pets. And we offer nothing less than that to you.
            </p>
            <Button variant="outline-secondary">Learn More</Button>
        </div>
        <div className="skill-bars">
          <div className="bar">
            <div className="info">
              <span>Progress1</span>
            </div>
            <div className="progress-line Progress1">
              <span></span>
            </div>
          </div>
          <div className="bar">
            <div className="info">
              <span>Progress2</span>
            </div>
            <div className="progress-line Progress2">
              <span></span>
            </div>
          </div>
          <div className="bar">
            <div className="info">
              <span>Progress3</span>
            </div>
            <div className="progress-line Progress3">
              <span></span>
            </div>
          </div>
          <div className="bar">
            <div className="info">
              <span>Progress4</span>
            </div>
            <div className="progress-line Progress4">
              <span></span>
            </div>
          </div>
          <div className="bar">
            <div className="info">
              <span>Progress5</span>
            </div>
            <div className="progress-line Progress5">
              <span></span>
            </div>
          </div>
        </div>
    </div>
  </section>

  <section className="port-area" id="portfolio">
  <div className="testimonials">
      <div className="inner">
        <h1>Section Title</h1>
        <div className="border"></div>

        <div className="row">
          <div className="col">
            <div className="testimonial">
              <img src="https://www.flint.com.ph/static/img/register.6bef84d.png" alt=""/>
              <div className="name">Title</div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
              </p>
              <Button variant="primary">Click here</Button>
            </div>
          </div>

          <div className="col">
            <div className="testimonial">
              <img src="https://www.flint.com.ph/static/img/register.6bef84d.png" alt=""/>
              <div className="name">Title</div>

              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
              </p>
              <Button variant="primary">Click here</Button>
            </div>
          </div>

          <div className="col">
            <div className="testimonial">
              <img src="https://www.flint.com.ph/static/img/register.6bef84d.png" alt=""/>
              <div className="name">Title</div>

              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
              </p>
              <Button variant="primary">Click here</Button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </section>

<section className="service-area" id="services">
    <div className="about-section">
        <div className="inner-container">
            <h1>About Us</h1>
            <p className="text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus velit ducimus, enim inventore earum, eligendi nostrum pariatur necessitatibus eius dicta a voluptates sit deleniti autem error eos totam nisi neque voluptates sit deleniti autem error eos totam nisi neque.
            </p>
            <div className="skills">
                <span>Title</span>
                <span>Title</span>
                <span>Title</span>
            </div>
        </div>
    </div>
</section>

<section className="contact-area" id="contact">
    <div className='team-section'>
      <h1>Our Team</h1>
      <div className="border"></div>
    </div>
    <div className='ps'>
        <a href='#member1'><img src='http://www.team.gsamdani.com/wp-content/uploads/2016/05/tm9.jpg' alt=''></img></a>
        <a href='#member2'><img src='http://www.team.gsamdani.com/wp-content/uploads/2016/05/tm9.jpg' alt=''></img></a>
        <a href='#member3'><img src='http://www.team.gsamdani.com/wp-content/uploads/2016/05/tm9.jpg' alt=''></img></a>
        <a href='#member4'><img src='http://www.team.gsamdani.com/wp-content/uploads/2016/05/tm9.jpg' alt=''></img></a>
    </div>
    <div className='team-member' id="member1">
        <span className='name'>AC</span>
        <p className='team-description'>
            "test Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
        </p>
    </div>
    <div className='team-member' id="member2">
        <span className='name'>Rachelle Mae</span>
        <p className='team-description'>
            "member Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
        </p>
    </div>
    <div className='team-member' id='member3'>
        <span className='name'>Kathreen</span>
        <p className='team-description'>
            "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
        </p>
    </div>
    <div className='team-member' id='member4'>
        <span className='name'>Donna</span>
        <p className='team-description'>
          "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
        </p>
    </div>
</section>
<Footer></Footer>
            </>
  )
}

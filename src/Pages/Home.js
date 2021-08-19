import React from 'react'
import { Carousel } from 'react-bootstrap'
import { Navbar,Nav,Container, Button} from 'react-bootstrap'
import { Row, Col,Image } from 'react-bootstrap'

import Footer from '../Components/Footer';

export default function Home() {
  return (
    <>
   <Navbar bg="light" expand="lg">
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
</Navbar>
  <section class="banner-area" id="home">
  </section>
  <div id="cover-photo">
 
  <div class="img">
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
  <section class="about-area" id="about">
    <div class="second-section">
        <div class="start-section">
        <div class="inner">
          <h1>Section Title</h1>
          <div class="border"></div>
            <h3><i>"We understand your pets are a big part of your family. And we are here for you every step of the way when it comes to your pets' health."</i></h3>    
        </div>
      </div>
    </div>
    <div class="about-section-1">
        <div class="inner-container-1">
            <h1>Title</h1>
            <p class="text">
            your pet's health is our top priority and excellent service is our goal. We strive to provide the very best in medical care, and our hospitals provide a 
            full range of general, surgical and specialized care. This is how our Veterinarians would treat their own pets. And we offer nothing less than that to you.
            </p>
            <Button variant="outline-secondary">Learn More</Button>
        </div>
        <div class="skill-bars">
          <div class="bar">
            <div class="info">
              <span>Progress1</span>
            </div>
            <div class="progress-line Progress1">
              <span></span>
            </div>
          </div>
          <div class="bar">
            <div class="info">
              <span>Progress2</span>
            </div>
            <div class="progress-line Progress2">
              <span></span>
            </div>
          </div>
          <div class="bar">
            <div class="info">
              <span>Progress3</span>
            </div>
            <div class="progress-line Progress3">
              <span></span>
            </div>
          </div>
          <div class="bar">
            <div class="info">
              <span>Progress4</span>
            </div>
            <div class="progress-line Progress4">
              <span></span>
            </div>
          </div>
          <div class="bar">
            <div class="info">
              <span>Progress5</span>
            </div>
            <div class="progress-line Progress5">
              <span></span>
            </div>
          </div>
        </div>
    </div>
  </section>

  <section class="port-area" id="portfolio">
  <div class="testimonials">
      <div class="inner">
        <h1>Section Title</h1>
        <div class="border"></div>

        <div class="row">
          <div class="col">
            <div class="testimonial">
              <img src="https://www.flint.com.ph/static/img/register.6bef84d.png" alt=""/>
              <div class="name">Title</div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
              </p>
              <Button variant="primary">Click here</Button>
            </div>
          </div>

          <div class="col">
            <div class="testimonial">
              <img src="https://www.flint.com.ph/static/img/register.6bef84d.png" alt=""/>
              <div class="name">Title</div>

              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
              </p>
              <Button variant="primary">Click here</Button>
            </div>
          </div>

          <div class="col">
            <div class="testimonial">
              <img src="https://www.flint.com.ph/static/img/register.6bef84d.png" alt=""/>
              <div class="name">Title</div>

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

<section class="service-area" id="services">
    <div class="about-section">
        <div class="inner-container">
            <h1>About Us</h1>
            <p class="text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus velit ducimus, enim inventore earum, eligendi nostrum pariatur necessitatibus eius dicta a voluptates sit deleniti autem error eos totam nisi neque voluptates sit deleniti autem error eos totam nisi neque.
            </p>
            <div class="skills">
                <span>Title</span>
                <span>Title</span>
                <span>Title</span>
            </div>
        </div>
    </div>
</section>

<section class="contact-area" id="contact">
    <div class='team-section'>
      <h1>Our Team</h1>
      <div class="border"></div>
    </div>
    <div class='ps'>
        <a href='#member1'><img src='http://www.team.gsamdani.com/wp-content/uploads/2016/05/tm9.jpg' alt=''></img></a>
        <a href='#member2'><img src='http://www.team.gsamdani.com/wp-content/uploads/2016/05/tm9.jpg' alt=''></img></a>
        <a href='#member3'><img src='http://www.team.gsamdani.com/wp-content/uploads/2016/05/tm9.jpg' alt=''></img></a>
        <a href='#member4'><img src='http://www.team.gsamdani.com/wp-content/uploads/2016/05/tm9.jpg' alt=''></img></a>
    </div>
    <div class='team-member' id="member1">
        <span class='name'>AC</span>
        <p class='team-description'>
            "test Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
        </p>
    </div>
    <div class='team-member' id="member2">
        <span class='name'>Rachelle Mae</span>
        <p class='team-description'>
            "member Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
        </p>
    </div>
    <div class='team-member' id='member3'>
        <span class='name'>Kathreen</span>
        <p class='team-description'>
            "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
        </p>
    </div>
    <div class='team-member' id='member4'>
        <span class='name'>Donna</span>
        <p class='team-description'>
          "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
        </p>
    </div>
</section>
<Footer></Footer>
            </>
  )
}

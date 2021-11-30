import React from 'react'
import { Carousel } from 'react-bootstrap'
import { CalendarFilled, DatabaseFilled, SnippetsFilled} from '@ant-design/icons';

import Footer from '../Components/Footer';
import Navbars from '../Components/Navbars';

import { useState, useEffect } from "react";
import JsonData from "../data/data.json";
import { Gallery } from "../Components/gallery";
import { Header } from "../Components/header";
import { Team } from "../Components/Team";

import "../Styles/Home.css"
export default function Home() {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <>

    <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
    
    <Navbars title="Home"></Navbars>
    <Header data={landingPageData.Header}/>

    <section className="about-area">
      <div className="second-section">
          <div className="start-section">
          <div className='section-title'>
          <h2>Our Passion</h2>
          <p>
          We understand your pets are a big part of your family. And we are here for you every step of the way when it comes to your pets' health.
          </p>
        </div>
        </div>
      </div>
      <div className="about-section-1">
          <div className="inner-container-1">
              <h1>The ease for you and your pets.</h1>
              <p className="text">
              Your pet's health is our top priority and excellent service is our goal. We strive to provide the very best in medical care, and our hospitals provide a 
              full range of general, surgical and specialized care. This is how our Veterinarians would treat their own pets. And we offer nothing less than that to you.
              </p>
          </div>
          <div className="skill-bars">
            <div className="bar">
              <div className="info">
                <span>Nurse Clinics</span>
              </div>
              <div className="progress-line Progress1">
                <span></span>
              </div>
            </div>
            <div className="bar">
              <div className="info">
                <span>24 hour emergency cover</span>
              </div>
              <div className="progress-line Progress2">
                <span></span>
              </div>
            </div>
            <div className="bar">
              <div className="info">
                <span>Furry Friends Health Club</span>
              </div>
              <div className="progress-line Progress3">
                <span></span>
              </div>
            </div>
            <div className="bar">
              <div className="info">
                <span>Community and Charity Work</span>
              </div>
              <div className="progress-line Progress4">
                <span></span>
              </div>
            </div>
            <div className="bar">
              <div className="info">
                <span>Expert vets</span>
              </div>
              <div className="progress-line Progress5">
                <span></span>
              </div>
            </div>
          </div>
      </div>
    </section>
    <Gallery data={landingPageData.Gallery}/>
 

  

  <section className="port-area" id="portfolio">
  <div className="testimonials">
      <div className="inner">
      <div className='section-title'>
          <h2>Objectives</h2>
          <p>
          We want to provide a system that serves as an edge to other animal clinic with online transaction such as record their patient information, online appointment, online consultation of pet owners to veterinarian especially this time of pandemic. 
          </p>
        </div>

        <div className="row">
          <div className="col">
            <div className="testimonial">
              <CalendarFilled style={{ fontSize: '100px', color: '#e8a87c' }}/>
              <div className="name"></div>
              <p>
              ⦁	Provide convenient way of appointment reservation, and consultation.
              </p>
            </div>
          </div>

          <div className="col">
            <div className="testimonial">
              <SnippetsFilled style={{ fontSize: '100px', color: '#e8a87c' }}/>
              <div className="name"></div>

              <p>
              ⦁	Provide computerized pet and pet owner information, health record, and receipt.
              </p>
            </div>
          </div>

          <div className="col">
            <div className="testimonial">
              <DatabaseFilled style={{ fontSize: '100px', color: '#e8a87c' }}/>
              <div className="name"></div>

              <p>
              ⦁	Perform storing records of pet and pet’s information. 
              </p>
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
            We aim to provide a system that will help the veterinary clinic and pet owner’s experiencing problems that based on manual method. A computerized information system will serve as the Veterinarian’s way of communications with the pet owners. This project was expected to be one of the most useful systems for the veterinary clinic because pet owner can avoid wasting their time, energy, and money. 
            </p>
        </div>
    </div>
</section>
<Team data={landingPageData.Team}/>

<Footer></Footer>
            </>
  )
}

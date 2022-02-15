import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './home.css';
import heroIllustration from '../resources/hero_illustration.svg';
import collaborate from '../resources/collaborate_illustration.svg';
import waiting from '../resources/waiting_illustration.svg';
import groups from '../resources/manage_groups_illustration.svg';
import { useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar>
        <header className="flex flex-wrap mx-auto justify-center mt-24 items-center gap-24">
          <div className="flex flex-col gap-4">
            <h1>
              Your door to simpler <br /> shared planning
            </h1>
            <div className="text-3xl text-pink">
              A simple group calendar to help you focus <br /> your time on
              what’s matters the most.
            </div>
          </div>
          <img src={heroIllustration} alt="hero" />
        </header>
        <div className="background-lines--home drop-shadow-lg absolute -mt-32"></div>
        <main className="flex flex-col justify-start gap-56 mt-64 items-center">
          <section className="bg-purple flex gap-20 items-center w-11/12 h-72 self-start rounded-r-full">
            <img
              src={collaborate}
              alt="colaboration"
              className="overflow-visible scale-120 z-50"
            />
            <div className="w-2/5">
              <h2 className="text-3xl mb-2 font-semibold text-white">
                Collaborate
              </h2>
              <p className="text-white text-lg  leading-5">
                We all know how difficult it is sometimes to organize stuff with
                other people. <br />
                <br /> Kalen solves that by letting you edit calendars together.
                Everyone in a calendar group can see your free time slots and
                decide on the best time spent together.
              </p>
            </div>
          </section>
          <section className="bg-purple flex gap-20 items-center w-11/12 h-72 self-end rounded-l-full">
            <div className="w-2/5 ml-36 ">
              <h2 className="text-3xl mb-2 font-semibold text-white">
                Manage multiple groups
              </h2>
              <p className="text-white text-lg leading-5">
                Sometimes you wan’t to keep thing seperate, and that is ok. With
                Kalen, you can have multiple calendars for different groups. For
                example, one for your family, one for your friends and one for
                work.
              </p>
            </div>
            <img
              src={groups}
              alt="colaboration"
              className="overflow-visible scale-120 z-50"
            />
          </section>
          <section className="bg-purple flex gap-20 items-center w-11/12 h-72 self-start rounded-r-full">
            <img
              src={waiting}
              alt="colaboration"
              className="overflow-visible scale-120 -mt-6 z-50"
            />
            <div className="w-2/5">
              <h2 className="text-3xl mb-2 font-semibold text-white">
                Enjoy your free time
              </h2>
              <p className="text-white text-lg  leading-5">
                With everything organised and free time slots properly managed,
                you can confidently relax and enjoy your free time.
              </p>
            </div>
          </section>
        </main>
        <section className="flex flex-row justify-end items-start w-screen mt-32 h-96">
          <div className="flex flex-col justify-center h-32 w-2/6 mt-20 ml-24">
            <div className="text-4xl mb-2 font-semibold text-purple">
              Sounds good to you? <br />
              Sign up!
            </div>
            <div className="text-purple text-xl">Kalen is free</div>
            <button
              className="main-button-pink h-10"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </button>
          </div>
          <div className="lines-home-bottom h-96 w-4/5"></div>
        </section>
      </Navbar>
      <Footer />
    </>
  );
}

export default Home;

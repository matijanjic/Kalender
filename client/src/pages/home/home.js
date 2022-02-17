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
        <header className="flex flex-wrap mx-auto justify-center mt-12 text-lg xl:mt-24 items-center gap-12 md:gap-24 text-center md:text-left">
          <div className="flex flex-col gap-4 w-96 xl:w-1/2">
            <h1>Your door to simpler shared planning</h1>
            <div className="text-xl md:text-2xl xl:text-3xl dark:font-medium text-pink">
              A simple group calendar to help you focus your time on what’s
              matters the most.
            </div>
          </div>
          <img src={heroIllustration} alt="hero" className="h-64 xl:h-96" />
        </header>

        <div className="background-lines--home drop-shadow-lg absolute -mt-32 z-10"></div>

        <main className="flex flex-col justify-start gap-10 md:gap-56 mt-44 md:mt-64 items-center z-50">
          <section className="bg-purple flex flex-col gap-0 xl:gap-20 items-center rounded-xl mx-4 xl:mx-0 h-auto xl:h-72  self-start md:flex-row lg:flex-nowrap lg:w-11/12 lg:rounded-r-full z-50 xl:z-0">
            <img
              src={collaborate}
              alt="colaboration"
              className="z-20 px-4 md:px-0 hidden md:block md:min-w-[400px]"
            />
            <div className="w-auto p-8 xl:p-0 xl:w-2/5">
              <h2 className="text-3xl mb-2 font-semibold text-white">
                Collaborate
              </h2>
              <p className="text-white text-md md:text-lg leading-5 ">
                We all know how difficult it sometimes is to organize stuff with
                other people. <br />
                <br /> Kalen solves that by letting you edit calendars together.
                Everyone in a calendar group can see your free time slots and
                decide on the best time spent together.
              </p>
            </div>
          </section>

          <section className="bg-purple flex flex-col gap-0 xl:gap-20 items-center rounded-xl mx-4 xl:mx-0 h-auto xl:h-72 self-end md:flex-row lg:flex-nowrap lg:w-11/12 lg:rounded-l-full z-50 xl:z-0">
            <div className="w-auto p-8 xl:ml-28 xl:p-0 xl:w-2/5">
              <h2 className="text-3xl mb-2 font-semibold text-white">
                Manage multiple groups
              </h2>
              <p className="text-white  text-md md:text-lg leading-5">
                Sometimes you wan’t to keep thing seperate, and that is ok. With
                Kalen, you can have multiple calendars for different groups. For
                example, one for your family, one for your friends and one for
                work.
              </p>
            </div>
            <img
              src={groups}
              alt="group working together"
              className="z-50 md:px-0 hidden md:block md:min-w-[400px]"
            />
          </section>

          <section className="bg-purple flex flex-col gap-0 xl:gap-20 items-center rounded-xl mx-4 xl:mx-0 h-auto xl:h-72 self-start md:flex-row lg:flex-nowrap lg:w-11/12 lg:rounded-r-full z-50 xl:z-0">
            <img
              src={waiting}
              alt="girl waiting"
              className="z-50 px-4 md:px-0 hidden md:block md:min-w-[400px]"
            />
            <div className="w-auto p-8 xl:p-0 xl:w-2/5">
              <h2 className="text-3xl mb-2 font-semibold text-white">
                Enjoy your free time
              </h2>
              <p className="text-white text-md md:text-lg leading-5">
                With everything organised and free time slots properly managed,
                you can confidently relax and enjoy your free time.
              </p>
            </div>
          </section>
        </main>

        <section className="flex mx-auto w-4/5 dark:bg-deepblackpurple bg-white shadow-2xl sm:shadow-none outline outline-4 outline-purple py-10 md:outline-none rounded-xl relative items-center justify-center text-center md:text-left md:justify-end md:items-center md:w-screen my-20 md:mt-32 md:mb-10 md:h-96 z-50">
          <div className="mx-auto flex flex-col flex-shrink items-center justify-center md:items-start md:justify-start w-4/6  md:ml-24">
            <div className="text-4xl mb-2 font-semibold text-purple ">
              Sounds good to you? <br />
              Sign up!
            </div>
            <div className="text-purple text-xl">Kalen is free.</div>
            <button
              className="main-button-pink h-10"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </button>
          </div>
          <div className="lines-home-bottom h-full w-full xl:scale-125 md:block hidden"></div>
        </section>
      </Navbar>
      <Footer />
    </>
  );
}

export default Home;

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import VideoCarousel from "./VideoCarousel";
import { watchImg, rightImg } from '../utils';

gsap.registerPlugin(ScrollTrigger);

const Highlights = () => {
  useGSAP(() => {
    gsap.to("#title", {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: "#highlights",
        start: "top-=150 top-=50",
        toggleActions: "play reverse play reverse"
      },
    });

    gsap.to(".link", { 
      opacity: 1, 
      y: 0,
      duration: 1, 
      stagger: 0.25,
      scrollTrigger: {
        trigger: "#highlights",
        start: "top-=150 top-=50",
        toggleActions: "play reverse play reverse"
      },
    })
  }, []);

  return (
    <section id="highlights" className="w-screen overflow-hidden h-full common-padding bg-zinc">
      <div className="screen-max-width">
        <div className="mb-12 w-full md:flex items-end justify-between">
          <h1 id="title" className="section-heading">Get the highlights.</h1>

          <div className="flex flex-wrap items-end gap-5">
            <p className="link">
              Watch the film
              <img 
                src={watchImg} 
                alt="Watch"
                className="ml-2"
              />
            </p>

            <p className="link">
              Watch the event
              <img
                src={rightImg} 
                alt="Right"
                className="ml-2"
              />
            </p>
          </div>
        </div>

        <VideoCarousel />
      </div>
    </section>
  )
}

export default Highlights
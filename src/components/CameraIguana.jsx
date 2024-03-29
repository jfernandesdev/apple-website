import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { iguanaImg } from "../utils";

gsap.registerPlugin(ScrollTrigger);

const CameraIguana = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#iguanaImg",
        start: "top 80%",
        end: "bottom top",
        scrub: true 
      }
    });

    tl.to("#iguanaImg", {
      scale: 1.1, 
      duration: 1 
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill()); 
    };
  }, []);

  return (
    <section ref={sectionRef} className="mt-[5%] mb-[10%] relative">
      <div className="flex flex-col mt-5 screen-max-width px-10">
        <h2 className="title-section">
          A camera that captures your wildest imagination.
        </h2>

        <p className="subtitle-section md:w-[75%]">
          From dramatic framing flexibility to next-generation portraits, see what you
          can do with our most powerful iPhone camera system.
        </p>
      </div>

      <div className={`relative ${isDesktop ? 'min-h-screen' : ''}`}>
        <img
          id="iguanaImg"
          src={iguanaImg}
          alt="iguana green"
          className="object-contain h-full w-full"
        />

        <div className="absolute bottom-0 left-[5%] md:bottom-[10%] md:left-[10%] z-10">
          <p className={`hiw-text text-white ${isDesktop ? '' : 'text-sm'}`}>
            A green iguana, captured by the 48MP Main camera
          </p>
        </div>
      </div>
    </section>
  )
}

export default CameraIguana;

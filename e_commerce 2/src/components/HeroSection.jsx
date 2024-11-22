import React, { useState, useRef, useEffect } from "react";

const HeroSection = ({ categoryRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isGradVisible, setIsGradVisible] = useState(false);
  const heroContentRef = useRef(null);
  const gradContentRef = useRef(null);

  // Scroll into category section
  const handleShopNowClick = () => {
    if (categoryRef.current) {
      categoryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Intersection Observer to trigger animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    const gradObserver = new IntersectionObserver(
      ([entry]) => {
        setIsGradVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (heroContentRef.current) {
      observer.observe(heroContentRef.current);
    }
    if (gradContentRef.current) {
      gradObserver.observe(gradContentRef.current);
    }

    return () => {
      if (heroContentRef.current) {
        observer.unobserve(heroContentRef.current);
      }
      if (gradContentRef.current) {
        gradObserver.unobserve(gradContentRef.current);
      }
    };
  }, []);

  return (
    <div className="hero">
      <section className="relative">
        {/* Full-width image */}
        <div className="w-full flex justify-center items-center">
          <img
            src="/HeroImg.png"
            alt="New Arrivals"
            className="w-3/4 h-auto object-cover object-center"
          />
        </div>

        {/* Text and Button below the image */}
        <div
          ref={heroContentRef}
          className="heroContent flex flex-col md:flex-row items-center justify-between mt-8 px-8"
        >
          {/* Text Section */}
          <div
            className={`text-content mt-20 md:w-1/2 text-center md:text-left transition-transform duration-1000 ease-out ${
              isVisible ? "animate-slide-in-left" : "animate-slide-out-left"
            }`}
          >
            <h1 className="text_hero text-4xl md:text-6xl font-bold">
              New Arrivals
            </h1>
            <h3 className="text mt-2 text-xl md:text-2xl">
              The Best Rental Shop You Can Ever Find
            </h3>
          </div>

          {/* Button Section */}
          <div
            className={`button-content mt-4 md:mt-0 md:w-1/2 flex justify-center md:justify-end transition-transform duration-1000 ease-out ${
              isVisible ? "animate-slide-in-right" : "animate-slide-out-right"
            }`}
          >
            <button
              className="btn mt-4 md:mt-0 py-2 px-6 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-800 transition-all"
              onClick={handleShopNowClick}
            >
              Shop Now
            </button>
          </div>
        </div>

        {/* Grad Section */}
        <div
          ref={gradContentRef}
          className={`grad py-10 mt-20 ${
            isGradVisible ? "animate-slide-in-up" : "animate-slide-out-up"
          }`}
        >
          <h2 className="text_grad text-4xl md:text-6xl font-bold text-center">
            Get The Grads Ready In Time
          </h2>
        </div>
      </section>

      {/* Keyframe Animations */}
      <style>
        {`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideOutLeft {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 0;
              transform: translateX(-100%);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideOutRight {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 0;
              transform: translateX(100%);
            }
          }

          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(50%);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideOutUp {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0;
              transform: translateY(50%);
            }
          }

          .animate-slide-in-left {
            animation: slideInLeft 1s ease-out forwards;
          }

          .animate-slide-out-left {
            animation: slideOutLeft 1s ease-out forwards;
          }

          .animate-slide-in-right {
            animation: slideInRight 1s ease-out forwards;
          }

          .animate-slide-out-right {
            animation: slideOutRight 1s ease-out forwards;
          }

          .animate-slide-in-up {
            animation: slideInUp 1s ease-out forwards;
          }

          .animate-slide-out-up {
            animation: slideOutUp 1s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default HeroSection;

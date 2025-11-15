import React, { useEffect, useRef } from 'react'
import bg from '../smc-p1.1.png'
import chiliField from '../bgsmc2.png'
import bgCave from "../bg5.png";
import dashboardImg from '../Dashboardfarm.png'
import prototypeImg from '../PROTOYPE.jpg'

export default function LandingPage({ onLoginClick, onRegisterClick }) {
  const titleRef = useRef(null)
  const paraRef = useRef(null)
  const featuresRef = useRef(null)
  const previewTitleRef = useRef(null)
  const previewGridRef = useRef(null)
  const howTitleRef = useRef(null)
  const howCardRef = useRef(null)
  const contactCardRef = useRef(null)

  useEffect(() => {
    const opts = { threshold: 0.2 }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target

        if (featuresRef.current && el === featuresRef.current) {
          const title = el.querySelector('.features-title')
          const cards = el.querySelectorAll('.feature-card')
          if (entry.isIntersecting) {
            if (title) {
              title.classList.remove('opacity-0', 'translate-y-6')
              title.classList.add('opacity-100', 'translate-y-0')
            }
            cards.forEach((c) => {
              c.classList.remove('opacity-0', 'translate-y-6')
              c.classList.add('opacity-100', 'translate-y-0')
            })
          } else {
            if (title) {
              title.classList.remove('opacity-100', 'translate-y-0')
              title.classList.add('opacity-0', 'translate-y-6')
            }
            cards.forEach((c) => {
              c.classList.remove('opacity-100', 'translate-y-0')
              c.classList.add('opacity-0', 'translate-y-6')
            })
          }
          return
        }
        if (entry.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-6')
          el.classList.add('opacity-100', 'translate-y-0')
        } else {
          el.classList.remove('opacity-100', 'translate-y-0')
          el.classList.add('opacity-0', 'translate-y-6')
        }
      })
    }, opts)

    if (titleRef.current) io.observe(titleRef.current)
    if (paraRef.current) io.observe(paraRef.current)
    if (featuresRef.current) io.observe(featuresRef.current)
    if (previewTitleRef.current) io.observe(previewTitleRef.current)
    if (previewGridRef.current) io.observe(previewGridRef.current)
    if (howTitleRef.current) io.observe(howTitleRef.current)
    if (howCardRef.current) io.observe(howCardRef.current)
    if (contactCardRef.current) io.observe(contactCardRef.current)

    return () => io.disconnect()
  }, [])

  return (
    <div className="snap-y snap-mandatory overflow-y-auto h-screen">
      <section className="snap-start w-full min-h-screen bg-white flex items-center justify-center">
        <div className="relative w-full h-full">
          <img src={bg} alt="hero" className="w-full h-full object-cover" />
        </div>
      </section>

        {/* About Section*/}
      <section
        className="snap-start w-full min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-6 relative"
        style={{
          backgroundImage: `url(${chiliField})`,
        }}
      >
        {/* Title */}
        <h1 ref={titleRef} className="-mt-5 md:-mt-50 text-5xl md:text-6xl font-extrabold text-teal-700 drop-shadow-md text-center transform transition duration-700 ease-out opacity-0 translate-y-6">
          WHAT ABOUT US ?
        </h1>

        {/* Description */}
        <p ref={paraRef} className="max-w-3xl text-center mt-2 text-gray-800 font-medium leading-relaxed transform transition duration-700 ease-out opacity-0 translate-y-6">
          SMARTFARM CABAI is a modern farming project that uses technology and
          eco-friendly methods to make chili farming smarter and more efficient.
          We help farmers grow better crops, protect the environment, and build a
          greener future for agriculture.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={onLoginClick}
            aria-label="Login"
            className="inline-block text-center bg-transparent text-green-700 hover:bg-green-500 hover:text-white border-2 border-green-500/20 hover:border-transparent font-bold px-6 py-3 rounded-xl shadow-md text-lg transition-colors duration-200"
          >
            LOGIN
          </button>

          <button
            onClick={onRegisterClick}
            aria-label="Register"
            className="inline-block text-center bg-transparent text-green-700 hover:bg-green-500 hover:text-white border-2 border-green-500/20 hover:border-transparent font-bold px-6 py-3 rounded-xl shadow-md text-lg transition-colors duration-200"
          >
            REGISTER
          </button>
        </div>
      </section>

      {/* Key Features */}
      <section
        ref={featuresRef}
        className="snap-start w-full min-h-screen bg-[#A86B3E] flex flex-col items-center px-6 pt-28 md:pt-36 pb-16">
          
           {/* Title */}
      <h1 className="features-title text-4xl md:text-5xl font-extrabold text-white mb-16 transform transition duration-700 ease-out opacity-0 translate-y-6">
        KEY FEATURES
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl w-full mx-auto transform translate-x-4 md:translate-x-12">
        
        {/* Card 1 */}
        <div className="feature-card bg-[#6A3F1F] text-white rounded-3xl p-12 md:p-14 text-center text-2xl md:text-3xl font-semibold shadow-xl transform transition duration-700 ease-out opacity-0 translate-y-6 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl">
          Eco-Friendly Insights
        </div>

        {/* Card 2 */}
        <div className="feature-card bg-[#6A3F1F] text-white rounded-3xl p-12 md:p-14 text-center text-2xl md:text-3xl font-semibold shadow-xl transform transition duration-700 ease-out opacity-0 translate-y-6 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl">
          Smart Alerts
        </div>

                {/* Card 3 */}
        <div className="feature-card bg-[#6A3F1F] text-white rounded-3xl p-12 md:p-14 text-center text-2xl md:text-3xl font-semibold shadow-xl transform transition duration-700 ease-out opacity-0 translate-y-6 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl">
          Real-time Monitoring
        </div>

        {/* Card 4 */}
        <div className="feature-card bg-[#6A3F1F] text-white rounded-3xl p-12 md:p-14 text-center text-2xl md:text-3xl font-semibold shadow-xl transform transition duration-700 ease-out opacity-0 translate-y-6 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl">
          Data Dashboard
        </div>
        
      </div>
    </section>

     <section
      className="snap-start w-full min-h-screen flex flex-col items-center py-16 px-6"
      style={{
        background: "linear-gradient(to bottom, #A86B3E, #34151A)",
      }}
    >
      {/* Title */}
      <h1 ref={previewTitleRef} className="text-3xl md:text-7xl font-extrabold text-white mb-12 tracking-wide transform transition duration-700 ease-out opacity-0 translate-y-6">
        PREVIEW
      </h1>

      {/* Preview Boxes */}
      <div ref={previewGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full justify-center transform transition duration-700 ease-out opacity-0 translate-y-6">

        {/* Box 1 */}
        <div className="w-full h-135 bg-[#E3BEA8] rounded-3xl relative overflow-hidden">
          <img
            src={dashboardImg}
            alt="dashboard preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Box 2 */}
        <div className="w-full h-135 bg-[#E3BEA8] rounded-3xl relative overflow-hidden">
          <img
            src={prototypeImg}
            alt="prototype preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>

    <section
      className="snap-start w-full min-h-screen flex flex-col items-center px-6 py-28 md:py-36 relative overflow-hidden"
      style={{ backgroundColor: "#34151A" }}
    >

      {/* Title */}
      <h1 ref={howTitleRef} className="text-4xl md:text-6xl font-extrabold text-white mb-12 md:mb-16 tracking-wide transform transition duration-700 ease-out opacity-0 translate-y-6">
        HOW IT WORKS:
      </h1>

      {/* Main Card */}
      <div ref={howCardRef} className="bg-[#3a1a15] text-white rounded-3xl p-12 md:p-16 shadow-2xl max-w-3xl w-full relative transform transition duration-700 ease-out opacity-0 translate-y-6">
        
        {/* Glow behind the card */}
        <div className="absolute inset-0 rounded-2xl bg-black opacity-20 blur-2xl -z-10"></div>

        <ul className="space-y-6 text-xl md:text-2xl">
          <li className="flex items-center gap-3">
            <span className="text-yellow-300 text-3xl md:text-4xl">📡</span>
            Install Smart Sensors in your farm
          </li>

          <li className="flex items-center gap-3">
            <span className="text-green-300 text-3xl md:text-4xl">🔗</span>
            Connect to SmartFarm: Cabai
          </li>

          <li className="flex items-center gap-3">
            <span className="text-blue-300 text-3xl md:text-4xl">📊</span>
            Monitor and get insights anywhere
          </li>
        </ul>
      </div>

      {/* Read more */}
      <p className="text-white mt-6 opacity-80 hover:opacity-100 cursor-pointer">
        Read more..
      </p>
    </section>

    <section
      className="snap-start w-full h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgCave})` }}
    >
      {/* Dark overlay (optional) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content (centered vertically, moved slightly toward middle) */}
      <div className="relative z-10 px-6 py-12 h-full flex items-center justify-center md:justify-start md:items-start md:pt-8 md:pl-24">
        <div className="w-full max-w-md">

          <h1 className="text-white text-4xl font-extrabold mb-6">CONTACT INFO</h1>

          {/* Contact Box (more transparent) */}
          <div ref={contactCardRef} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 max-w-md shadow-xl transform transition duration-700 ease-out opacity-0 translate-y-6">
            <h2 className="text-white text-xl font-semibold mb-4">Send Us a Message</h2>

            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-2 rounded-lg mb-3 bg-white/20 text-white placeholder-gray-300 outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-2 rounded-lg mb-3 bg-white/20 text-white placeholder-gray-300 outline-none"
            />
            <textarea
              placeholder="Your Message..."
              className="w-full p-2 h-28 rounded-lg mb-3 bg-white/20 text-white placeholder-gray-300 outline-none"
            />
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition">
              Send Message
            </button>
          </div>

          {/* Social Icons (kept under the form) */}
          <div className="flex items-center gap-6 mt-6 text-white text-3xl">
            <a href="#" className="hover:opacity-70 transition">
              <i className="fa-brands fa-instagram" />
            </a>
            <a href="#" className="hover:opacity-70 transition">
              <i className="fa-brands fa-facebook" />
            </a>
            <a href="#" className="hover:opacity-70 transition">
              <i className="fa-brands fa-tiktok" />
            </a>
          </div>
        </div>
      </div>
    </section>

    </div>
  );
}

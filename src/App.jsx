import { useEffect, useRef, useState } from 'react';
import { FaGraduationCap, FaGlassCheers } from 'react-icons/fa';
import { FiArrowUp, FiVolume2, FiVolumeX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { sendRSVP } from './firebase.js';

const eventDate = new Date('2026-06-20T09:00:00');
const musicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
const galleryPhotos = [
  'https://d3e2rogs1zztlz.cloudfront.net/images/img1.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img2.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img3.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img4.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img5.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img6.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img7.jpg'
];

const timelineItems = [
  {
    year: '2009',
    title: 'Escuela Modelo',
    description: 'Mis primeros sueños nacieron entre cuadernos, amigos y grandes ilusiones.',
    image: 'https://d3e2rogs1zztlz.cloudfront.net/images/img1.jpg'
  },
  {
    year: '2016',
    title: 'Centro de Investigación e Innovación Educativa',
    description: 'Aquí crecieron mis metas, mi carácter y mis mejores recuerdos juveniles.',
    image: 'https://d3e2rogs1zztlz.cloudfront.net/images/img2.jpg'
  },
  {
    year: '2026',
    title: 'Universidad Nacional Autónoma de Honduras',
    description: 'La universidad transformó esfuerzo y sacrificio en conocimiento, vocación y futuro.',
    image: 'https://d3e2rogs1zztlz.cloudfront.net/images/img3.jpg'
  }
];

const eventDetails = [
  {
    icon: <FaGraduationCap className="text-cyan-500" />,
    title: 'Ceremonia',
    place: 'Polideportivo UNAH',
    date: eventDate
  },
  {
    icon: <FaGlassCheers className="text-cyan-500" />,
    title: 'Fiesta',
    place: 'Lugar X',
    date: new Date(eventDate.getTime() + 6 * 60 * 60 * 1000)
  }
];

function getTimeRemaining(target) {
  const total = target - new Date();
  const seconds = Math.max(Math.floor((total / 1000) % 60), 0);
  const minutes = Math.max(Math.floor((total / 1000 / 60) % 60), 0);
  const hours = Math.max(Math.floor((total / (1000 * 60 * 60)) % 24), 0);
  const days = Math.max(Math.floor(total / (1000 * 60 * 60 * 24)), 0);
  return { total, days, hours, minutes, seconds };
}

export default function App() {
  const [countdown, setCountdown] = useState(getTimeRemaining(eventDate));
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [attending, setAttending] = useState('yes');
  const [status, setStatus] = useState('');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getTimeRemaining(eventDate));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => { });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => { });
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !message.trim()) {
      setStatus('Please enter your name and message.');
      return;
    }

    setStatus('Sending...');
    try {
      await sendRSVP({ name: name.trim(), message: message.trim(), attending });
      setStatus('Thank you! Your congratulations message was sent.');
      setName('');
      setMessage('');
      setAttending('yes');
    } catch (error) {
      console.error(error);
      setStatus('Could not send RSVP yet. Please try again later.');
    }
  };

  const nextSlide = () => setCarouselIndex((current) => (current + 1) % galleryPhotos.length);
  const prevSlide = () => setCarouselIndex((current) => (current - 1 + galleryPhotos.length) % galleryPhotos.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((current) => (current + 1) % galleryPhotos.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const cover = document.getElementById('cover');
      if (!cover) return;
      setShowBackToTop(window.scrollY > cover.offsetHeight);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'timeline', label: 'El camino' },
    { id: 'details', label: 'Detalles del evento' },
    { id: 'gallery', label: 'Fotos' },
    { id: 'rsvp', label: 'RSVP' }
  ];

  const handleNavClick = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen">
      <section
        id="cover"
        className="relative w-full min-h-screen bg-center bg-cover flex items-center"
        style={{ backgroundImage: `url(${galleryPhotos[2]})` }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <div className="max-w-2xl text-slate-100">
            <p className="inline-flex rounded-full border px-4 py-2 text-sm uppercase tracking-[0.25em]">
              Te invito a mi graduación
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Dra. Kathia García
            </h1>
            <p className="mt-4 text-xl leading-8">
              {eventDate.toLocaleString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }).replace(/^./, (char) => char.toUpperCase())}
            </p>
            <p className="mt-4 max-w-3xl text-slate-200">
              Acompáñennos en una celebración para conmemorar la graduación de la Dra. Kathia García.
            </p>

            <div className="mt-8 w-full rounded-[28px] border p-6 shadow-xl">
              <h2 className="text-2xl font-semibold">Cuenta regresiva</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                <div className="rounded-3xl p-5 text-center ring-1">
                  <p className="text-4xl font-semibold">{countdown.days}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em]">Días</p>
                </div>
                <div className="rounded-3xl p-5 text-center ring-1">
                  <p className="text-4xl font-semibold">{countdown.hours}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em]">Horas</p>
                </div>
                <div className="rounded-3xl p-5 text-center ring-1">
                  <p className="text-4xl font-semibold">{countdown.minutes}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em]">Minutos</p>
                </div>
                <div className="rounded-3xl p-5 text-center ring-1">
                  <p className="text-4xl font-semibold">{countdown.seconds}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em]">Segundos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="fixed top-4 left-0 right-0 mx-auto max-w-6xl z-50 flex flex-wrap items-center justify-center gap-3 px-4 backdrop-blur-sm text-cyan-500">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="rounded-full border px-4 py-2 text-sm font-medium transition"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <audio ref={audioRef} src={musicUrl} type="audio/mp3" loop preload="auto" autoPlay />
        <button
          onClick={handleBackToTop}
          className={`fixed bottom-20 right-6 z-50 rounded-full bg-cyan-500 px-5 py-4 text-sm font-semibold text-slate-950 shadow-2xl transition duration-300 hover:bg-cyan-400 ${showBackToTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          aria-label="Back to top"
        >
          <FiArrowUp className="h-5 w-5" />
        </button>
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-gray-500 px-5 py-4 text-sm font-semibold text-slate-950 shadow-2xl transition hover:bg-gray-400"
          aria-label={musicPlaying ? 'Pause background music' : 'Play background music'}
        >
          {musicPlaying ? <FiVolume2 className="h-5 w-5" /> : <FiVolumeX className="h-5 w-5" />}
        </button>

        <div className="h-16" aria-hidden="true" />

        <main className="space-y-10">
          <section id="timeline" className="rounded-[32px] border p-6 shadow-xl">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em]">Mi carrera académica</p>
                <h2 className="mt-3 text-3xl font-semibold">El camino recorrido</h2>
              </div>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {timelineItems.map((item) => (
                <article key={item.year} className="overflow-hidden rounded-3xl border shadow-lg">
                  <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
                  <div className="space-y-3 p-5">
                    <p className="text-xs uppercase tracking-[0.28em]">{item.year}</p>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-sm leading-6">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="details" className="rounded-[32px] border p-6 shadow-xl">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em]">Detalles del evento</p>
                <h2 className="mt-3 text-3xl font-semibold">Mi graduación</h2>
              </div>
            </div>
            <div className="mt-8 grid gap-6 xl:grid-cols-2">
              {eventDetails.map((event) => (
                <div key={event.title} className="rounded-3xl border p-6 shadow-lg">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ring-1">
                    {event.icon}
                  </div>
                  <h3 className="text-2xl font-semibold">{event.title}</h3>
                  <p className="mt-4 text-sm"><span className="font-semibold">Lugar:</span> {event.place}</p>
                  <p className="text-sm"><span className="font-semibold">Día:</span> {event.date.toLocaleString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }).replace(/^./, (char) => char.toUpperCase())}</p>
                  <p className="text-sm"><span className="font-semibold">Hora:</span> {event.date.toLocaleString('es-ES', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  }).replace(/^./, (char) => char.toUpperCase())}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="gallery" className="rounded-[32px] border p-6 shadow-xl">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em]">Galería de fotos</p>
                <h2 className="mt-3 text-3xl font-semibold">Mis mejores recuerdos</h2>
              </div>
            </div>
            <div className="mt-8 rounded-[28px] border p-4">
              <div className="relative overflow-hidden rounded-[28px] h-[550px] sm:h-[680px]">
                {galleryPhotos.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`Slide ${idx + 1}`}
                    aria-hidden={idx !== carouselIndex}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 pointer-events-none ${idx === carouselIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  />
                ))}
                <div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-4 z-20">
                  <button onClick={prevSlide} className="rounded-full px-4 py-2 text-sm font-semibold ring-1 transition" aria-label="Previous slide">
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={nextSlide} className="rounded-full px-4 py-2 text-sm font-semibold ring-1 transition" aria-label="Next slide">
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                {galleryPhotos.map((_, index) => (
                  <button key={index} onClick={() => setCarouselIndex(index)} className={`h-2.5 w-2.5 rounded-full ${index === carouselIndex ? 'bg-gray-300' : 'bg-black-600'}`} />
                ))}
              </div>
            </div>
          </section>

          <section id="rsvp" className="rounded-[32px] border p-6 shadow-xl">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em]">RSVP</p>
                <h2 className="mt-3 text-3xl font-semibold">Dejame un mensaje</h2>
              </div>
            </div>
            <p className="mt-4 max-w-2xl">Confirmá tu asistencia a la ceremonia de graduación</p>
            <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-medium">
                Tu nombre
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="rounded-3xl border border-slate-700 px-4 py-3 outline-none ring-1 transition"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Mensaje de felicitación
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your congratulations message"
                  rows="4"
                  className="rounded-3xl border px-4 py-3 outline-none ring-1 transition"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                ¿Asistirás a a la fiesta de graduación?
                <select
                  value={attending}
                  onChange={(e) => setAttending(e.target.value)}
                  className="rounded-3xl border px-4 py-3 outline-none ring-1 transition"
                >
                  <option value="yes">Sí, allá nos vemos</option>
                  <option value="no">No, no puedo asistir</option>
                </select>
              </label>
              <button type="submit" className="inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition">
                Enviar
              </button>
              {status && <p className="text-sm">{status}</p>}
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

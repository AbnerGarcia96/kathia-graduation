import { useEffect, useRef, useState } from 'react';
import { FaBriefcaseMedical, FaGraduationCap, FaGlassCheers, FaHospital, FaHospitalSymbol, FaMedkit, FaNotesMedical, FaPills } from 'react-icons/fa';
import { FiAlertCircle, FiArrowUp, FiChevronLeft, FiChevronRight, FiFrown, FiInfo, FiLoader } from 'react-icons/fi';
import { GiCaduceus } from "react-icons/gi";
import { MdMusicNote, MdMusicOff } from 'react-icons/md';

const eventDate = new Date('2026-06-20T14:00:00');
const musicUrl = 'https://d3e2rogs1zztlz.cloudfront.net/audio/music.mp3';
const galleryPhotos = [
  'https://d3e2rogs1zztlz.cloudfront.net/images/img1.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img2.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img3.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img4.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img5.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img6.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img7.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img8.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img9.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img10.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img11.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img12.jpg',
  'https://d3e2rogs1zztlz.cloudfront.net/images/img13.jpg'
];

const timelineItems = [
  {
    year: '2009',
    title: 'Escuela Modelo',
    description: 'Mis primeros sueños nacieron entre cuadernos, amigos y grandes ilusiones.',
    image: 'https://d3e2rogs1zztlz.cloudfront.net/images/img8.jpg',
    alignment: 'object-[0%_20%] md:object-[5%_25%]'
  },
  {
    year: '2016',
    title: 'Centro de Investigación e Innovación Educativa',
    description: 'Aquí crecieron mis metas, mi carácter y mis mejores recuerdos juveniles.',
    image: 'https://d3e2rogs1zztlz.cloudfront.net/images/img13.jpg',
    alignment: 'object-[-5%_15%] md:object-[5%_25%]'
  },
  {
    year: '2026',
    title: 'Universidad Nacional Autónoma de Honduras',
    description: 'La universidad transformó esfuerzo y sacrificio en conocimiento, vocación y futuro.',
    image: 'https://d3e2rogs1zztlz.cloudfront.net/images/img3.jpg',
    alignment: 'object-center md:object-center'
  }
];

const eventDetails = [
  {
    icon: <FaGraduationCap className="text-cyan-500" />,
    title: 'Ceremonia',
    place: 'Polideportivo UNAH, Tegucigalpa',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Polideportivo UNAH Tegucigalpa Honduras'),
    date: eventDate
  },
  {
    icon: <FaGlassCheers className="text-cyan-500" />,
    title: 'Fiesta',
    place: 'Restaurante NiFu NiFa, Tegucigalpa',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Restaurante NiFu NiFa Tegucigalpa Honduras'),
    date: new Date(eventDate.getTime() + 6 * 60 * 60 * 1000)
  }
];

const medicalPatternIcons = [FaPills, FaHospital, FaMedkit, FaBriefcaseMedical, FaNotesMedical, FaHospitalSymbol, GiCaduceus];

const renderMedicalPattern = (seed = 0) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]" aria-hidden="true">
    {Array.from({ length: 12 }).map((_, index) => {
      const Icon = medicalPatternIcons[(index + seed) % medicalPatternIcons.length];
      const left = `${(index * 11 + 6 + (seed % 3) * 5) % 100}%`;
      const top = `${(index * 13 + 5 + (seed % 4) * 7) % 100}%`;
      const size = 18 + ((index + seed) % 4) * 8;

      return (
        <Icon
          key={`${seed}-${index}`}
          className="absolute text-cyan-500/50"
          style={{
            left,
            top,
            fontSize: `${size}px`,
            opacity: 0.18 + ((index + seed) % 3) * 0.12,
            transform: `rotate(${(index + seed) % 2 === 0 ? 8 : -10}deg)`,
            filter: 'brightness(0.8) drop-shadow(0 0 1px rgba(14, 165, 233, 0.35))',
          }}
        />
      );
    })}
  </div>
);

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
  const [attending, setAttending] = useState(true);
  const [status, setStatus] = useState('');
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [autoCloseProgress, setAutoCloseProgress] = useState(100);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const getStatusIcon = (message) => {
    const normalized = message.toLowerCase();

    if (normalized.includes('gracias') || normalized.includes('asistencia')) {
      return <FaGlassCheers className="h-12 w-12 sm:h-15 sm:w-15 text-emerald-500" aria-hidden="true" />;
    }

    if (normalized.includes('lamentamos') || normalized.includes('no puedas') || normalized.includes('no puedo')) {
      return <FiFrown className="h-12 w-12 sm:h-15 sm:w-15 text-rose-500" aria-hidden="true" />;
    }

    if (normalized.includes('escriba') || normalized.includes('nombre') || normalized.includes('mensaje') || normalized.includes('no se pudo') || normalized.includes('sending')) {
      return <FiAlertCircle className="h-12 w-12 sm:h-15 sm:w-15 text-amber-500" aria-hidden="true" />;
    }

    return <FiInfo className="h-12 w-12 sm:h-15 sm:w-15 text-cyan-500" aria-hidden="true" />;
  };

  const sendRSVP = async (formData) => {
    const response = await fetch('https://k3gqqptkf8.execute-api.us-east-1.amazonaws.com/api_prod/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || 'Failed to save RSVP.');
    }

    return response.json();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !message.trim()) {
      setStatus('Escriba su nombre y su mensaje de felicitación');
      return;
    }

    setIsSubmitting(true);
    setStatus('Enviando...');

    try {
      await sendRSVP({ name: name.trim(), message: message.trim(), attending });
      setStatus(
        attending
          ? 'Gracias por confirmar tu asistencia. ¡Nos vemos en la celebración!'
          : 'Lamentamos que no puedas asistir.'
      );
      setName('');
      setMessage('');
      setAttending(true);
    } catch (error) {
      console.error(error);
      setStatus('No se pudo enviar el mensaje, intente más tarde.');
    } finally {
      setIsSubmitting(false);
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
    if (status) {
      setIsClosing(false);
      setIsDialogVisible(false);
      setIsStatusDialogOpen(true);

      const animationFrame = window.requestAnimationFrame(() => {
        setIsDialogVisible(true);
      });

      setAutoCloseProgress(100);
      const startedAt = Date.now();
      const progressInterval = window.setInterval(() => {
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, 5000 - elapsed);
        const progress = (remaining / 5000) * 100;
        setAutoCloseProgress(progress);
      }, 100);

      const autoCloseTimer = window.setTimeout(() => {
        closeStatusDialog();
      }, 5000);

      return () => {
        window.cancelAnimationFrame(animationFrame);
        window.clearInterval(progressInterval);
        window.clearTimeout(autoCloseTimer);
      };
    }
  }, [status]);

  useEffect(() => {
    const handleScroll = () => {
      const cover = document.getElementById('cover');
      if (!cover) return;

      const isScrolled = window.scrollY > 40;
      setIsNavSticky(isScrolled);
      setShowBackToTop(window.scrollY > cover.offsetHeight);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'timeline', label: 'El camino' },
    { id: 'details', label: 'Detalles del evento' },
    { id: 'live', label: 'En vivo' },
    { id: 'gallery', label: 'Fotos' },
    { id: 'rsvp', label: 'RSVP' }
  ];

  const handleNavClick = (id) => {
    const el = document.getElementById(id);

    if (!el) return;

    const offset = 96;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  };

  const closeStatusDialog = () => {
    setIsClosing(true);
    setIsDialogVisible(false);

    window.setTimeout(() => {
      setIsStatusDialogOpen(false);
      setStatus('');
      setIsClosing(false);
    }, 250);
  };

  return (
    <div className="min-h-screen">
      <section
        id="cover"
        className={`bg-[url(https://d3e2rogs1zztlz.cloudfront.net/images/background-dark.png)] relative w-full min-h-screen bg-[position:90%_center] lg:bg-center bg-cover flex items-center`}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 mx-auto flex w-full max-w-6xl items-start justify-start px-4 py-24 sm:py-32">
          <div className="max-w-2xl text-slate-100 text-left">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.25em]">
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
            <p className="mt-4 max-w-3xl">
              Acompáñennos en una celebración para conmemorar la graduación de la Dra. Kathia García.
            </p>

            <div className="w-full">
              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                <div className="rounded-3xl text-white p-5 text-center bg-white/10">
                  <p className="text-4xl font-semibold">{countdown.days}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em]">Días</p>
                </div>
                <div className="rounded-3xl text-white p-5 text-center bg-white/10">
                  <p className="text-4xl font-semibold">{countdown.hours}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em]">Horas</p>
                </div>
                <div className="rounded-3xl text-white p-5 text-center bg-white/10">
                  <p className="text-4xl font-semibold">{countdown.minutes}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em]">Minutos</p>
                </div>
                <div className="rounded-3xl text-white p-5 text-center bg-white/10">
                  <p className="text-4xl font-semibold">{countdown.seconds}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em]">Segundos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-0 opacity-40 animate-[patternPulse_8s_ease-in-out_infinite]" aria-hidden="true">
          {Array.from({ length: 84 }).map((_, index) => {
            const Icon = medicalPatternIcons[index % medicalPatternIcons.length];
            const left = `${(index * 4 + 2) % 100}%`;
            const top = `${(index * 6 + (index % 6) * 3) % 100}%`;
            const size = 24 + (index % 5) * 10;

            return (
              <Icon
                key={index}
                className="absolute text-cyan-700/80 animate-[float_6s_ease-in-out_infinite]"
                style={{
                  left,
                  top,
                  fontSize: `${size}px`,
                  opacity: 0.18 + (index % 4) * 0.08,
                  transform: `rotate(${index % 2 === 0 ? 8 : -10}deg)`,
                  animationDelay: `${(index % 7) * 0.4}s`,
                  animationDuration: `${7 + (index % 4) * 1.68}s`,
                  filter: 'brightness(0.8)',
                }}
              />
            );
          })}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(224,242,254,0.25),_transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl">
        <nav className={`fixed top-0 py-2 left-0 right-0 mx-auto z-50 flex flex-wrap items-center justify-center gap-3 px-4 backdrop-blur-sm text-white`}>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${isNavSticky ? 'border border-cyan-500 bg-cyan-500' : 'border-white'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <audio ref={audioRef} src={musicUrl} type="audio/mp3" loop preload="auto" autoPlay />
        <button
          onClick={handleBackToTop}
          className={`fixed bottom-20 right-6 z-50 rounded-full bg-gray-500 px-5 py-4 text-sm font-semibold text-white shadow-2xl transition duration-300 hover:bg-gray-400 ${showBackToTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          aria-label="Back to top"
        >
          <FiArrowUp className="h-5 w-5" />
        </button>
        <button
          onClick={toggleMusic}
          className={`fixed bottom-6 right-6 z-50 rounded-full bg-cyan-500 px-5 py-4 text-sm font-semibold text-white shadow-2xl transition hover:bg-cyan-500 ${musicPlaying ? 'animate-pulse shadow-cyan-500/30' : ''}`}
          aria-label={musicPlaying ? 'Pause background music' : 'Play background music'}
        >
          {musicPlaying ? <MdMusicNote className="h-5 w-5" /> : <MdMusicOff className="h-5 w-5" />}
        </button>

        <div className="h-16" aria-hidden="true" />

        <main className="relative z-10 space-y-10">
          <section id="timeline" className="rounded-[32px] border p-6 shadow-xl relative z-10 bg-white/90">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em]">Mi carrera académica</p>
                <h2 className="mt-3 text-3xl font-semibold">El camino recorrido</h2>
              </div>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {timelineItems.map((item) => (
                <article key={item.year} className="overflow-hidden rounded-3xl border">
                  <img src={item.image} alt={item.title} className={`h-44 w-full object-cover ${item.alignment}`} />
                  <div className="space-y-3 p-5">
                    <p className="text-xs uppercase tracking-[0.28em]">{item.year}</p>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-sm leading-6">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="details" className="relative isolate overflow-hidden rounded-[32px] border p-6 shadow-xl bg-white/90">
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em]">Detalles del evento</p>
                  <h2 className="mt-3 text-3xl font-semibold">Mi graduación</h2>
                </div>
              </div>
              <div className="mt-8 grid gap-6 xl:grid-cols-2">
                {eventDetails.map((event) => (
                  <div key={event.title} className="rounded-3xl border p-6">
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
                    })}</p>
                    <p className="text-sm"><span className="font-semibold">Hora:</span> {event.date.toLocaleString('es-ES', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}</p>
                    <a
                      href={event.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-sm font-medium text-cyan-500 underline decoration-cyan-500/70 underline-offset-4 transition hover:text-cyan-500"
                    >
                      Ver en Google Maps
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="live" className="relative isolate overflow-hidden rounded-[32px] border p-6 shadow-xl bg-white/90">
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em]">En vivo</p>
                  <h2 className="mt-3 text-3xl font-semibold">Mira la ceremonia en el canal de la UNAH</h2>
                </div>
              </div>
              <div className="mt-8 overflow-hidden rounded-[28px] border bg-slate-950/95 shadow-inner">
                <div className="aspect-video w-full">
                  <iframe
                    src="https://www.youtube.com/embed/uTsrVE2_0go?si=eRfAOyvu7Tex1Bcr"
                    title="YouTube live stream"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>
          </section>

          <section id="gallery" className="relative isolate overflow-hidden rounded-[32px] border p-6 shadow-xl bg-white/90">
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em]">Galería de fotos</p>
                  <h2 className="mt-3 text-3xl font-semibold">Mis mejores recuerdos</h2>
                </div>
              </div>
              <div className="mt-8 rounded-[28px]">
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
            </div>
          </section>

          <section id="rsvp" className="relative isolate overflow-hidden rounded-[32px] border p-6 shadow-xl bg-white/90">
            <div className="relative z-10">
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
                    disabled={isSubmitting}
                    className="rounded-3xl border px-4 py-3 outline-none ring-1 transition disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Mensaje de felicitación
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your congratulations message"
                    rows="4"
                    disabled={isSubmitting}
                    className="rounded-3xl border px-4 py-3 outline-none ring-1 transition disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  ¿Asistirás a a la fiesta de graduación?
                  <select
                    value={String(attending)}
                    onChange={(e) => setAttending(e.target.value === 'true')}
                    disabled={isSubmitting}
                    className="rounded-3xl border px-4 py-3 outline-none ring-1 transition disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <option value="true">Sí, allá nos vemos</option>
                    <option value="false">No, no puedo asistir</option>
                  </select>
                </label>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mx-auto inline-flex w-fit items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-cyan-500"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <FiLoader className="h-4 w-4 animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    'Enviar'
                  )}
                </button>
                {status && <p className="text-sm">{status}</p>}
              </form>
            </div>
          </section>
        </main>
        </div>
      </div>

      {isStatusDialogOpen && status && (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 transition-opacity duration-300 ease-out ${isClosing || !isDialogVisible ? 'opacity-0' : 'opacity-100'}`}>
          <div className={`relative w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 pb-0 text-slate-900 shadow-2xl transition-all duration-300 ease-out transform ${isClosing || !isDialogVisible ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
            <button
              type="button"
              onClick={closeStatusDialog}
              className="absolute top-4 right-4 rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-100"
              aria-label="Close status dialog"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="mt-1 flex items-center justify-center" aria-label="Status icon">
                {getStatusIcon(status)}
              </div>
            </div>

            <p className="mt-4 text-center text-[17px] sm:text-lg pb-6 leading-8 text-slate-700">{status}</p>

            <div className="absolute inset-x-0 bottom-0 h-2 rounded-b-[28px] bg-slate-200 shadow-inner">
              <div
                className="h-full rounded-b-[28px] bg-[var(--secondary)] transition-[width] duration-100 ease-linear"
                style={{ width: `${autoCloseProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

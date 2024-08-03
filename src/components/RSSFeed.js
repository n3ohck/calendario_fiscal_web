import React, {useEffect, useState} from 'react';
import axios from 'axios';

const RSSFeed = () => {
    const [feeds, setFeeds] = useState([]);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [month, setMonth] = useState('08');
    const [year, setYear] = useState('2024');
    const [years] = useState(['2023', '2024', '2025']); // Ejemplo de años disponibles
    const [months] = useState([
        '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'
    ]); // Ejemplo de meses disponibles
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFeed, setSelectedFeed] = useState(null);
    useEffect(() => {
        fetchRSSFeeds();
    }, [month, year]);

    const fetchRSSFeeds = async () => {
        try {
            const response = await fetch(`https://calendario-fiscal.vercel.app/api/sat/events?tax_regime_id=1&year=${year}&month=${month}`);
            const data = await response.json();
            setFeeds(data);
        } catch (err) {
            console.error('Error fetching RSS feeds:', err);
        }
    };

    const handleSubscribe = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post('https://calendario-fiscal.vercel.app/api/suscribe', {
                email: email,
                taxRegimeId: 1
            });
            alert('Suscripción exitosa!');
            setEmail('');
        } catch (err) {
            console.error('Error subscribing:', err);
            setError('Hubo un problema al suscribirse.');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (feed) => {
        setSelectedFeed(feed);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFeed(null);
    };


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gray-900 py-20">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 lg:w-2/3">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-bold mb-6">
                                Bienvenido a <br className="hidden md:block"/>
                                <span className="text-indigo-500">Calendario</span> Fiscal MX
                            </h1>
                            <p className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-8">
                                Mantente al tanto de las fechas fiscales importantes en México.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-3xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Suscríbete a
                                las
                                notificaciones</h3>
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Tu correo electrónico"
                                    className="flex-1 px-4 py-2 mb-4 sm:mb-0 sm:mr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className={`px-6 py-3 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'bg-blue-400' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Enviando...' : 'Suscribirme'}
                                </button>
                            </form>
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-8 mt-4 shadow-lg">
                <div className="bg-gray-900 p-4 shadow-md flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div>
                            <label htmlFor="month" className="block text-sm font-medium text-white">Mes</label>
                            <select
                                id="month"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                {months.map(m => (
                                    <option key={m} value={m}>
                                        {new Date(`2020-${m}-01`).toLocaleString('es-ES', {month: 'long'})}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="year" className="block text-sm font-medium text-white">Año</label>
                            <select
                                id="year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                {years.map(y => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full mx-auto dark:text-gray-800">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-4 sm:grid-cols-2">
                    {feeds.map(feed => (
                        <div key={feed.id}
                             className="relative shadow flex items-end justify-start w-full text-left dark:bg-gray-500 bg-center bg-cover bg-no-repeat h-96"
                             style={{
                                 backgroundImage: `url(${feed.image})`,
                                 backgroundSize: 'cover',
                                 backgroundPosition: 'center center',
                                 opacity: 0.9
                             }}
                        >
                            <div
                                className="absolute top-0 bottom-0 left-0 right-0"></div>
                            <div className="absolute top-0 bottom-0 left-0 right-0 bg-blur-filter"></div>
                            <div className="absolute top-0 left-0 right-0 flex items-center justify-between mx-5 mt-3">
                                <a rel="noopener noreferrer" href="#"
                                   className="px-3 py-2 text-xs font-semibold tracking-wider uppercase text-white dark:bg-blue-950">
                                    {feed.status_event}
                                </a>
                                <div
                                    className="flex flex-col shadow justify-start text-center dark:text-gray-800 bg-blue-950 p-3">
                                    <span
                                        className="text-3xl font-semibold leading-none tracking-wide text-white">04</span>
                                    <span className="leading-none uppercase text-white">Aug</span>
                                </div>
                            </div>
                            <h2 className="z-10">
                                <button
                                    onClick={() => openModal(feed)}
                                    className="font-medium text-md hover:underline p-3 bg-blue-950 text-white">
                                    {feed.title}
                                </button>
                            </h2>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && selectedFeed && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-blue-950 bg-opacity-50">
                    <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-white">{selectedFeed.title}</h2>
                        <p className="text-gray-700 text-white mb-4">{selectedFeed.description}</p>
                    </div>
                </div>
            )}

            <footer className="bg-white mt-20">
                <div className="border-b border-gray-100"></div>
                <div className="container px-4 mx-auto">
                    <p className="py-10 md:pb-20 text-md text-gray-400 font-medium text-center">
                        © 2024 calendariofiscalmx
                        All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
        ;
};

export default RSSFeed;

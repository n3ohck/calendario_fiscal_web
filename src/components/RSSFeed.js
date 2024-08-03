import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RSSFeed = () => {
    const [feeds, setFeeds] = useState([]);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRSSFeeds();
    }, []);

    const fetchRSSFeeds = async () => {
        try {
            const response = await fetch('https://calendario-fiscal.vercel.app/api/sat/events?tax_regime_id=1&year=2024&month=08');
            const data = await response.json();
            setFeeds(data);
        } catch (err) {
            console.error('Error fetching RSS feeds:', err);
        }
    };

    const handleSubscribe = async (event) => {
        event.preventDefault(); // Evita que el formulario se recargue

        setLoading(true);
        setError(null);

        try {
            await axios.post('https://calendario-fiscal.vercel.app/api/suscribe', {
                email: email,
                taxRegimeId: 1 // Cambia esto según tus necesidades
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

    return (
        <div className="container mx-auto p-10">
            <h1 className="text-2xl font-bold mt-4">Calendario Fiscal MX</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feeds.map(feed => (
                    <div key={feed.id} className="flex justify-center items-center min-h-screen">
                        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden transform transition duration-500 hover:scale-105">
                            <div className="relative">
                                <img className="w-full h-32 object-cover" src={feed.image} alt={feed.title} />
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-2 text-gray-800">{feed.title}</h2>
                                <p className="text-gray-600 mb-4">{feed.description}</p>
                                <div className="flex justify-between items-center">
                                    <button className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-300 ease-in-out">
                                        {feed.status_event}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-full justify-center items-center">
                <div className="flex dark:bg-gray-800 flex-wrap items-center w-full max-w-9xl p-5 mx-auto text-left border border-gray-200 rounded lg:flex-nowrap md:p-8 dark:border-gray-700">
                    <div className="flex-1 w-full mb-5 md:mb-0 md:pr-5 lg:pr-10 md:w-1/2">
                        <h3 className="mb-2 text-2xl font-bold text-gray-700 dark:text-gray-200">Suscríbete a las notificaciones</h3>
                        <p className="text-gray-500 dark:text-gray-400">Te avisaremos sobre las actualizaciones del calendario fiscal.</p>
                    </div>
                    <div className="w-full px-1 flex-0 md:w-auto lg:w-1/2">
                        <form onSubmit={handleSubscribe} noValidate="">
                            <input type="hidden" name="tags" value="earlyaccess" />
                            <div className="flex flex-col sm:flex-row">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Tu correo electrónico"
                                    className="flex-1 px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md sm:mr-5 focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                                />
                                <button
                                    type="submit"
                                    className="w-full px-6 py-4 mt-5 text-white text-lg bg-gray-900 rounded-md sm:mt-0 sm:w-auto whitespace-nowrap dark:bg-gray-900"
                                    disabled={loading}
                                >
                                    {loading ? 'Enviando...' : 'Suscribirme'}
                                </button>
                            </div>
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RSSFeed;

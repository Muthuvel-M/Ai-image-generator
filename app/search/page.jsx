'use client';

import { useState } from 'react';
import { Search, Sparkles, TrendingUp } from 'lucide-react';

export default function SemanticSearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, top_k: 5 })
            });

            const data = await res.json();
            setResults(data.results || []);
        } catch (error) {
            console.error('Search error:', error);
            alert('Error connecting to search server. Make sure backend is running!');
        }
        setLoading(false);
    };

    const logFeedback = async (resultId, rating) => {
        try {
            await fetch('http://localhost:8000/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    result_id: resultId,
                    clicked: true,
                    rating
                })
            });
        } catch (error) {
            console.error('Feedback error:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/stats');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Stats error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="w-10 h-10 text-indigo-600" />
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Semantic Search
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg">
                        AI-powered knowledge search using vector embeddings
                    </p>
                    {stats && (
                        <div className="mt-4 flex gap-6 justify-center text-sm text-gray-500">
                            <span>📚 {stats.total_documents} documents</span>
                            <span>🔍 {stats.total_searches} searches</span>
                            <span>⭐ {stats.average_rating}/5 avg rating</span>
                        </div>
                    )}
                </div>

                {/* Search Box */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Ask anything... (e.g., 'What is quantum computing?')"
                                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={loading || !query.trim()}
                            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Searching...
                                </span>
                            ) : (
                                'Search'
                            )}
                        </button>
                    </div>

                    {/* Sample Queries */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-sm text-gray-500">Try:</span>
                        {[
                            'What is machine learning?',
                            'Explain blockchain',
                            'How does quantum computing work?'
                        ].map((sample) => (
                            <button
                                key={sample}
                                onClick={() => setQuery(sample)}
                                className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                            >
                                {sample}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                {results.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Results ({results.length})
                            </h2>
                            <button
                                onClick={fetchStats}
                                className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2 text-sm"
                            >
                                <TrendingUp className="w-4 h-4" />
                                Refresh Stats
                            </button>
                        </div>

                        {results.map((result, idx) => {
                            const relevance = result.distance
                                ? Math.max(0, (1 - result.distance) * 100)
                                : 85;

                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-indigo-200"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-indigo-600">
                                                #{idx + 1}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 bg-gray-200 rounded-full w-24 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                                                        style={{ width: `${relevance}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-600">
                                                    {relevance.toFixed(0)}% match
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-800 text-lg leading-relaxed mb-4">
                                        {result.document}
                                    </p>

                                    {/* Feedback buttons */}
                                    <div className="flex gap-2">
                                        <span className="text-sm text-gray-500 mr-2">Helpful?</span>
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                                key={rating}
                                                onClick={() => logFeedback(result.id, rating)}
                                                className="text-lg hover:scale-125 transition-transform"
                                                title={`Rate ${rating} stars`}
                                            >
                                                ⭐
                                            </button>
                                        ))}
                                    </div>

                                    {result.metadata && Object.keys(result.metadata).length > 0 && (
                                        <div className="mt-3 text-xs text-gray-400">
                                            ID: {result.id} | Topic: {result.metadata.topic}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty state */}
                {!loading && results.length === 0 && query && (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <p className="text-gray-500 text-lg">
                            No results found. Try a different query!
                        </p>
                    </div>
                )}

                {/* Instructions */}
                {!query && (
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            How it works
                        </h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start gap-3">
                                <span className="text-indigo-600 font-bold">1.</span>
                                <span>Enter your question or topic in natural language</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-indigo-600 font-bold">2.</span>
                                <span>AI converts your query to semantic embeddings</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-indigo-600 font-bold">3.</span>
                                <span>Vector database finds most relevant documents</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-indigo-600 font-bold">4.</span>
                                <span>Rate results to improve future searches!</span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

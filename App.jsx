import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Search, Home, DollarSign, MapPin, TrendingUp, Calendar } from 'lucide-react';

export default function RebaApp() {
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState('');

  // Initialize Speech Recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Voice recognition not supported in this browser. Please use Chrome or Edge.');
    }
  }, []);

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      setTranscript('Listening...');
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(`You said: "${speechResult}"`);
      setSearchQuery(speechResult);
      handleSearch(speechResult);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setError('Voice recognition error. Please try again.');
      setTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setError('');
    
    try {
      // Demo data - In production, replace with actual Zillow API call
      // const response = await fetch('https://zillow-com1.p.rapidapi.com/property', {
      //   method: 'GET',
      //   headers: {
      //     'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY',
      //     'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
      //   }
      // });
      
      // Simulating API response with demo data
      setTimeout(() => {
        const demoProperty = {
          address: query || '123 Main Street, Beverly Hills, CA 90210',
          price: '$2,850,000',
          bedrooms: 4,
          bathrooms: 3.5,
          sqft: '3,250',
          yearBuilt: 2015,
          propertyType: 'Single Family Home',
          lotSize: '8,500 sq ft',
          neighborhood: 'Beverly Hills',
          zipCode: '90210',
          salesHistory: [
            { date: '2023-06-15', price: '$2,850,000', event: 'Sold' },
            { date: '2020-03-20', price: '$2,450,000', event: 'Sold' },
            { date: '2015-08-10', price: '$2,100,000', event: 'Sold (New Construction)' }
          ],
          taxInfo: {
            annualTax: '$28,500',
            taxYear: 2024,
            assessedValue: '$2,650,000'
          },
          neighborhoodInfo: {
            medianPrice: '$2,950,000',
            schools: 'Highly Rated',
            walkScore: 78,
            crimeRate: 'Low',
            appreciation: '+8.5% (YoY)'
          },
          features: [
            'Swimming Pool',
            'Gourmet Kitchen',
            'Smart Home System',
            'Hardwood Floors',
            'Mountain Views',
            'Two-Car Garage'
          ]
        };
        
        setPropertyData(demoProperty);
        setLoading(false);
      }, 1500);
      
    } catch (err) {
      setError('Failed to fetch property data. Please check your API key and try again.');
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Home className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">REBA</h1>
                <p className="text-blue-100 text-sm">Real Estate Business Assistant</p>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm text-blue-100">Voice-Activated MLS Search</p>
              <p className="text-xs text-blue-200">Powered by Zillow Data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Search Properties by Voice</h2>
            <p className="text-gray-600">Tap the microphone and say an address</p>
          </div>

          {/* Voice Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={startVoiceRecognition}
              disabled={isListening}
              className={`p-8 rounded-full transition-all transform hover:scale-105 ${
                isListening 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
              } text-white shadow-2xl`}
            >
              {isListening ? (
                <MicOff className="w-16 h-16" />
              ) : (
                <Mic className="w-16 h-16" />
              )}
            </button>
          </div>

          {transcript && (
            <p className="text-center text-gray-600 mb-4 italic">{transcript}</p>
          )}

          {/* Manual Search */}
          <div className="flex gap-2 max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              placeholder="Or type an address manually..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={() => handleSearch(searchQuery)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
              {error}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Searching MLS database...</p>
          </div>
        )}

        {/* Property Results */}
        {propertyData && !loading && (
          <div className="space-y-6">
            {/* Main Property Info */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <h3 className="text-2xl font-bold mb-2">{propertyData.address}</h3>
                <p className="text-3xl font-bold text-blue-100">{propertyData.price}</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Home className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold text-gray-800">{propertyData.bedrooms}</p>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-800">{propertyData.bathrooms}</p>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-800">{propertyData.sqft}</p>
                    <p className="text-sm text-gray-600">Sq Ft</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-800">{propertyData.yearBuilt}</p>
                    <p className="text-sm text-gray-600">Year Built</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                  <p><span className="font-semibold">Property Type:</span> {propertyData.propertyType}</p>
                  <p><span className="font-semibold">Lot Size:</span> {propertyData.lotSize}</p>
                  <p><span className="font-semibold">Neighborhood:</span> {propertyData.neighborhood}</p>
                  <p><span className="font-semibold">ZIP Code:</span> {propertyData.zipCode}</p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Key Features</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {propertyData.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sales History */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Sales History</h3>
              </div>
              <div className="space-y-3">
                {propertyData.salesHistory.map((sale, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-semibold text-gray-800">{sale.event}</p>
                        <p className="text-sm text-gray-600">{sale.date}</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{sale.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Tax Information</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Annual Tax</p>
                  <p className="text-2xl font-bold text-gray-800">{propertyData.taxInfo.annualTax}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tax Year</p>
                  <p className="text-2xl font-bold text-gray-800">{propertyData.taxInfo.taxYear}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Assessed Value</p>
                  <p className="text-2xl font-bold text-gray-800">{propertyData.taxInfo.assessedValue}</p>
                </div>
              </div>
            </div>

            {/* Neighborhood Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Neighborhood Insights</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Median Home Price</p>
                  <p className="text-xl font-bold text-gray-800">{propertyData.neighborhoodInfo.medianPrice}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Annual Appreciation</p>
                  <p className="text-xl font-bold text-green-600">{propertyData.neighborhoodInfo.appreciation}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Walk Score</p>
                  <p className="text-xl font-bold text-gray-800">{propertyData.neighborhoodInfo.walkScore}/100</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Crime Rate</p>
                  <p className="text-xl font-bold text-gray-800">{propertyData.neighborhoodInfo.crimeRate}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">School Ratings</p>
                  <p className="text-xl font-bold text-gray-800">{propertyData.neighborhoodInfo.schools}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Setup Instructions */}
        {!propertyData && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Setup Instructions</h3>
            <div className="space-y-3 text-gray-600">
              <p className="flex items-start gap-2">
                <span className="font-bold text-blue-600">1.</span>
                Sign up for RapidAPI and subscribe to the Zillow API
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-blue-600">2.</span>
                Get your API key from the RapidAPI dashboard
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-blue-600">3.</span>
                Replace the demo data in the code with actual API calls
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-blue-600">4.</span>
                Use Chrome or Edge browser for best voice recognition support
              </p>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> This demo uses sample data. Integrate your RapidAPI Zillow key to access live MLS data.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">REBA - Real Estate Business Assistant</p>
          <p className="text-xs text-gray-400 mt-1">Streamline your property search with voice commands</p>
        </div>
      </div>
    </div>
  );
}
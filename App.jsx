import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Search, Home, DollarSign, MapPin, TrendingUp, Calendar } from 'lucide-react';

export default function RebaApp() {
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState('');
  const [usingDemoData, setUsingDemoData] = useState(false);

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

  const getDemoData = (query) => {
    return {
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
        walkScore: '78/100',
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
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setError('');
    setUsingDemoData(false);
    
    try {
      const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
      
      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        console.log('No API key found, using demo data');
        setUsingDemoData(true);
        setPropertyData(getDemoData(query));
        setLoading(false);
        return;
      }

      const url = `https://zillow-com1.p.rapidapi.com/propertyExtendedSearch?location=${encodeURIComponent(query)}`;
      const searchResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com,',
          'Accept': 'application/json'
        }
      });

      console.log('API Response Status:', searchResponse.status);

      if (!searchResponse.ok) {
        throw new Error(`API Error: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      console.log('API Response Data:', searchData);
      console.log('Full API structure:', JSON.stringify(searchData, null, 2));
if (properties && properties.length > 0) {
  console.log('First property fields:', Object.keys(properties[0]));
}
      
      // FIX: The API returns data directly as an array OR as {props: [...]}
      // Check both formats
      let properties = null;
      
      if (Array.isArray(searchData)) {
        // Data is directly an array
        properties = searchData;
      } else if (searchData.props && Array.isArray(searchData.props)) {
        // Data is in props property
        properties = searchData.props;
      } else if (searchData.results && Array.isArray(searchData.results)) {
        // Some APIs use 'results'
        properties = searchData.results;
      }
      
      if (!properties || properties.length === 0) {
        console.log('No properties in API response, using demo data');
        setUsingDemoData(true);
        setPropertyData(getDemoData(query));
        setLoading(false);
        return;
      }

      const property = properties[0];

      // Format the property data
      const formattedProperty = {
        address: property.address || query,
        price: property.price ? `$${property.price.toLocaleString()}` : 
               property.listPrice ? `$${property.listPrice.toLocaleString()}` : 
               'Price not available',
        bedrooms: property.bedrooms || property.beds || 'N/A',
        bathrooms: property.bathrooms || property.baths || 'N/A',
        sqft: property.livingArea ? property.livingArea.toLocaleString() : 
              property.livingAreaSqFt ? property.livingAreaSqFt.toLocaleString() : 
              property.sqft ? property.sqft.toLocaleString() : 'N/A',
        yearBuilt: property.yearBuilt || property.year_built || 'N/A',
        propertyType: property.propertyType || property.homeType || 'Single Family Home',
        lotSize: property.lotSize ? `${property.lotSize.toLocaleString()} sq ft` : 
                 property.lotAreaSqFt ? `${property.lotAreaSqFt.toLocaleString()} sq ft` : 'N/A',
        neighborhood: property.city || property.address?.split(',')[1]?.trim() || 'N/A',
        zipCode: property.zipcode || property.zip || property.postalCode || 'N/A',
        
        salesHistory: property.priceHistory?.map(sale => ({
          date: sale.date || 'Unknown',
          price: sale.price ? `$${sale.price.toLocaleString()}` : 'N/A',
          event: sale.event || 'Sale'
        })) || [{ date: 'History not available', price: 'N/A', event: 'N/A' }],
        
        taxInfo: {
          annualTax: property.taxAssessment ? `$${property.taxAssessment.toLocaleString()}` : 
                     property.taxAnnualAmount ? `$${property.taxAnnualAmount.toLocaleString()}` : 'N/A',
          taxYear: new Date().getFullYear(),
          assessedValue: property.price ? `$${property.price.toLocaleString()}` : 'N/A'
        },
        
        neighborhoodInfo: {
          medianPrice: property.medianHomePrice ? `$${property.medianHomePrice.toLocaleString()}` : 'Data not available',
          schools: property.schools ? 'Available' : 'N/A',
          walkScore: property.walkScore || 'N/A',
          crimeRate: 'N/A',
          appreciation: 'N/A'
        },
        
        features: property.description?.split(',').slice(0, 6).map(f => f.trim()) || 
                  property.features || [
          'Property features available upon request'
        ]
      };

      console.log('Formatted Property:', formattedProperty);
      setPropertyData(formattedProperty);
      setLoading(false);

    } catch (err) {
      console.error('API Error:', err);
      console.log('API failed, falling back to demo data');
      setUsingDemoData(true);
      setPropertyData(getDemoData(query));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Search Properties by Voice</h2>
            <p className="text-gray-600">Tap the microphone and say an address</p>
          </div>

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
              {isListening ? <MicOff className="w-16 h-16" /> : <Mic className="w-16 h-16" />}
            </button>
          </div>

          {transcript && <p className="text-center text-gray-600 mb-4 italic">{transcript}</p>}

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

          {usingDemoData && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-center">
              ℹ️ Using demo data. Add your RapidAPI key to environment variables for real property data.
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Searching MLS database...</p>
          </div>
        )}

        {propertyData && !loading && (
          <div className="space-y-6">
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
                  <p className="text-xl font-bold text-gray-800">{propertyData.neighborhoodInfo.walkScore}</p>
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
      </div>

      <div className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">REBA - Real Estate Business Assistant</p>
          <p className="text-xs text-gray-400 mt-1">Streamline your property search with voice commands</p>
        </div>
      </div>
    </div>
  );
}
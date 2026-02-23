import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Sparkles, Users, TrendingUp } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Pronađi Savršen Stil <span className="text-primary-600">Brade</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered aplikacija koja ti pomoći da pronađeš idealan stil brade na osnovu oblika lica, 
            životnog stila i ličnih preferencija.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/upload" className="btn btn-primary text-lg">
              <Camera className="inline mr-2" size={20} />
              Počni Sada
            </Link>
            <Link to="/gallery" className="btn btn-outline text-lg">
              Pogledaj Stilove
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Upload Sliku</h3>
            <p className="text-gray-600">
              Jednostavno upload-uj svoju sliku ili koristi kameru za snimanje
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Analiza</h3>
            <p className="text-gray-600">
              Naš AI detektuje oblik lica i preporučuje najbolje stilove
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Vizualizuj Rezultat</h3>
            <p className="text-gray-600">
              Vidi kako će brada izgledati na tvom licu prije nego je pustiš
            </p>
          </div>
        </div>
      </section>

      {/* B2B Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Users className="mx-auto mb-4 text-primary-400" size={48} />
            <h2 className="text-3xl font-bold mb-4">Za Frizerske Salone</h2>
            <p className="text-gray-300 mb-8">
              Napredna B2B rješenja za salone - collaborative sessions, customer management, 
              i real-time konsultacije sa klijentima.
            </p>
            <Link to="/salon" className="btn bg-primary-600 hover:bg-primary-700 text-white">
              Saznaj Više
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Kako Funkcioniše?</h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Upload Sliku ili Snimak</h3>
                <p className="text-gray-600">
                  Koristi svoju sliku ili direktno snimi preko kamere. Naš sistem automatski 
                  detektuje tvoje lice.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Odgovori na Pitanja</h3>
                <p className="text-gray-600">
                  Kratki upitnik o tvom životnom stilu, preferencijama i koliko vremena želiš 
                  posvećivati održavanju.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Pregledaj Preporuke</h3>
                <p className="text-gray-600">
                  Dobij personalizovane preporuke sa vizualizacijom kako će svaki stil izgledati 
                  na tvom licu.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Sačuvaj Favorite</h3>
                <p className="text-gray-600">
                  Sačuvaj svoje omiljene stilove i podijeli ih sa svojim frizerom.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

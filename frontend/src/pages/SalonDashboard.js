import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { salonAPI } from '../services/api';
import useAuthStore from '../context/useAuthStore';

const SalonDashboard = () => {
  const navigate = useNavigate();
  const { user, userType } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (userType !== 'salon') {
      navigate('/');
      return;
    }
    loadDashboardData();
  }, [userType, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, customersRes, sessionsRes] = await Promise.all([
        salonAPI.getStats(),
        salonAPI.getCustomers(),
        salonAPI.getActiveSessions(),
      ]);
      setStats(statsRes.data);
      setCustomers(customersRes.data);
      setActiveSessions(sessionsRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      await salonAPI.createCustomer(newCustomer);
      setShowNewCustomerModal(false);
      setNewCustomer({ name: '', email: '', phone: '' });
      loadDashboardData();
    } catch (err) {
      console.error('Error creating customer:', err);
      alert('Greška pri kreiranju klijenta');
    }
  };

  const handleStartSession = async (customerId) => {
    try {
      const response = await salonAPI.createSession(customerId, null);
      navigate(`/salon/session/${response.data.sessionId}`);
    } catch (err) {
      console.error('Error starting session:', err);
      alert('Greška pri pokretanju sesije');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Učitavanje...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Salon Dashboard</h1>
          <p className="text-gray-600">Dobrodošli nazad, {user?.name}</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-gray-600 text-sm mb-1">Ukupno klijenata</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalCustomers || 0}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-gray-600 text-sm mb-1">Aktivne sesije</div>
              <div className="text-3xl font-bold text-red-600">{stats.activeSessions || 0}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-gray-600 text-sm mb-1">Ukupno sesija</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalSessions || 0}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-gray-600 text-sm mb-1">Ovaj mjesec</div>
              <div className="text-3xl font-bold text-green-600">{stats.sessionsThisMonth || 0}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Sessions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Aktivne sesije</h2>
            {activeSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">💈</div>
                <p>Nema aktivnih sesija</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-red-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-gray-900">{session.customerName}</div>
                      <div className="text-sm text-gray-600">{session.sessionCode}</div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      Započeto: {new Date(session.createdAt).toLocaleString('sr-RS')}
                    </div>
                    <button
                      onClick={() => navigate(`/salon/session/${session.id}`)}
                      className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Nastavi sesiju
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customers */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Klijenti</h2>
              <button
                onClick={() => setShowNewCustomerModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
              >
                + Novi klijent
              </button>
            </div>

            {customers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">👥</div>
                <p>Nema registrovanih klijenata</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">{customer.name}</div>
                        <div className="text-sm text-gray-600">{customer.email}</div>
                        {customer.phone && (
                          <div className="text-sm text-gray-600">{customer.phone}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          Sesija: {customer.totalSessions || 0}
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartSession(customer.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition-all"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Brze akcije</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setShowNewCustomerModal(true)}
              className="p-4 bg-white/10 hover:bg-white/20 rounded-lg text-left transition-all"
            >
              <div className="text-3xl mb-2">👤</div>
              <div className="font-semibold">Dodaj novog klijenta</div>
              <div className="text-sm opacity-90">Kreiraj profil za novog klijenta</div>
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="p-4 bg-white/10 hover:bg-white/20 rounded-lg text-left transition-all"
            >
              <div className="text-3xl mb-2">📸</div>
              <div className="font-semibold">Upload slike klijenta</div>
              <div className="text-sm opacity-90">Isprobajte stilove na klijentu</div>
            </button>
            <button
              onClick={() => navigate('/gallery')}
              className="p-4 bg-white/10 hover:bg-white/20 rounded-lg text-left transition-all"
            >
              <div className="text-3xl mb-2">🎨</div>
              <div className="font-semibold">Pregledaj galeriju</div>
              <div className="text-sm opacity-90">Istražite sve stilove brade</div>
            </button>
          </div>
        </div>
      </div>

      {/* New Customer Modal */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Novi klijent</h2>
            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ime i prezime *
                </label>
                <input
                  type="text"
                  required
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ime klijenta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="+387 60 123 456"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewCustomerModal(false)}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Otkaži
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                >
                  Kreiraj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonDashboard;

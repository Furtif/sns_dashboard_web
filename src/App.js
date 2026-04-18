import React, { useState, useEffect } from 'react';
import DashboardExecutivo from './components/DashboardExecutivo';
import DashboardOperacional from './components/DashboardOperacional';
import DashboardFinanceiro from './components/DashboardFinanceiro';
import DashboardRH from './components/DashboardRH';
import PeriodFilter from './components/PeriodFilter';
import PeriodSummary from './components/PeriodSummary';
import { loadAllData, calculateMetrics, clearCache, filterByPeriod, filterMonitorizacaoByPeriod } from './utils/dataLoader';
import { formatNumber } from './utils/formatters';

function App() {
  const [activeTab, setActiveTab] = useState('executivo');
  const [data, setData] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      clearCache(); // Limpar cache para garantir dados frescos

      const rawDataLoaded = await loadAllData();
      setRawData(rawDataLoaded);

      const metrics = calculateMetrics(rawDataLoaded);
      setData(metrics);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Não foi possível carregar os dados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDateRangeChange = (start, end) => {
    setDateRange({ start, end });

    if (rawData && start && end) {
      // Filtrar dados por período usando funções especializadas
      const filteredData = {
        ...rawData,
        atendimentos: filterByPeriod(rawData.atendimentos, start, end),
        monitorizacao: filterMonitorizacaoByPeriod(rawData.monitorizacao, start, end),
        // Manter dimensões (instituições, regiões, indicadores) sem filtro
        instituicoes: rawData.instituicoes,
        regioes: rawData.regioes,
        indicadores: rawData.indicadores
      };

      const metrics = calculateMetrics(filteredData);
      setData(metrics);
    } else if (rawData) {
      // Se não houver filtro, usar todos os dados
      const metrics = calculateMetrics(rawData);
      setData(metrics);
    }
  };

  const tabs = [
    { id: 'executivo', name: '📊 Executivo', component: DashboardExecutivo },
    { id: 'operacional', name: '⚙️ Operacional', component: DashboardOperacional },
    { id: 'financeiro', name: '💰 Financeiro', component: DashboardFinanceiro },
    { id: 'rh', name: '👥 Recursos Humanos', component: DashboardRH }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            SNS Dashboard
          </h2>
          <p className="text-gray-500">
            A carregar dados do Serviço Nacional de Saúde...
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Análise de ineficiências hospitalares (2016-2026)
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Erro ao Carregar Dados
          </h2>
          <p className="text-gray-500 mb-6">
            {error}
          </p>
          <button
            onClick={loadData}
            className="update-button"
          >
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1 className="flex items-center gap-2">
                <a href="./" className="flex items-center gap-2 text-inherit hover:text-inherit focus:text-inherit active:text-inherit" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <span>🏥</span>
                  SNS Dashboard
                </a>
              </h1>
              <p className="header-subtitle">
                Análise de Ineficiências Hospitalares (2016-2026)
              </p>
            </div>
            <div className="hidden-mobile">
              <div className="text-sm">
                <div>📊 {formatNumber(data?.totalAtendimentos)} atendimentos</div>
                <div>⚠️ {data?.percentUrgenciasFalsas?.toFixed(1)}% urgências falsas</div>
              </div>
            </div>
            <div>
              <a
                href="./download/SNS%20PT_v1.apk"
                download
                className="mobile-download-btn"
                title="Descarregar App Android"
              >
                📱 Install APK
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="container">
        <nav className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="container py-6">
        {/* Filtro de Período */}
        {data && (
          <>
            <PeriodFilter
              onDateRangeChange={handleDateRangeChange}
              disabled={loading}
            />

            {/* Resumo do período - aparece apenas quando há filtro aplicado */}
            {dateRange.start && dateRange.end && (
              <PeriodSummary
                data={data}
                dateRange={dateRange}
              />
            )}
          </>
        )}

        {ActiveComponent && (
          <ActiveComponent
            data={data}
            dateRange={dateRange}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="footer-icon">🏥</span>
                <strong>SNS Dashboard</strong>
              </div>
              <div className="footer-data-info">
                <a
                  href="./"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Análise de Ineficiências Hospitalares
                </a>
              </div>
            </div>
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="footer-icon">💻</span>
                <strong>Desenvolvimento:</strong>
              </div>
              <div className="footer-data-info">
                <a
                  href="https://www.gp-informatique.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  George Pereira | GP Informatique
                </a>
              </div>
            </div>
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="footer-icon">📊</span>
                <strong>Fonte de Dados:</strong>
              </div>
              <div className="footer-data-info">
                <a
                  href="https://transparencia.sns.gov.pt/explore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Portal Transparência SNS
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

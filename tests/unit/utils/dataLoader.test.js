import {
  loadCSV,
  loadAllData,
  clearCache,
  calculateMetrics,
  filterByPeriod,
  filterMonitorizacaoByPeriod,
  filterByInstitution,
  filterByRegion,
  groupByPeriod,
  calculateRankings
} from '../../../src/utils/dataLoader';

// Mock PapaParse
jest.mock('papaparse', () => ({
  parse: jest.fn()
}));

import Papa from 'papaparse';

describe('dataLoader', () => {
  beforeEach(() => {
    clearCache();
    jest.clearAllMocks();
  });

  describe('clearCache', () => {
    it('clears the data cache', async () => {
      const mockData = [{ id: 1, name: 'Test' }];
      Papa.parse.mockImplementation((url, options) => {
        setTimeout(() => {
          options.complete({ data: mockData, errors: [] });
        }, 0);
      });

      await loadCSV('test.csv');
      clearCache();
      
      // After clearing cache, it should call Papa.parse again
      Papa.parse.mockClear();
      Papa.parse.mockImplementation((url, options) => {
        setTimeout(() => {
          options.complete({ data: mockData, errors: [] });
        }, 0);
      });
      
      await loadCSV('test.csv');
      expect(Papa.parse).toHaveBeenCalled();
    });
  });

  describe('calculateMetrics', () => {
    it('returns empty object when no data provided', () => {
      expect(calculateMetrics({})).toEqual({});
      expect(calculateMetrics({ atendimentos: [] })).toEqual({});
    });

    it('calculates basic metrics correctly', () => {
      const mockData = {
        atendimentos: [
          {
            TotalAtendimentos: 100,
            Atendimentos_Vermelha: 10,
            Atendimentos_Laranja: 20,
            Atendimentos_Amarela: 30,
            Atendimentos_Verde: 25,
            Atendimentos_Azul: 10,
            Atendimentos_Branca: 5,
            Médicos: 5,
            MedicosInternos: 2,
            Enfermeiros: 10
          },
          {
            TotalAtendimentos: 200,
            Atendimentos_Vermelha: 20,
            Atendimentos_Laranja: 40,
            Atendimentos_Amarela: 60,
            Atendimentos_Verde: 50,
            Atendimentos_Azul: 20,
            Atendimentos_Branca: 10,
            Médicos: 10,
            MedicosInternos: 3,
            Enfermeiros: 20
          }
        ],
        instituicoes: [{ InstituicaoID: 1, Nome: 'Hospital Test' }],
        regioes: [{ RegiaoID: 1, Nome: 'Norte' }]
      };

      const metrics = calculateMetrics(mockData);

      expect(metrics.totalAtendimentos).toBe(300);
      expect(metrics.atendimentosVermelha).toBe(30);
      expect(metrics.atendimentosLaranja).toBe(60);
      expect(metrics.atendimentosAmarela).toBe(90);
      expect(metrics.atendimentosVerde).toBe(75);
      expect(metrics.atendimentosAzul).toBe(30);
      expect(metrics.atendimentosBranca).toBe(15);
      expect(metrics.urgenciasFalsas).toBe(120); // 75 + 30 + 15
      expect(metrics.totalMedicos).toBe(15);
      expect(metrics.totalEnfermeiros).toBe(30);
    });

    it('calculates percentages correctly', () => {
      const mockData = {
        atendimentos: [
          {
            TotalAtendimentos: 100,
            Atendimentos_Vermelha: 10,
            Atendimentos_Laranja: 20,
            Atendimentos_Amarela: 30,
            Atendimentos_Verde: 20,
            Atendimentos_Azul: 10,
            Atendimentos_Branca: 10,
            Médicos: 5,
            MedicosInternos: 0,
            Enfermeiros: 10
          }
        ]
      };

      const metrics = calculateMetrics(mockData);

      expect(metrics.percentUrgenciasFalsas).toBe(40); // (20+10+10)/100 * 100
      expect(metrics.percentUrgenciasUrgentes).toBe(30); // (10+20)/100 * 100
    });

    it('calculates financial metrics correctly', () => {
      const mockData = {
        atendimentos: [
          {
            TotalAtendimentos: 100,
            Atendimentos_Verde: 20,
            Atendimentos_Azul: 10,
            Atendimentos_Branca: 10,
            Médicos: 5,
            Enfermeiros: 10
          }
        ]
      };

      const metrics = calculateMetrics(mockData);

      expect(metrics.custoEstimadoPorEpisodio).toBe(150);
      expect(metrics.despesaTotalEstimada).toBe(15000); // 100 * 150
      expect(metrics.custoDesperdicadoEstimado).toBe(4800); // 40 * 120
    });

    it('calculates staff ratios correctly', () => {
      const mockData = {
        atendimentos: [
          {
            TotalAtendimentos: 500,
            Médicos: 5,
            Enfermeiros: 10,
            Atendimentos_Verde: 0,
            Atendimentos_Azul: 0,
            Atendimentos_Branca: 0
          }
        ]
      };

      const metrics = calculateMetrics(mockData);

      expect(metrics.racioEnfermeiroMedico).toBe(2); // 10/5
      expect(metrics.atendimentosPorMedico).toBe(100); // 500/5
      expect(metrics.atendimentosPorEnfermeiro).toBe(50); // 500/10
      expect(metrics.atendimentosPorProfissional).toBeCloseTo(33.33, 1); // 500/15
    });

    it('handles zero values correctly', () => {
      const mockData = {
        atendimentos: [
          {
            TotalAtendimentos: 0,
            Médicos: 0,
            Enfermeiros: 0
          }
        ]
      };

      const metrics = calculateMetrics(mockData);

      expect(metrics.racioEnfermeiroMedico).toBe(0);
      expect(metrics.atendimentosPorMedico).toBe(0);
      expect(metrics.percentUrgenciasFalsas).toBe(0);
    });

    it('calculates inefficiency score correctly', () => {
      const mockData = {
        atendimentos: [
          {
            TotalAtendimentos: 100,
            Atendimentos_Verde: 50,
            Atendimentos_Azul: 20,
            Atendimentos_Branca: 10,
            Médicos: 2,
            Enfermeiros: 4
          }
        ]
      };

      const metrics = calculateMetrics(mockData);

      expect(metrics.scoreIneficienciaGlobal).toBeGreaterThan(0);
      expect(metrics.classificacaoIneficiencia).toBeDefined();
    });

    it('returns correct status classifications', () => {
      const mockDataHighFalsas = {
        atendimentos: [{
          TotalAtendimentos: 100,
          Atendimentos_Verde: 40,
          Atendimentos_Azul: 0,
          Atendimentos_Branca: 0,
          Médicos: 5,
          Enfermeiros: 7
        }]
      };

      const metricsHigh = calculateMetrics(mockDataHighFalsas);
      expect(metricsHigh.statusUrgenciasFalsas).toContain('❌');

      const mockDataGood = {
        atendimentos: [{
          TotalAtendimentos: 100,
          Atendimentos_Verde: 10,
          Atendimentos_Azul: 0,
          Atendimentos_Branca: 0,
          Médicos: 5,
          Enfermeiros: 12
        }]
      };

      const metricsGood = calculateMetrics(mockDataGood);
      expect(metricsGood.statusUrgenciasFalsas).toContain('✅');
    });

    it('includes raw data in results', () => {
      const mockData = {
        atendimentos: [{ TotalAtendimentos: 100 }],
        instituicoes: [{ InstituicaoID: 1 }],
        regioes: [{ RegiaoID: 1 }]
      };

      const metrics = calculateMetrics(mockData);

      expect(metrics.instituicoes).toEqual([{ InstituicaoID: 1 }]);
      expect(metrics.regioes).toEqual([{ RegiaoID: 1 }]);
      // dadosBrutos agora inclui campos COVID-19
      expect(metrics.dadosBrutos).toEqual([{
        TotalAtendimentos: 100,
        CasosCovid: 0,
        PercentCovid: 0,
        IsCovidPeriod: false,
        ObitosCovid: 0,
        InternamentosCovid: 0
      }]);
      // dadosCovidCompletos deve estar vazio quando não há período COVID
      expect(metrics.dadosCovidCompletos).toEqual([]);
    });
  });

  describe('filterByPeriod', () => {
    it('filters data by date period', () => {
      const data = [
        { Período: '2024-01', valor: 1 },
        { Período: '2024-02', valor: 2 },
        { Período: '2024-03', valor: 3 },
        { Período: '2024-06', valor: 6 }
      ];

      const startDate = new Date(2024, 0); // Jan 2024
      const endDate = new Date(2024, 2);   // Mar 2024

      const filtered = filterByPeriod(data, startDate, endDate);

      expect(filtered).toHaveLength(3);
      expect(filtered.map(d => d.valor)).toEqual([1, 2, 3]);
    });

    it('returns empty array for empty data', () => {
      expect(filterByPeriod([], new Date(), new Date())).toEqual([]);
      expect(filterByPeriod(null, new Date(), new Date())).toEqual([]);
    });

    it('excludes rows without period', () => {
      const data = [
        { Período: '2024-01', valor: 1 },
        { valor: 2 },
        { Período: null, valor: 3 }
      ];

      const result = filterByPeriod(data, new Date(2024, 0), new Date(2024, 1));
      expect(result).toHaveLength(1);
    });
  });

  describe('filterMonitorizacaoByPeriod', () => {
    it('filters by Data field', () => {
      const data = [
        { Data: '2024-01-15', valor: 1 },
        { Data: '2024-03-15', valor: 3 }
      ];

      const result = filterMonitorizacaoByPeriod(data, new Date(2024, 0, 1), new Date(2024, 1, 1));
      expect(result).toHaveLength(1);
      expect(result[0].valor).toBe(1);
    });

    it('filters by Período field', () => {
      const data = [
        { Período: '2024-01-15', valor: 1 },
        { Período: '2024-06-15', valor: 6 }
      ];

      const result = filterMonitorizacaoByPeriod(data, new Date(2024, 0, 1), new Date(2024, 2, 1));
      expect(result).toHaveLength(1);
    });

    it('includes rows without date fields', () => {
      const data = [{ valor: 1 }, { valor: 2 }];
      const result = filterMonitorizacaoByPeriod(data, new Date(), new Date());
      expect(result).toHaveLength(2);
    });

    it('returns empty array for null data', () => {
      expect(filterMonitorizacaoByPeriod(null, new Date(), new Date())).toEqual([]);
    });
  });

  describe('filterByInstitution', () => {
    it('filters by institution ID', () => {
      const data = [
        { InstituicaoID: 1, nome: 'Hospital A' },
        { InstituicaoID: 2, nome: 'Hospital B' },
        { InstituicaoID: 1, nome: 'Hospital A again' }
      ];

      const result = filterByInstitution(data, 1);
      expect(result).toHaveLength(2);
      expect(result.every(r => r.InstituicaoID === 1)).toBe(true);
    });

    it('returns all data when no institution ID provided', () => {
      const data = [{ id: 1 }, { id: 2 }];
      expect(filterByInstitution(data, null)).toEqual(data);
      expect(filterByInstitution(data, undefined)).toEqual(data);
      expect(filterByInstitution(data, '')).toEqual(data);
    });

    it('returns empty array for empty data', () => {
      expect(filterByInstitution([], 1)).toEqual([]);
      expect(filterByInstitution(null, 1)).toEqual(null);
    });
  });

  describe('filterByRegion', () => {
    it('filters by region ID', () => {
      const data = [
        { RegiaoID: 1, nome: 'Norte' },
        { RegiaoID: 2, nome: 'Sul' },
        { RegiaoID: 1, nome: 'Norte again' }
      ];

      const result = filterByRegion(data, 1);
      expect(result).toHaveLength(2);
    });

    it('returns all data when no region ID provided', () => {
      const data = [{ id: 1 }, { id: 2 }];
      expect(filterByRegion(data, null)).toEqual(data);
    });
  });

  describe('groupByPeriod', () => {
    it('groups data by period', () => {
      const data = [
        { Período: '2024-01', TotalAtendimentos: 100, Atendimentos_Verde: 20, Atendimentos_Azul: 10, Atendimentos_Branca: 5, Médicos: 5, Enfermeiros: 10 },
        { Período: '2024-01', TotalAtendimentos: 200, Atendimentos_Verde: 30, Atendimentos_Azul: 15, Atendimentos_Branca: 10, Médicos: 3, Enfermeiros: 6 },
        { Período: '2024-02', TotalAtendimentos: 150, Atendimentos_Verde: 25, Atendimentos_Azul: 5, Atendimentos_Branca: 0, Médicos: 4, Enfermeiros: 8 }
      ];

      const result = groupByPeriod(data);

      expect(result).toHaveLength(2);
      expect(result[0].period).toBe('2024-01');
      expect(result[0].totalAtendimentos).toBe(300);
      expect(result[0].urgenciasFalsas).toBe(90); // (20+10+5) + (30+15+10)
      expect(result[0].count).toBe(2);
    });

    it('returns empty array for empty data', () => {
      expect(groupByPeriod([])).toEqual([]);
      expect(groupByPeriod(null)).toEqual([]);
    });

    it('sorts results by period', () => {
      const data = [
        { Período: '2024-03', TotalAtendimentos: 100 },
        { Período: '2024-01', TotalAtendimentos: 200 }
      ];

      const result = groupByPeriod(data);
      expect(result[0].period).toBe('2024-01');
      expect(result[1].period).toBe('2024-03');
    });
  });

  describe('calculateRankings', () => {
    it('returns object with empty arrays when no data provided', () => {
      const emptyResult = calculateRankings({});
      expect(emptyResult.rankingUrgenciasFalsas || []).toEqual([]);
      expect(emptyResult.rankingProdutividade || []).toEqual([]);
    });

    it('calculates institution rankings correctly', () => {
      const data = {
        instituicoes: [
          { InstituicaoID: 1, Nome: 'Hospital A' },
          { InstituicaoID: 2, Nome: 'Hospital B' }
        ],
        atendimentos: [
          { InstituicaoID: 1, TotalAtendimentos: 1000, Atendimentos_Verde: 200, Atendimentos_Azul: 50, Atendimentos_Branca: 50, Médicos: 10, Enfermeiros: 25 },
          { InstituicaoID: 1, TotalAtendimentos: 500, Atendimentos_Verde: 100, Atendimentos_Azul: 25, Atendimentos_Branca: 25, Médicos: 5, Enfermeiros: 12 },
          { InstituicaoID: 2, TotalAtendimentos: 800, Atendimentos_Verde: 100, Atendimentos_Azul: 30, Atendimentos_Branca: 20, Médicos: 8, Enfermeiros: 16 }
        ]
      };

      const rankings = calculateRankings(data);

      expect(rankings.rankingUrgenciasFalsas).toBeDefined();
      expect(rankings.rankingProdutividade).toBeDefined();
      expect(rankings.rankingRacio).toBeDefined();
      expect(rankings.topUrgenciasFalsas).toHaveLength(2);
      expect(rankings.topProdutividade).toHaveLength(2);

      // Hospital A should have higher fake urgencies (375/1500 = 25%)
      // Hospital B should have lower fake urgencies (150/800 = 18.75%)
      expect(rankings.rankingUrgenciasFalsas[0].InstituicaoID).toBe(1);
    });

    it('calculates productivity correctly', () => {
      const data = {
        instituicoes: [
          { InstituicaoID: 1, Nome: 'Hospital A' },
          { InstituicaoID: 2, Nome: 'Hospital B' }
        ],
        atendimentos: [
          { InstituicaoID: 1, TotalAtendimentos: 2000, Médicos: 10, Enfermeiros: 20, Atendimentos_Verde: 0, Atendimentos_Azul: 0, Atendimentos_Branca: 0 },
          { InstituicaoID: 2, TotalAtendimentos: 1000, Médicos: 10, Enfermeiros: 20, Atendimentos_Verde: 0, Atendimentos_Azul: 0, Atendimentos_Branca: 0 }
        ]
      };

      const rankings = calculateRankings(data);

      // Hospital A: 200 attendances per doctor
      // Hospital B: 100 attendances per doctor
      expect(rankings.rankingProdutividade[0].InstituicaoID).toBe(1);
      expect(rankings.rankingProdutividade[0].atendimentosPorMedico).toBe(200);
    });

    it('handles institutions without matching atendimentos', () => {
      const data = {
        instituicoes: [
          { InstituicaoID: 1, Nome: 'Hospital A' },
          { InstituicaoID: 2, Nome: 'Hospital B' }
        ],
        atendimentos: [
          { InstituicaoID: 1, TotalAtendimentos: 100, Médicos: 2, Enfermeiros: 4, Atendimentos_Verde: 0, Atendimentos_Azul: 0, Atendimentos_Branca: 0 }
        ]
      };

      const rankings = calculateRankings(data);

      expect(rankings.rankingUrgenciasFalsas).toHaveLength(2);
      const hospitalB = rankings.rankingUrgenciasFalsas.find(r => r.InstituicaoID === 2);
      expect(hospitalB.totalAtendimentos).toBe(0);
      expect(hospitalB.percentUrgenciasFalsas).toBe(0);
    });
  });
});

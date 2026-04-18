# SNS Dashboard - Portugal

[![Test Build](https://github.com/Furtif/sns_dashboard_web/actions/workflows/test.yml/badge.svg)](https://github.com/Furtif/sns_dashboard_web/actions/workflows/test.yml)
[![Coverage](https://img.shields.io/badge/coverage-89%25-brightgreen.svg)](tests/coverage/lcov-report/index.html)
[![Tests](https://img.shields.io/badge/tests-47%20passed-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-ECL--2.0-blue.svg)](LICENSE.md)
[![React](https://img.shields.io/badge/react-19.2.4-blue.svg)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/node-20%2B-green.svg)]()

Dashboard interativo para análise de ineficiências hospitalares do Serviço Nacional de Saúde de Portugal, convertido do Power BI para ReactJS.

## 📊 Visão Geral

Este projeto converteu o dashboard Power BI original para uma aplicação web moderna em ReactJS, mantendo toda a inteligência analítica. A aplicação oferece análise completa de dados hospitalares com interface responsiva.

### 🎯 Funcionalidades Principais

- **4 Dashboards Especializados**: Executivo, Operacional, Financeiro e Recursos Humanos
- **Filtro de Período Temporal**: Seleção rápida ou personalizada por datas com resumo dinâmico
- **Design 100% Responsivo**: Otimizado para desktop, tablet e mobile com breakpoints adaptativos
- **Análise em Tempo Real**: KPIs e métricas atualizadas dinamicamente com cache inteligente
- **Gráficos Interativos**: Visualizações modernas com Recharts e tooltips informativos
- **Filtros Dinâmicos**: Por região, instituição e período com navegação por tabs
- **Alertas Automáticos**: Identificação de situações críticas com sistema de cores
- **Resumo do Período**: Estatísticas detalhadas do filtro temporal aplicado

## 🏗️ Estrutura do Projeto

```
sns_dashboard_web/
├── public/
│   ├── index.html
│   └── data/           # 8 arquivos CSV de dados hospitalares
│       ├── fact_atendimentos_urgencia_mensal.csv
│       ├── fact_monitorizacao_sazonal.csv
│       ├── atendimentos_urgencia_triagem_manchester.csv
│       ├── monitorizacao_sazonal_csh.csv
│       ├── trabalhadores_grupo_profissional.csv
│       └── dim/
│           ├── dim_instituicao.csv
│           ├── dim_regiao.csv
│           └── dim_indicador.csv
├── src/
│   ├── components/      # 6 componentes React
│   │   ├── DashboardExecutivo.js      # Visão macro para decisores
│   │   ├── DashboardOperacional.js    # Análise detalhada operacional
│   │   ├── DashboardFinanceiro.js     # Custos e desperdício
│   │   ├── DashboardRH.js             # Recursos humanos
│   │   ├── PeriodFilter.js            # Filtro de período temporal
│   │   └── PeriodSummary.js           # Resumo do período filtrado
│   ├── utils/          # Utilitários de processamento de dados
│   │   ├── dataLoader.js            # Carregamento e cache de CSVs
│   │   └── formatters.js            # Formatação de números e moeda
│   ├── App.js          # Componente principal com navegação
│   ├── index.js        # Ponto de entrada React
│   └── styles.css      # Estilos responsivos (1070 linhas)
├── tests/               # Testes unitários e de integração
│   ├── setup/           # Configuração de testes
│   │   └── setupTests.js
│   ├── unit/            # Testes unitários
│   │   ├── components/  # Testes de componentes
│   │   │   ├── PeriodFilter.simple.test.js
│   │   │   └── PeriodSummary.test.js
│   │   └── utils/       # Testes de utilitários
│   │       ├── dataLoader.test.js
│   │       └── formatters.test.js
│   └── coverage/        # Relatórios de cobertura
│       └── lcov-report/
├── scripts_history/    # Scripts Python para atualização local de dados
│   ├── atualizar_dados_sns.py
│   └── atualizar_tabelas_fact.py
├── babel.config.js   # Configuração Babel para testes
├── jest.config.js    # Configuração Jest
├── dist/             # Build de produção gerado automaticamente
├── webpack.config.js # Configuração do webpack
└── package.json      # Dependências e scripts
```

## 🚀 Como Usar

### Pré-requisitos
- Node.js 16+ instalado
- NPM ou Yarn

### Instalação e Execução

1. **Navegar para o diretório do projeto:**
   ```bash
   cd sns_dashboard_web
   ```

2. **Instalar dependências:**
   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm start
   ```
   - Servidor disponível em: `http://localhost:3000`
   - Hot reload automático
   - Interface completa com todos os dashboards

4. **Build para Produção:**
   ```bash
   npm run build
   ```
   - Gera pasta `dist/` otimizada
   - Arquivos minificados e bundle único

5. **Executar Testes:**
   ```bash
   npm test              # Executa todos os testes
   npm run test:watch    # Modo watch para desenvolvimento
   npm run test:coverage # Com relatório de cobertura
   ```

6. **Atualizar Dados (opcional, requer Python):**
   ```bash
   npm run update-csv
   ```
   - Executa scripts Python de atualização local

### 🔄 Scripts de Atualização de Dados (Local)

Scripts Python disponíveis em `scripts_history/` para atualização local dos CSVs:
- `atualizar_dados_sns.py`: Atualiza dados do portal da transparência
- `atualizar_tabelas_fact.py`: Processa e gera tabelas fato

## 📊 Dashboards Disponíveis

### 📈 Dashboard Executivo
- **Objetivo**: Visão macro para administração e decisores políticos
- **KPIs**: Total atendimentos, score ineficiência, urgências falsas, custo desperdiçado
- **Gráficos**: Evolução temporal, distribuição por triagem Manchester
- **Alertas**: Situações críticas e recomendações

### ⚙️ Dashboard Operacional
- **Objetivo**: Monitorização detalhada por instituição
- **Filtros**: Por região e instituição
- **Análises**: Rankings, eficiência vs volume, produtividade
- **Tabelas**: Top instituições, pior eficiência

### 💰 Dashboard Financeiro
- **Objetivo**: Análise do impacto financeiro e desperdício
- **Métricas**: Custos estimados, desperdício por região/tipo
- **Projeções**: Cenários de melhoria e impacto financeiro
- **Recomendações**: Otimização de recursos

### 👥 Dashboard RH
- **Objetivo**: Análise de equipas e produtividade
- **Indicadores**: Rácio enfermeiro/médico, produtividade por profissional
- **Alertas**: Défice de enfermeiros vs meta OMS
- **Rankings**: Produtividade e eficiência

## 📱 Design Responsivo

O dashboard foi projetado com uma abordagem mobile-first:

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### Adaptações
- **Navegação**: Tabs responsivas que se adaptam ao ecrã
- **Grid System**: Layout flexível de 1-4 colunas
- **Tabelas**: Otimizadas para mobile com informações condensadas
- **Gráficos**: Redimensionamento automático
- **Cards**: KPIs empilhados em mobile

##  Fonte de Dados

- **Origem**: Portal da Transparência do SNS (transparencia.sns.gov.pt)
- **Período**: 2016-2026 (10 anos de dados históricos)
- **Volume**: 8 arquivos CSV com dados hospitalares
- **Atualização**: Diária para monitorização, mensal para atendimentos
- **Estrutura**: Star Schema preservado do Power BI original

## 🎨 Tecnologias Utilizadas

### Frontend Core
- **React 19.2.4**: Biblioteca principal de componentes com hooks modernos
- **React DOM 19.2.4**: Renderização eficiente no browser
- **Recharts 3.7.0**: Biblioteca completa para gráficos interativos SVG
- **CSS3 Puro**: 1070 linhas de estilos responsivos sem frameworks externos

### Build & Development
- **Webpack 5.105.0**: Bundler moderno com otimizações
- **Webpack Dev Server 5.2.3**: Servidor de desenvolvimento com HMR
- **Babel**: Transpilação JavaScript moderno (ES6+) para compatibilidade

### Processamento de Dados
- **Papa Parse 5.5.3**: Parser robusto para arquivos CSV
- **JavaScript Nativo**: Cálculos complexos baseados nas medidas DAX originais
- **Cache**: Sistema Map-based para performance otimizada

### Development Tools
- **CSS Loader 7.1.3**: Processamento de CSS no webpack
- **Style Loader 4.0.0**: Injeção de estilos dinâmicos
- **Copy Webpack Plugin 13.0.1**: Cópia automática de assets estáticos
- **HTML Webpack Plugin 5.6.6**: Geração automática de HTML

## 📈 Métricas e Indicadores

O dashboard implementa métricas baseadas nas medidas DAX originais:

### Principais Indicadores
- **Score de Ineficiência Global**: 0-100 (quanto maior, pior)
- **% Urgências Falsas**: Verde + Azul + Branca (triagem Manchester)
- **Rácio Enfermeiro/Médico**: Meta OMS = 2.0
- **Custo Desperdiçado**: Estimado baseado em falsas urgências
- **Produtividade**: Atendimentos por profissional
- **Eficiência Operacional**: Métricas por instituição e região

### Sistema de Cores Automático
- **🔴 Crítico**: Exige intervenção imediata (score ≥ 35%)
- **🟠 Alerta**: Requer monitorização apertada (25-35%)
- **🟡 Atenção**: Em vigilância (15-25%)
- **🟢 Adequado**: Dentro dos parâmetros (< 15%)

### Análises Avançadas
- **Tendências Temporais**: Evolução mensal e sazonal
- **Comparativos Regionais**: Rankings entre instituições
- **Projeções Financeiras**: Cenários de otimização
- **Análise de Produtividade**: Por grupo profissional

## 🔧 Configuração e Arquitetura

### Estrutura Técnica
- **Component-based**: 6 componentes React especializados
- **State Management**: React hooks para estado local e compartilhado
- **Data Flow**: Unidirectional com props e callbacks
- **Cache System**: Map-based para evitar recargas desnecessárias

### Personalização
- **Cores e Temas**: CSS com variáveis customizáveis
- **Métricas**: Configuradas em `utils/dataLoader.js` (339 linhas)
- **Layout**: CSS Grid system com breakpoints responsivos
- **Gráficos**: Configurações Recharts em cada componente

### Performance
- **Cache Inteligente**: Dados carregados uma vez e mantidos em cache
- **Bundle Otimizado**: Webpack com tree-shaking e minificação
- **Responsive Design**: Media queries eficientes para todos os dispositivos

## 📝 Notas de Desenvolvimento

### Conversão Power BI → React
- **Medidas DAX**: Convertidas para JavaScript mantendo lógica idêntica
- **Star Schema**: Preservada estrutura de dados original com tabelas fato e dimensão
- **Visualizações**: Recriadas com Recharts mantendo interatividade e tooltips
- **Filtros**: Implementados com estado React e navegação por tabs
- **Responsividade**: Adaptada de desktop-first para mobile-first

### Arquitetura de Componentes
- **App.js**: Componente principal (245 linhas) com gerenciamento de estado global
- **Dashboards**: 4 componentes especializados com métricas específicas
- **PeriodFilter/Summary**: Componentes reutilizáveis para filtragem temporal
- **Utils**: dataLoader.js (339 linhas) e formatters.js (37 linhas)

## 🧪 Testes

O projeto inclui uma suite completa de testes unitários com Jest e Testing Library.

### Cobertura Atual

| Módulo | Statements | Branch | Functions | Lines |
|--------|-----------|--------|-----------|-------|
| **formatters.js** | 100% | 100% | 100% | 100% |
| **dataLoader.js** | 88% | 86% | 90% | 91% |
| **PeriodSummary.js** | 87.5% | 71% | 100% | 87.5% |
| **PeriodFilter.js** | 25% | 29% | 43% | 23% |

### Executar Testes

```bash
# Executar todos os testes
npm test

# Modo watch (re-executa em alterações)
npm run test:watch

# Com relatório de cobertura detalhado
npm run test:coverage
```

### Estrutura de Testes

```
tests/
├── setup/
│   └── setupTests.js          # Configuração global do Testing Library
├── unit/
│   ├── components/            # Testes de componentes React
│   │   ├── PeriodFilter.simple.test.js
│   │   └── PeriodSummary.test.js
│   └── utils/                 # Testes de utilitários
│       ├── dataLoader.test.js
│       └── formatters.test.js
└── coverage/                  # Relatórios LCOV gerados automaticamente
```

### Tecnologias de Teste

- **Jest 29.7.0**: Framework de testes com ambiente jsdom
- **Testing Library**: Testes focados em comportamento do utilizador
  - `@testing-library/react` 16.3.0
  - `@testing-library/jest-dom` 6.6.3
  - `@testing-library/user-event` 14.6.1
- **Babel**: Transpilação para testes ES6+

### CI/CD

Os testes são executados automaticamente em:
- **Push** para branches `main`, `master`, `dev`
- **Pull Requests** para branches principais
- **Matrix**: Node.js 20.x e 22.x em Ubuntu e Windows

Relatórios de cobertura são arquivados por 30 dias no GitHub Actions.

---

## 🚀 Deploy e Produção

### Build de Produção
```bash
npm run build
```
- Gera pasta `dist/` otimizada com bundle único
- Arquivos minificados e com hash para cache
- Todos os assets (CSV, HTML) copiados automaticamente

### Deploy
1. **Upload**: Copiar pasta `dist/` para servidor web
2. **Configuração**: Servidor estático (Apache, Nginx, Vercel, Netlify)
3. **Dados**: Verificar se CSVs estão em `/data/` no servidor
4. **HTTPS**: Configurar certificado SSL para produção

### Hospedagem Recomendada
- **Vercel/Netlify**: Ideal para frontend estático
- **GitHub Pages**: Gratuito para projetos open source
- **AWS S3 + CloudFront**: Escalável e global
- **Servidor Próprio**: Nginx ou Apache com configuração adequada

## 📄 Licença

Educational Community License v2.0 (ECL-2.0) - Ver arquivo LICENSE neste projeto.

## 🤝 Contribuição e Créditos

### Contribuição
Este projeto é uma conversão do dashboard Power BI original mantendo:
- **Integridade dos dados**: Mesmas fontes oficiais e períodos históricos
- **Lógica analítica**: Idêntica às medidas DAX originais  
- **Objetivos**: Mesmas métricas e KPIs para tomada de decisão
- **Usabilidade**: Melhorada com interface web moderna e responsiva

### Como Contribuir
1. **Fork** o projeto
2. **Branch** para sua feature: `git checkout -b feature/nova-funcionalidade`
3. **Commit** suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. **Push** para o branch: `git push origin feature/nova-funcionalidade`
5. **Pull Request** para revisão

### Diretrizes
- **Código**: Seguir padrões ES6+ e React hooks
- **Estilos**: Manter consistência com CSS existente
- **Componentes**: Reutilizáveis e bem documentados
- **Performance**: Considerar impacto no bundle e cache

---

## 📊 Estatísticas do Projeto

- **Versão**: 1.0.0  
- **Tecnologia**: React 19.2.4 + Webpack 5.105.0
- **Linhas de Código**: ~3000+ linhas (JS + CSS)
- **Componentes**: 6 componentes React
- **Arquivos de Dados**: 8 CSVs
- **Métricas**: 50+ indicadores de performance hospitalar
- **Licença**: ECL-2.0 (Educational Community License)

## 👨‍💻 Créditos

- **Inicial Desenvolvido por [JoaojPereira](https://github.com/JoaojPereira) em "PowerBi" em repositório:** [sns_dashboard](https://github.com/JoaojPereira/sns_dashboard) 
- **Maintainer:** [--=FurtiF™=--](https://github.com/Furtif)
- **Dados Oficiais:** [Portal Transparência SNS](https://transparencia.sns.gov.pt)
- **Tecnologia:** ReactJS + Webpack + Recharts
- **Licença:** Educational Community License v2.0

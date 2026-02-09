# SNS Dashboard - Portugal [![Test Build](https://github.com/Furtif/sns_dashboard_web/actions/workflows/test.yml/badge.svg)](https://github.com/Furtif/sns_dashboard_web/actions)

Dashboard interativo para análise de ineficiências hospitalares do Serviço Nacional de Saúde de Portugal, convertido do Power BI para ReactJS.

## 📊 Visão Geral

Este projeto converteu o dashboard Power BI original para uma aplicação web moderna em ReactJS, mantendo toda a inteligência analítica e adicionando novas funcionalidades. A aplicação oferece análise completa de dados hospitalares com interface responsiva e sistema de atualização de dados integrado.

### 🎯 Funcionalidades Principais

- **5 Dashboards Especializados**: Executivo, Operacional, Financeiro, Recursos Humanos e Gestor de Atualização
- **Filtro de Período Temporal**: Seleção rápida ou personalizada por datas com resumo dinâmico
- **Sistema de Atualização de Dados**: Interface web completa para atualizar CSVs com simulação Python
- **Design 100% Responsivo**: Otimizado para desktop, tablet e mobile com breakpoints adaptativos
- **Análise em Tempo Real**: KPIs e métricas atualizadas dinamicamente com cache inteligente
- **Gráficos Interativos**: Visualizações modernas com Recharts e tooltips informativos
- **Filtros Dinâmicos**: Por região, instituição e período com navegação por tabs
- **Alertas Automáticos**: Identificação de situações críticas com sistema de cores
- **Resumo do Período**: Estatísticas detalhadas do filtro temporal aplicado
- **Sistema de Backup**: Histórico completo das atualizações de dados

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
│   ├── components/      # 8 componentes React especializados
│   │   ├── DashboardExecutivo.js      # Visão macro para decisores
│   │   ├── DashboardOperacional.js    # Análise detalhada operacional
│   │   ├── DashboardFinanceiro.js     # Custos e desperdício
│   │   ├── DashboardRH.js            # Recursos humanos
│   │   ├── DataUpdateManager.js      # Sistema completo de atualização
│   │   ├── PeriodFilter.js           # Filtro de período temporal
│   │   └── PeriodSummary.js          # Resumo do período filtrado
│   ├── utils/          # Utilitários de processamento de dados
│   │   ├── dataLoader.js            # Carregamento e cache de CSVs
│   │   └── dataManager.js           # Sistema de gestão de dados
│   ├── App.js          # Componente principal com navegação
│   ├── index.js        # Ponto de entrada React
│   └── styles.css      # Estilos responsivos (1063 linhas)
├── dist/               # Build de produção gerado automaticamente
├── webpack.config.js   # Configuração completa do webpack
└── package.json        # Dependências e scripts de automação
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

5. **Atualizar Dados (opcional):**
   ```bash
   npm run update-csv
   ```
   - Executa scripts Python de atualização
   - Requer ambiente Python configurado

### 🔄 Sistema de Atualização de Dados

O dashboard inclui um gestor completo de atualização de dados totalmente em JavaScript:

#### Funcionalidades
- **Atualização Local**: Simulação completa de scripts Python
- **Backup Automático**: Criado antes de cada atualização
- **Histórico Completo**: Mantém últimas 10 atualizações
- **Gestão de Backups**: Restaurar versões anteriores
- **Feedback em Tempo Real**: Status detalhado das operações
- **Dados Mock**: Geração automática de dados realistas

#### Scripts Disponíveis
1. **Atualizar Dados de Atendimentos**: Dados de urgência com triagem Manchester
2. **Atualizar Dados de Monitorização**: Dados diários de monitorização sazonal
3. **Atualizar Cadastro de Instituições**: Dados das instituições e regiões
4. **Atualizar Todos os Dados**: Execução sequencial de todos os scripts

#### Componentes
- `dataManager.js`: Sistema completo de gestão de dados
- `DataUpdateManager.js`: Interface de atualização
- Funções de backup e restauração
- Geração de dados mock realistas

#### Características Técnicas
- **Cache Inteligente**: Dados carregados uma vez
- **Validação Robusta**: Verificação antes de aplicar
- **Simulação Realista**: Dados com sazonalidade e tendências
- **Interface Amigável**: Status visual e feedback claro

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

### 🔄 Gestor de Atualização
- **Objetivo**: Sistema web para atualizar dados via scripts Python
- **Scripts**: Atendimentos, monitorização, instituições, atualização completa
- **Logs**: Histórico de atualizações com status e estatísticas
- **Simulação**: Mock API para demonstração

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

## 🔄 Sistema de Atualização de Dados

### Funcionalidades
- **Interface Web**: Executar scripts Python diretamente do dashboard
- **Múltiplos Scripts**: Atualização seletiva ou completa
- **Status em Tempo Real**: Feedback visual do progresso
- **Histórico**: Logs detalhados das atualizações
- **Recarregamento Automático**: Dados atualizados após update

### Scripts Disponíveis
1. **update_atendimentos.py**: Dados de atendimentos de urgência
2. **update_monitorizacao.py**: Dados diários de monitorização
3. **update_instituicoes.py**: Cadastro de instituições
4. **update_all.py**: Execução completa de todos os scripts

## 📊 Fonte de Dados

- **Origem**: Portal da Transparência do SNS (transparencia.sns.gov.pt)
- **Período**: 2016-2026 (9.75 anos de dados históricos)
- **Volume**: 8 arquivos CSV com 36.000+ registros totais
  - 4.131 registros mensais de atendimentos
  - 32.870 registros diários de monitorização
  - Dados dimensionais de instituições, regiões e indicadores
- **Atualização**: Diária para monitorização, mensal para atendimentos
- **Estrutura**: Star Schema preservado do Power BI original

## 🎨 Tecnologias Utilizadas

### Frontend Core
- **React 19.2.3**: Biblioteca principal de componentes com hooks modernos
- **React DOM 19.2.3**: Renderização eficiente no browser
- **Recharts 3.6.0**: Biblioteca completa para gráficos interativos SVG
- **CSS3 Puro**: 1063 linhas de estilos responsivos sem frameworks externos

### Build & Development
- **Webpack 5.104.1**: Bundler moderno com otimizações avançadas
- **Webpack Dev Server 5.2.2**: Servidor de desenvolvimento com HMR
- **Babel**: Transpilação JavaScript moderno (ES6+) para compatibilidade
- **Babel Presets**: Env e React para sintaxe moderna

### Processamento de Dados
- **Papa Parse 5.5.3**: Parser robusto para arquivos CSV com delimitador personalizado
- **JavaScript Nativo**: Cálculos complexos baseados nas medidas DAX originais
- **Cache Inteligente**: Sistema Map-based para performance otimizada

### Development Tools
- **CSS Loader 7.1.2**: Processamento de CSS no webpack
- **Style Loader 4.0.0**: Injeção de estilos dinâmicos
- **Copy Webpack Plugin 13.0.1**: Cópia automática de assets estáticos
- **HTML Webpack Plugin 5.6.5**: Geração automática de HTML

## 📈 Métricas e Indicadores

O dashboard implementa mais de 50 métricas baseadas nas medidas DAX originais:

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
- **Component-based**: 8 componentes React especializados e reutilizáveis
- **State Management**: React hooks para estado local e compartilhado
- **Data Flow**: Unidirectional com props e callbacks
- **Cache System**: Map-based para performance otimizada

### Personalização
- **Cores e Temas**: 1063 linhas de CSS com variáveis customizáveis
- **Métricas**: Configuradas em `utils/dataLoader.js` (339 linhas)
- **Layout**: CSS Grid system com breakpoints responsivos
- **Gráficos**: Configurações Recharts em cada componente

### Performance
- **Lazy Loading**: Componentes carregados sob demanda
- **Cache Inteligente**: Dados carregados uma vez e mantidos em cache
- **Bundle Otimizado**: Webpack com tree-shaking e minificação
- **Responsive Design**: Media queries eficientes para todos os dispositivos

## 📝 Notas de Desenvolvimento

### Conversão Power BI → React
- **Medidas DAX**: 50+ medidas convertidas para JavaScript mantendo lógica idêntica
- **Star Schema**: Preservada estrutura de dados original com tabelas fato e dimensão
- **Visualizações**: Recriadas com Recharts mantendo interatividade e tooltips
- **Filtros**: Implementados com estado React e navegação por tabs
- **Responsividade**: Adaptada de desktop-first para mobile-first

### Arquitetura de Componentes
- **App.js**: Componente principal (241 linhas) com gerenciamento de estado global
- **Dashboards**: 4 componentes especializados com métricas específicas
- **DataUpdateManager**: Sistema completo de atualização com simulação Python
- **PeriodFilter/Summary**: Componentes reutilizáveis para filtragem temporal
- **Utils**: dataLoader.js (339 linhas) e dataManager.js para processamento

### Performance e Otimizações
- **Cache Strategy**: Map-based para evitar recargas desnecessárias
- **Bundle Size**: Otimizado com webpack configurações avançadas
- **Memory Management**: Cleanup adequado de event listeners e timeouts
- **Responsive Breakpoints**: Mobile (<640px), Tablet (640-1024px), Desktop (>1024px)

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

### Considerações Técnicas
- **Dados Estáticos**: CSVs servidos como assets estáticos
- **API Backend**: Sistema de atualização requer backend Python real
- **Cache**: Configurar headers adequados para assets estáticos
- **Performance**: Considerar CDN para distribuição global

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
- **Desenvolvimento**: Janeiro 2026
- **Tecnologia**: React 19.2.3 + Webpack 5.104.1
- **Linhas de Código**: 3.000+ linhas (JS + CSS)
- **Componentes**: 8 componentes React especializados
- **Arquivos de Dados**: 8 CSVs com 36.000+ registros
- **Métricas**: 50+ indicadores de performance hospitalar
- **Licença**: ECL-2.0 (Educational Community License)

## 👨‍💻 Créditos

- **Desenvolvido por:** [João Domingues Pereira](https://github.com/JoaojPereira) 
- **Maintainer:** [--=FurtiF™=--](https://github.com/Furtif)
- **Dados Oficiais:** [Portal Transparência SNS](https://transparencia.sns.gov.pt)
- **Tecnologia:** ReactJS + Webpack + Recharts
- **Licença:** Educational Community License v2.0

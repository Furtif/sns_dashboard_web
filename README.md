# SNS Dashboard - ReactJS

Dashboard interativo para análise de ineficiências hospitalares do Serviço Nacional de Saúde de Portugal, convertido do Power BI para ReactJS.

## 📊 Visão Geral

Este projeto converteu o dashboard Power BI original para uma aplicação web moderna em ReactJS, mantendo toda a inteligência analítica e adicionando novas funcionalidades.

### 🎯 Funcionalidades Principais

- **4 Dashboards Especializados**: Executivo, Operacional, Financeiro e Recursos Humanos
- **Filtro de Período Temporal**: Seleção rápida ou personalizada por datas
- **Sistema de Atualização de Dados**: Interface web para atualizar CSVs via scripts Python
- **Design 100% Responsivo**: Otimizado para desktop, tablet e mobile
- **Análise em Tempo Real**: KPIs e métricas atualizadas dinamicamente
- **Gráficos Interativos**: Visualizações modernas com Recharts
- **Filtros Dinâmicos**: Por região, instituição e período
- **Alertas Automáticos**: Identificação de situações críticas
- **Resumo do Período**: Estatísticas do filtro temporal aplicado

## 🏗️ Estrutura do Projeto

```
reactjs_dashboard/
├── public/
│   ├── index.html
│   └── data/           # Dados CSV copiados do projeto original
│       ├── fact_atendimentos_urgencia_mensal.csv
│       ├── fact_monitorizacao_sazonal.csv
│       ├── dim_instituicao.csv
│       ├── dim_regiao.csv
│       └── dim_indicador.csv
├── src/
│   ├── components/
│   │   ├── DashboardExecutivo.js      # Visão macro para decisores
│   │   ├── DashboardOperacional.js    # Análise detalhada operacional
│   │   ├── DashboardFinanceiro.js     # Custos e desperdício
│   │   ├── DashboardRH.js            # Recursos humanos
│   │   ├── DataUpdateManager.js      # Sistema de atualização
│   │   ├── PeriodFilter.js           # Filtro de período temporal
│   │   └── PeriodSummary.js          # Resumo do período filtrado
│   ├── utils/
│   │   └── dataLoader.js            # Carregamento e processamento de dados
│   ├── App.js                      # Componente principal
│   ├── index.js                    # Ponto de entrada
│   └── styles.css                  # Estilos responsivos
├── webpack.config.js               # Configuração do webpack
└── package.json                   # Dependências e scripts
```

## 🚀 Como Usar

### Pré-requisitos
- Node.js 16+ instalado
- NPM ou Yarn

### Instalação e Execução

1. **Navegar para o diretório do projeto:**
   ```bash
   cd reactjs_dashboard
   ```

2. **Instalar dependências:**
   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm start
   ```

4. **Acessar a aplicação:**
   ```
   http://localhost:3000
   ```

### Build para Produção
```bash
npm run build
```

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
- **Período**: 2016-2025 (9.75 anos de dados históricos)
- **Volume**: 4.131 registros mensais + 32.870 registros diários
- **Atualização**: Diária para monitorização, mensal para atendimentos

## 🎨 Tecnologias Utilizadas

### Frontend
- **React 18**: Biblioteca principal de componentes
- **Recharts**: Biblioteca para gráficos interativos
- **CSS3**: Estilos responsivos sem frameworks
- **Webpack**: Bundler e servidor de desenvolvimento
- **Babel**: Transpilação JavaScript moderno

### Processamento de Dados
- **Papa Parse**: Parser para arquivos CSV
- **JavaScript Nativo**: Cálculos baseados nas medidas DAX originais

## 📈 Métricas e Indicadores

O dashboard implementa mais de 50 métricas baseadas nas medidas DAX originais:

### Principais Indicadores
- **Score de Ineficiência Global**: 0-100 (quanto maior, pior)
- **% Urgências Falsas**: Verde + Azul + Branca
- **Rácio Enfermeiro/Médico**: Meta OMS = 2.0
- **Custo Desperdiçado**: Estimado baseado em falsas urgências
- **Produtividade**: Atendimentos por profissional

### Status Automáticos
- **🔴 Crítico**: Exige intervenção imediata
- **🟠 Alerta**: Requer monitorização apertada  
- **🟡 Atenção**: Em vigilância
- **🟢 Adequado**: Dentro dos parâmetros

## 🔧 Configuração

### Variáveis de Ambiente
O projeto não requer variáveis de ambiente para desenvolvimento.

### Personalização
- **Cores**: Definidas em `styles.css`
- **Métricas**: Configuradas em `utils/dataLoader.js`
- **Layout**: Ajustável via CSS grid system

## 📝 Notas de Desenvolvimento

### Conversão Power BI → React
- **Medidas DAX**: Convertidas para JavaScript mantendo lógica idêntica
- **Star Schema**: Preservada estrutura de dados original
- **Visualizações**: Recriadas com Recharts mantendo interatividade
- **Filtros**: Implementados com estado React

### Performance
- **Cache**: Dados carregados uma vez e cacheados
- **Lazy Loading**: Componentes carregados sob demanda
- **Bundle Size**: Otimizado com webpack
- **Responsive**: Media queries eficientes

## 🚀 Deploy

### Produção
1. Build do projeto: `npm run build`
2. Deploy da pasta `dist/` para servidor web
3. Configurar servidor para servir arquivos estáticos

### Considerações
- **Dados**: Arquivos CSV devem estar acessíveis em `/public/data/`
- **API**: Sistema de atualização requer backend Python real
- **HTTPS**: Recomendado para produção

## 📄 Licença

MIT License - Ver arquivo LICENSE no projeto original.

## 🤝 Contribuição

Este projeto é uma conversão do dashboard Power BI original mantendo:
- **Integridade dos dados**: Mesmas fontes e períodos
- **Lógica analítica**: Idêntica às medidas DAX originais  
- **Objetivos**: Mesmas métricas e KPIs
- **Usabilidade**: Melhorada com interface web moderna

---

## Credits
- **Desenvolvido por:** [João Domingues Pereira](https://github.com/JoaojPereira) 
- **Versão:** 1.0.0  
- **Data:** Janeiro 2026  
- **Tecnologia:** ReactJS + Webpack

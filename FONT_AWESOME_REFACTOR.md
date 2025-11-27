# Refatoração - Font Awesome Icons

## Resumo das Alterações

Refatoração completa do front-end para substituir emojis por ícones profissionais do Font Awesome.

## Instalação

```bash
npm install @fortawesome/fontawesome-free --save
```

## Configuração

- **angular.json**: Adicionado CSS do Font Awesome aos estilos globais
- **styles.scss**: Adicionados estilos utilitários para ícones

## Ícones Utilizados por Funcionalidade

### Navegação Principal
- **Dashboard**: `fa-home` 🏠
- **Veículos**: `fa-car` 🚗
- **Motoristas**: `fa-user` / `fa-user-tie` 👤
- **Viagens**: `fa-route` / `fa-map-marked-alt` 🗺️
- **Manutenções**: `fa-tools` 🔧
- **Menu Toggle**: `fa-bars` ☰

### Seção de Relatórios
- **Relatórios**: `fa-chart-bar` 📊
- **Custos Operacionais**: `fa-dollar-sign` 💰
- **Utilização de Frota**: `fa-chart-line` 📈
- **Manutenção Preventiva**: `fa-clipboard-list` 📋
- **Desempenho de Motoristas**: `fa-user-tie` 👨‍✈️
- **Relatório de Viagens**: `fa-map-marked-alt` 🚗
- **Depreciação de Veículos**: `fa-chart-line-down` 📉

### Ações em Botões
- **Adicionar/Novo**: `fa-plus` ➕
- **Editar**: `fa-edit` ✏️
- **Excluir**: `fa-trash` 🗑️
- **Confirmar/Finalizar**: `fa-check` ✓
- **Cancelar/Fechar**: `fa-times` ✕
- **Iniciar**: `fa-play` ▶️
- **Buscar**: `fa-search` 🔍
- **Atualizar**: `fa-sync` 🔄

### Alertas e Status
- **Aviso/Alerta**: `fa-exclamation-triangle` ⚠️
- **Sucesso**: `fa-check-circle` ✅
- **Pausado/Ocioso**: `fa-pause-circle` ⏸️

### Exportação
- **Excel**: `fa-file-excel` 📊
- **PDF**: `fa-file-pdf` 📄

### Cards de Resumo (Relatórios)
- **Dinheiro/Custos**: `fa-dollar-sign` 💰
- **Ferramentas**: `fa-tools` 🔧
- **Veículo**: `fa-car` 🚗
- **Estrada/KM**: `fa-road` 📏
- **Marcador no Mapa**: `fa-map-marker-alt` 📍

## Arquivos Modificados

### Componentes de Navegação
- `src/app/app.component.html`
- `src/app/pages/dashboard/dashboard.component.html`

### Listas
- `src/app/pages/vehicles/vehicle-list/vehicle-list.component.html`
- `src/app/pages/drivers/driver-list/driver-list.component.html`
- `src/app/pages/trips/trip-list/trip-list.component.html`
- `src/app/pages/maintenances/maintenance-list/maintenance-list.component.html`

### Componentes de Relatórios
- `src/app/components/trip-report/trip-report.component.html`
- `src/app/components/driver-performance-report/driver-performance-report.component.html`
- `src/app/components/maintenance-report/maintenance-report.component.html`
- `src/app/components/depreciation-report/depreciation-report.component.html`
- `src/app/pages/reports/cost-report/cost-report.component.html`
- `src/app/pages/reports/fleet-utilization-report/fleet-utilization-report.component.html`

### Configuração e Estilos
- `angular.json` - Adicionado CSS do Font Awesome
- `src/styles.scss` - Estilos utilitários para ícones
- `package.json` - Dependência do Font Awesome

## Classes de Estilo Disponíveis

### Tamanhos de Ícones
```html
<i class="fas fa-car icon-sm"></i>  <!-- Pequeno (0.875em) -->
<i class="fas fa-car"></i>           <!-- Normal (1em) -->
<i class="fas fa-car icon-lg"></i>   <!-- Grande (1.25em) -->
<i class="fas fa-car icon-xl"></i>   <!-- Extra Grande (1.5em) -->
```

### Cores de Ícones
```html
<i class="fas fa-car icon-primary"></i>  <!-- Azul -->
<i class="fas fa-check icon-success"></i> <!-- Verde -->
<i class="fas fa-trash icon-danger"></i>  <!-- Vermelho -->
<i class="fas fa-warning icon-warning"></i> <!-- Laranja -->
<i class="fas fa-info icon-info"></i>     <!-- Ciano -->
```

## Benefícios da Refatoração

1. **Profissionalismo**: Ícones consistentes e profissionais em toda a aplicação
2. **Acessibilidade**: Melhor suporte para leitores de tela
3. **Customização**: Facilidade para alterar cores e tamanhos via CSS
4. **Consistência**: Biblioteca padronizada com milhares de ícones
5. **Performance**: Ícones vetoriais que escalam sem perda de qualidade
6. **Manutenibilidade**: Mais fácil de manter e atualizar
7. **Compatibilidade**: Funciona em todos os navegadores modernos

## Como Usar em Novos Componentes

```html
<!-- Botão com ícone -->
<button class="btn btn-primary">
  <i class="fas fa-plus"></i> Adicionar
</button>

<!-- Título com ícone -->
<h2><i class="fas fa-chart-bar"></i> Relatório</h2>

<!-- Ícone apenas -->
<button class="btn btn-sm btn-danger">
  <i class="fas fa-trash"></i>
</button>

<!-- Link com ícone -->
<a routerLink="/dashboard" class="nav-item">
  <i class="fas fa-home"></i> Dashboard
</a>
```

## Referências

- [Font Awesome Documentation](https://fontawesome.com/docs)
- [Font Awesome Icons Gallery](https://fontawesome.com/icons)
- [Font Awesome Angular](https://fontawesome.com/docs/web/use-with/angular)

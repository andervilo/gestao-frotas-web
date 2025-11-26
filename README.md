# Gestão de Frotas - Frontend# GestaoFrotasWeb



Aplicação frontend desenvolvida em **Angular 19+** para o sistema de gestão de frotas.This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.15.



## 🚀 Tecnologias## Development server



- **Angular 19+** - Framework frontendTo start a local development server, run:

- **TypeScript** - Linguagem de programação

- **SCSS** - Pré-processador CSS```bash

- **RxJS** - Programação reativang serve

- **Standalone Components** - Arquitetura modular```



## 📋 Pré-requisitosOnce the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.



- Node.js 18+ ## Code scaffolding

- npm ou yarn

- Backend da aplicação rodando em `http://localhost:8080`Angular CLI includes powerful code scaffolding tools. To generate a new component, run:



## 🔧 Instalação```bash

ng generate component component-name

```bash```

# Instalar dependências

npm installFor a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:



# Executar em modo desenvolvimento```bash

npm startng generate --help

# ou```

ng serve

## Building

# A aplicação estará disponível em http://localhost:4200

```To build the project run:



## 🏗️ Estrutura do Projeto```bash

ng build

``````

src/

├── app/This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

│   ├── models/              # Interfaces e tipos TypeScript

│   │   ├── vehicle.model.ts## Running unit tests

│   │   ├── driver.model.ts

│   │   ├── trip.model.tsTo execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

│   │   └── maintenance.model.ts

│   │```bash

│   ├── services/            # Services para comunicação com APIng test

│   │   ├── vehicle.service.ts```

│   │   ├── driver.service.ts

│   │   ├── trip.service.ts## Running end-to-end tests

│   │   └── maintenance.service.ts

│   │For end-to-end (e2e) testing, run:

│   ├── pages/               # Componentes de páginas

│   │   ├── dashboard/```bash

│   │   └── vehicles/ng e2e

│   │       ├── vehicle-list/```

│   │       └── vehicle-form/

│   │Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

│   ├── app.component.*      # Componente raiz

│   ├── app.config.ts        # Configuração da aplicação## Additional Resources

│   └── app.routes.ts        # Rotas da aplicação

│For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

├── styles.scss              # Estilos globais
└── proxy.conf.json          # Configuração de proxy para API
```

## 📦 Funcionalidades

### ✅ Implementado

- **Dashboard** - Visão geral do sistema
- **Veículos**
  - ✅ Listagem de veículos
  - ✅ Criar novo veículo
  - ✅ Editar veículo
  - ✅ Excluir veículo
  - ✅ Filtros por status e tipo

### 🚧 Próximos Passos

- **Motoristas** - CRUD completo
- **Viagens** - CRUD completo
- **Manutenções** - CRUD completo

## 🔌 Integração com Backend

A aplicação se comunica com o backend Spring Boot através de:

- **Base URL**: `http://localhost:8080`
- **Proxy**: Configurado em `proxy.conf.json`
- **Endpoints**:
  - `/api/vehicles` - Gestão de veículos
  - `/api/drivers` - Gestão de motoristas
  - `/api/trips` - Gestão de viagens
  - `/api/maintenances` - Gestão de manutenções

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm start

# Build de produção
npm run build

# Executar testes
npm test
```

## 📝 Notas

- Certifique-se de que o backend está rodando antes de iniciar o frontend
- O proxy está configurado para redirecionar `/api/*` para `http://localhost:8080`

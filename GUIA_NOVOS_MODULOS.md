# Guia para Adicionar Novos Módulos

Este guia mostra como adicionar os módulos restantes (Motoristas, Viagens, Manutenções) seguindo o mesmo padrão do módulo de Veículos.

## 📋 Checklist para Novo Módulo

Para cada módulo, você precisa criar:

1. ✅ Model já existe em `src/app/models/`
2. ✅ Service já existe em `src/app/services/`
3. ⬜ Componente de listagem (`list`)
4. ⬜ Componente de formulário (`form`)
5. ⬜ Adicionar rotas em `app.routes.ts`
6. ⬜ Adicionar link no menu (sidebar)

---

## 🚗 Exemplo: Módulo de Motoristas (Drivers)

### 1. Criar Componente de Listagem

**Comando:**
```bash
ng generate component pages/drivers/driver-list --standalone
```

**Arquivo: `driver-list.component.ts`**
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Driver, DriverStatus } from '../../../models/driver.model';
import { DriverService } from '../../../services/driver.service';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './driver-list.component.html',
  styleUrl: './driver-list.component.scss'
})
export class DriverListComponent implements OnInit {
  drivers: Driver[] = [];
  loading = false;
  error: string | null = null;

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.loading = true;
    this.driverService.getAll().subscribe({
      next: (data) => {
        this.drivers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar motoristas';
        this.loading = false;
      }
    });
  }

  deleteDriver(id: string): void {
    if (confirm('Tem certeza que deseja excluir este motorista?')) {
      this.driverService.delete(id).subscribe({
        next: () => this.loadDrivers(),
        error: (err) => this.error = 'Erro ao excluir motorista'
      });
    }
  }
}
```

**Arquivo: `driver-list.component.html`**
```html
<div class="driver-list">
  <div class="header">
    <h1>Motoristas</h1>
    <button routerLink="/drivers/new" class="btn btn-primary">
      + Novo Motorista
    </button>
  </div>

  <div *ngIf="loading" class="loading">Carregando...</div>
  <div *ngIf="error" class="error">{{ error }}</div>

  <div class="table-container" *ngIf="!loading && !error">
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>CNH</th>
          <th>Categoria</th>
          <th>Vencimento CNH</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let driver of drivers">
          <td><strong>{{ driver.name }}</strong></td>
          <td>{{ driver.cpf }}</td>
          <td>{{ driver.cnh }}</td>
          <td>{{ driver.cnhCategory }}</td>
          <td>{{ driver.cnhExpirationDate | date:'dd/MM/yyyy' }}</td>
          <td>{{ driver.status }}</td>
          <td class="actions">
            <button 
              [routerLink]="['/drivers', driver.id, 'edit']" 
              class="btn btn-sm btn-secondary">
              ✏️
            </button>
            <button 
              (click)="deleteDriver(driver.id!)" 
              class="btn btn-sm btn-danger">
              🗑️
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### 2. Criar Componente de Formulário

**Comando:**
```bash
ng generate component pages/drivers/driver-form --standalone
```

**Arquivo: `driver-form.component.ts`**
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DriverService } from '../../../services/driver.service';
import { Driver, DriverStatus } from '../../../models/driver.model';

@Component({
  selector: 'app-driver-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './driver-form.component.html',
  styleUrl: './driver-form.component.scss'
})
export class DriverFormComponent implements OnInit {
  driverForm: FormGroup;
  isEditMode = false;
  driverId: string | null = null;
  loading = false;
  error: string | null = null;

  driverStatuses = Object.values(DriverStatus);

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.driverForm = this.fb.group({
      name: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      cnh: ['', [Validators.required]],
      cnhCategory: ['', [Validators.required]],
      cnhExpirationDate: ['', [Validators.required]],
      status: [DriverStatus.ACTIVE]
    });
  }

  ngOnInit(): void {
    this.driverId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.driverId;

    if (this.isEditMode && this.driverId) {
      this.loadDriver(this.driverId);
    }
  }

  loadDriver(id: string): void {
    this.loading = true;
    this.driverService.getById(id).subscribe({
      next: (driver: Driver) => {
        this.driverForm.patchValue(driver);
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar motorista';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.driverForm.invalid) {
      this.driverForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const driver: Driver = this.driverForm.value;

    const request = this.isEditMode && this.driverId
      ? this.driverService.update(this.driverId, driver)
      : this.driverService.create(driver);

    request.subscribe({
      next: () => this.router.navigate(['/drivers']),
      error: () => {
        this.error = 'Erro ao salvar motorista';
        this.loading = false;
      }
    });
  }
}
```

**Arquivo: `driver-form.component.html`**
```html
<div class="driver-form">
  <div class="header">
    <h1>{{ isEditMode ? 'Editar Motorista' : 'Novo Motorista' }}</h1>
    <button routerLink="/drivers" class="btn btn-secondary">← Voltar</button>
  </div>

  <form [formGroup]="driverForm" (ngSubmit)="onSubmit()">
    <div class="form-row">
      <div class="form-group">
        <label>Nome *</label>
        <input type="text" formControlName="name" />
      </div>
      <div class="form-group">
        <label>CPF *</label>
        <input type="text" formControlName="cpf" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>CNH *</label>
        <input type="text" formControlName="cnh" />
      </div>
      <div class="form-group">
        <label>Categoria CNH *</label>
        <input type="text" formControlName="cnhCategory" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Data de Vencimento CNH *</label>
        <input type="date" formControlName="cnhExpirationDate" />
      </div>
      <div class="form-group">
        <label>Status</label>
        <select formControlName="status">
          <option *ngFor="let status of driverStatuses" [value]="status">
            {{ status }}
          </option>
        </select>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" routerLink="/drivers" class="btn btn-secondary">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary">
        {{ isEditMode ? 'Atualizar' : 'Criar' }}
      </button>
    </div>
  </form>
</div>
```

### 3. Adicionar Rotas

**Arquivo: `app.routes.ts`**
```typescript
import { DriverListComponent } from './pages/drivers/driver-list/driver-list.component';
import { DriverFormComponent } from './pages/drivers/driver-form/driver-form.component';

export const routes: Routes = [
  // ... rotas existentes
  { path: 'drivers', component: DriverListComponent },
  { path: 'drivers/new', component: DriverFormComponent },
  { path: 'drivers/:id/edit', component: DriverFormComponent },
];
```

### 4. Menu já está criado!

O link para motoristas já existe na sidebar do `app.component.html`:
```html
<a routerLink="/drivers" routerLinkActive="active" class="nav-item">
  👤 Motoristas
</a>
```

---

## 🗺️ Módulo de Viagens (Trips)

Similar ao de motoristas, mas com campos diferentes:

### Campos do Formulário:
- `vehicleId` (select com lista de veículos)
- `driverId` (select com lista de motoristas)
- `origin` (texto)
- `destination` (texto)
- `startDateTime` (datetime-local)
- `endDateTime` (datetime-local)
- `startMileage` (number)
- `endMileage` (number)
- `notes` (textarea)

### Diferenças:
- Você precisará carregar lista de veículos e motoristas para os selects
- Usar inputs tipo `datetime-local` para datas com hora
- Calcular `distanceTraveled` automaticamente (endMileage - startMileage)

---

## 🔧 Módulo de Manutenções (Maintenances)

### Campos do Formulário:
- `vehicleId` (select com lista de veículos)
- `type` (select com MaintenanceType enum)
- `description` (textarea)
- `cost` (number, currency)
- `scheduledDate` (datetime-local)
- `startDate` (datetime-local)
- `completionDate` (datetime-local)
- `status` (select com MaintenanceStatus enum)
- `notes` (textarea)

---

## 🎨 Reutilizar Estilos

Os estilos (SCSS) dos componentes de veículos podem ser copiados e adaptados:
- `.vehicle-list` → `.driver-list`, `.trip-list`, `.maintenance-list`
- `.vehicle-form` → `.driver-form`, `.trip-form`, `.maintenance-form`

Os estilos globais em `styles.scss` já estão prontos para serem reutilizados!

---

## ✨ Dicas

1. **Copy-Paste é seu amigo**: Use os componentes de veículos como template
2. **Substituir textos**: `vehicle` → `driver`, `trip`, `maintenance`
3. **Ajustar campos**: Cada entidade tem campos diferentes
4. **Testar incrementalmente**: Faça um componente por vez
5. **Console do navegador**: Verifique erros de API

---

## 🚀 Comandos Rápidos

```bash
# Gerar componentes de Motoristas
ng g c pages/drivers/driver-list --standalone
ng g c pages/drivers/driver-form --standalone

# Gerar componentes de Viagens
ng g c pages/trips/trip-list --standalone
ng g c pages/trips/trip-form --standalone

# Gerar componentes de Manutenções
ng g c pages/maintenances/maintenance-list --standalone
ng g c pages/maintenances/maintenance-form --standalone
```

---

## 📝 Ordem Sugerida de Implementação

1. **Motoristas** (mais simples, similar a veículos)
2. **Viagens** (precisa de selects de veículos e motoristas)
3. **Manutenções** (precisa de select de veículos)

Boa sorte! 🎉

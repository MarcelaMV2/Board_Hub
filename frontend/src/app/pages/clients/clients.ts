import { Component, computed, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColumnDef, DataTable } from '../../components/shared/data-table/data-table';
import { DropdownMenu } from '../../components/shared/dropdown-menu/dropdown-menu';
import { ModalLayout } from '../../components/shared/modal-layout/modal-layout';
import { Modal } from '../../components/shared/modal/modal';
import { PageHeader } from '../../components/shared/page-header/page-header';
import { SearchInput } from '../../components/shared/search-input/search-input';
import { StatusChip } from '../../components/shared/status-chip/status-chip';
import { ClientService } from '../../services/client/client';
import { ClientFormComponent } from './client-form/client-form';

@Component({
  selector: 'app-clients',
  imports: [PageHeader, SearchInput, Modal, ModalLayout, ClientFormComponent, DataTable],
  templateUrl: './clients.html',
})
export class Clients {
  clients = signal<any[]>([]);
  searchTerm = signal('');
  isClientModalOpen = signal(false);
  selectedClient = signal<any | null>(null);

  clientColumns: ColumnDef[] = [
    { key: 'index', label: 'N', type: 'index' },
    { key: 'cliente', label: 'Cliente', type: 'cliente' },
    { key: 'celular', label: 'Celular', type: 'text' },
    { key: 'correo', label: 'Correo Electrónico', type: 'text' },
    { key: 'prestamosActivos', label: 'Préstamos activos', type: 'status' },
    { key: 'totalPrestamos', label: 'Total Histórico', type: 'text' },
    { key: 'actions', label: 'Acciones', type: 'actions' },
  ];

  filteredClients = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.clients();

    return this.clients().filter(
      (client) =>
        client.nombre?.toLowerCase().includes(term) ||
        client.dni?.toString().includes(term) ||
        client.celular?.toString().includes(term) ||
        client.correo?.toLowerCase().includes(term),
    );
  });

  constructor(
    private clientService: ClientService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.clientService.getClients().subscribe({
      next: (data) => {
        console.log('Clientes mapeados:', data); // 👈 agrega esto
        this.clients.set(data);
      },
      error: (err) => console.error(err),
    });
  }

  openCreateClientModal() {
    this.selectedClient.set(null);
    this.isClientModalOpen.set(true);
  }

  openEditClient(client: any) {
    this.selectedClient.set(client._raw);
    this.isClientModalOpen.set(true);
  }

  closeClientModal() {
    this.isClientModalOpen.set(false);
    this.selectedClient.set(null);
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
  }

  saveClient(data: any) {
    const isEdit = !!this.selectedClient();
    const uploadFile = data.file;

    const finish = () => {
      this.isClientModalOpen.set(false);
      this.selectedClient.set(null);
    };

    const handleSuccess = (client: any, type: 'create' | 'update') => {
      if (type === 'update') {
        this.clients.update((list) =>
          list.map((c) =>
            c._raw.id === client.id // 👈 compara por _raw.id
              ? {
                  nombre: client.fullName,
                  initials: client.fullName
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase(),
                  avatar: client.perfil ?? null,
                  dni: client.dni,
                  celular: client.telefono,
                  correo: client.email,
                  prestamosActivos: c.prestamosActivos, // conserva contadores
                  totalPrestamos: c.totalPrestamos,
                  _raw: { ...c._raw, ...client },
                }
              : c,
          ),
        );
      } else {
        // create client
        this.clients.update((list) => [
          ...list,
          {
            nombre: client.fullName,
            initials: client.fullName
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase(),
            avatar: client.perfil ?? null,
            dni: client.dni,
            celular: client.telefono,
            correo: client.email,
            prestamosActivos: 0,
            totalPrestamos: 0,
            _raw: client,
          },
        ]);
      }
      finish();
    };

    const executeMutation = (perfilUrl: string) => {
      if (isEdit) {
        this.clientService
          .updateClient(
            this.selectedClient()!.id,
            data.fullName,
            data.dni,
            data.telefono,
            data.email,
            perfilUrl,
          )
          .subscribe({
            next: (res: any) => handleSuccess(res.data.updateClient, 'update'),
            error: (err) => this.handleError(err, 'actualizar'),
          });
      } else {
        this.clientService
          .createClient(data.fullName, data.dni, data.telefono, data.email, perfilUrl)
          .subscribe({
            next: (res: any) => handleSuccess(res.data.createClient, 'create'),
            error: (err) => this.handleError(err, 'crear'),
          });
      }
    };

    if (uploadFile) {
      const formData = new FormData();
      formData.append('file', uploadFile);

      fetch('http://localhost:3000/upload', { method: 'POST', body: formData })
        .then((res) => res.json())
        .then((upload) => executeMutation(upload.url))
        .catch(() => {
          this.snackBar.open('Error al subir la imagen', 'Cerrar', {
            duration: 4000,
            panelClass: ['error-snackbar'],
          });
        });

      return;
    }

    // 🔹 Si no hay archivo y es create → bloquear
    if (!isEdit) {
      this.snackBar.open('Selecciona una imagen', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    // 🔹 Edit sin nueva imagen
    executeMutation(this.selectedClient()!.perfil);
  }

  deleteClient(client: any) {
    const id = client._raw.id;
    const confirmed = confirm('¿Estás seguro que deseas eliminar este cliente?');
    if (!confirmed) return;

    this.clientService.deleteClient(id).subscribe({
      next: () => {
        this.clients.update((list) => list.filter((c) => c._raw.id !== id));
        this.snackBar.open('Cliente eliminado', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      },
      error: (err) => this.handleError(err, 'eliminar'),
    });
  }

  private handleError(err: any, action: string) {
    let errorMessage = `Error al ${action} el cliente`;

    if (err?.error?.errors?.length) {
      errorMessage = err.error.errors[0].message;
    } else if (err?.graphQLErrors?.length) {
      errorMessage = err.graphQLErrors[0].message;
    } else if (err?.message) {
      errorMessage = err.message;
    }

    if (errorMessage.toLowerCase().includes('duplicate key')) {
      errorMessage =
        'Ya existe un cliente con ese valor único (DNI o correo). Modifica el dato o elige otro.';
    }

    this.snackBar.open(errorMessage, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }
}

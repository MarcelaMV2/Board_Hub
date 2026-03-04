import { ChangeDetectorRef, Component } from '@angular/core';
import { DataTable } from "../../components/shared/data-table/data-table";
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
  imports: [
    PageHeader,
    SearchInput,
    StatusChip,
    DropdownMenu,
    Modal,
    ModalLayout,
    ClientFormComponent,
    DataTable
],
  templateUrl: './clients.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Clients {
  clients: any[] = [];
  clientsColumns = ['index', 'dni', 'fullName','telefono','email','perfil', 'actions'];

  constructor(
    private clientService: ClientService,
    private cdr: ChangeDetectorRef,
  ) {}

  isCreateClientOpen = false;

  openModalClient() {
    this.isCreateClientOpen = true;
  }

  ngOnInit() {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  getActiveLoans(loans: any[]) {
    return loans?.filter((l) => l.status === 'ACTIVO').length ?? 0;
  }

  getTotalLoans(loans: any[]) {
    return loans?.length ?? 0;
  }

  getInitials(fullName: string) {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  onSearch(term: string) {}

  createClient(data: any) {
    const uploadFile = data.file;
    if (!uploadFile) return alert('Selecciona una imagen');

    const formData = new FormData();
    formData.append('file', uploadFile);

    fetch('http://localhost:3000/upload', { method: 'POST', body: formData })
      .then((res) => res.json())
      .then((upload) => {
        this.clientService
          .createClient(data.fullName, data.dni, data.telefono, data.email, upload.url)
          .subscribe({
            next: (res: any) => {
              const newClient = res.data?.createClient;
              if (newClient) {
                this.clients = [...this.clients, newClient];
                this.cdr.markForCheck();
              }
              this.isCreateClientOpen = false;
            },
            error: (err) => console.error(err),
          });
      });
  }
  editClient(client: any) {}
  deleteClient(id: string) {}
}

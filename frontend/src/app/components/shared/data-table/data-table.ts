import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation,
  ContentChild,
  TemplateRef,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { DropdownMenu } from '../dropdown-menu/dropdown-menu';
import { StatusChip } from '../status-chip/status-chip';

export interface ColumnDef {
  key: string;
  label: string;
  type:
    | 'index'
    | 'text'
    | 'cliente'
    | 'status'
    | 'badges'
    | 'actions'
    | 'loan-status'
    | 'game-badges'
    | 'status-action';
}

@Component({
  selector: 'data-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, DropdownMenu, StatusChip],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DataTable implements OnChanges, AfterViewInit {
  @Input() columnDefs: ColumnDef[] = [];
  @Input() data: any[] = [];
  @Input() expandable: boolean = false;
  @ContentChild('expandedRow') expandedRowTemplate!: TemplateRef<any>;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() showView: boolean = false;
  @Output() view = new EventEmitter<any>();
  @Output() statusChange = new EventEmitter<{ row: any; status: string }>();
  activeStatusRow: any = null;

  toggleStatusMenu(row: any) {
    this.activeStatusRow = this.activeStatusRow === row ? null : row;
  }

  onStatusChange(row: any, status: string) {
    this.statusChange.emit({ row, status });
  }

  onView(row: any) {
    this.view.emit(row);
  }

  dataSource = new MatTableDataSource<any>();
  expandedRow: any | null = null;

  // mat-table necesita solo los keys
  get displayedColumns(): string[] {
    return this.columnDefs.map((c) => c.key);
  }

  get allColumns(): string[] {
    return this.expandable ? [...this.displayedColumns, 'expandedDetail'] : this.displayedColumns;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSource.data = this.data;
      if (this.paginator) this.dataSource.paginator = this.paginator;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  toggleRow(row: any) {
    this.expandedRow = this.expandedRow === row ? null : row;
  }
  onEdit(row: any) {
    this.edit.emit(row);
  }
  onDelete(row: any) {
    this.delete.emit(row);
  }
}

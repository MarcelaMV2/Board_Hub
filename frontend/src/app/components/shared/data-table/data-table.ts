import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { DropdownMenu } from "../dropdown-menu/dropdown-menu";

@Component({
  selector: 'data-table',
  imports: [MatTableModule, MatPaginatorModule, CommonModule, DropdownMenu],
  standalone: true,
  templateUrl: './data-table.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable implements OnChanges {
  @Input() displayedColumns: string[] = [];
  @Input() data: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  // displayedColumns: string[] = ['id', 'name', 'description'];
  dataSource = new MatTableDataSource<any>();

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.displayedColumns);
    if (changes['data']) {
      this.dataSource = new MatTableDataSource(this.data);

      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    }
  }

  onEdit(row: any) {
    this.edit.emit(row);
  }

  onDelete(row: any) {
    this.delete.emit(row);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {}
}

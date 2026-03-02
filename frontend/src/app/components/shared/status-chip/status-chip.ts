import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-chip',
  imports: [],
  templateUrl: './status-chip.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusChip {
  @Input() label: string = '';
  @Input() type: 'active' | 'vencido' | 'devuelto' | 'sin-prestamos' | 'disponible' | 'agotado' = 'active';

  get styles() {
    const map: Record<string, string> = {
      active: 'bg-[#1E3A5F] text-[#60A5FA] border border-active-500',
      vencido: 'bg-[#3B1A1A] text-[#F87171] border border-red-500',
      devuelto: 'bg-[#14532D] text-[#4ADE80] border border-green-500',
      'sin-prestamos': 'bg-[#1E293B] text-[#94A3B8] border border-[#334155]',
      disponible: 'bg-[#14532D] text-[#4ADE80] border border-[#22C55E]',
      agotado: 'bg-[#3B1A1A] text-[#F87171] border border-[#EF4444]',
    };
    return map[this.type];
  }
}

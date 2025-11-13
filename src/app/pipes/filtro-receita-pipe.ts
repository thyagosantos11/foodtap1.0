import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroReceita',
  standalone: true
})
export class FiltroReceitaPipe implements PipeTransform {

  transform(receitas: any[], termo: string): any[] {
    if (!receitas) return [];
    if (!termo) return receitas;

    termo = termo.toLowerCase();

    return receitas.filter(receita =>
      receita.nome.toLowerCase().includes(termo)
    );
  }

}


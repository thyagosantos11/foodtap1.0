import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

interface ReceitaItem {
  receita: string;
  link_imagem: string;
  ingredientes: string;
  modo_preparo: string;
}

interface ReceitaExibida {
  nome: string;
  imagemUrl: string;
  ingredientes: string;
  preparo: string;
}

interface ApiResponse {
  items: ReceitaItem[];
  total?: number;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReceitaService {
  private apiUrl = 'https://api-receitas-pi.vercel.app/receitas/todas';

  constructor(private http: HttpClient) { }

  /**
   * Busca todas as receitas da API
   * @param page Página para paginação (padrão: 1)
   * @param limit Limite de itens por página (padrão: 20)
   * @returns Observable com array de receitas mapeadas
   */
  getReceitas(page: number = 1, limit: number = 20): Observable<ReceitaExibida[]> {
    const url = `${this.apiUrl}?page=${page}&limit=${limit}`;

    return this.http.get<ApiResponse>(url).pipe(
      tap(response => {
        console.log('Receitas carregadas com sucesso:', response);
      }),
      map((response: ApiResponse) => {
        if (response && response.items) {
          return this.mapearReceitas(response.items);
        }
        return [];
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Busca uma receita específica pelo nome/ID
   * @param id Nome ou ID da receita
   * @returns Observable com a receita
   */
  getReceitaById(id: string): Observable<ReceitaExibida> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.get<ReceitaItem>(url).pipe(
      tap(response => {
        console.log('Receita carregada:', response);
      }),
      map((item: ReceitaItem) => this.mapearReceita(item)),
      catchError(this.handleError)
    );
  }

  /**
   * Mapeia um array de ReceitaItem para ReceitaExibida
   * @param items Array de receitas da API
   * @returns Array de receitas mapeadas
   */
  private mapearReceitas(items: ReceitaItem[]): ReceitaExibida[] {
    return items.map(item => this.mapearReceita(item));
  }

  /**
   * Mapeia um ReceitaItem para ReceitaExibida
   * @param item Receita da API
   * @returns Receita mapeada
   */
  private mapearReceita(item: ReceitaItem): ReceitaExibida {
    return {
      nome: item.receita,
      imagemUrl: item.link_imagem,
      ingredientes: item.ingredientes,
      preparo: item.modo_preparo
    };
  }

  /**
   * Trata erros de requisição HTTP
   * @param error Erro HTTP
   * @returns Observable com erro
   */
  private handleError(error: HttpErrorResponse) {
    let mensagem = 'Erro ao carregar receitas';

    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      mensagem = `Erro: ${error.error.message}`;
    } else {
      // Erro do servidor
      mensagem = `Erro HTTP ${error.status}: ${error.message}`;
    }

    console.error(mensagem);
    return throwError(() => new Error(mensagem));
  }
}

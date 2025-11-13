// src/app/home/home.page.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReceitaService } from '../services/receita.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface ReceitaExibida {
  nome: string;
  imagemUrl: string;
  ingredientes: string; 
  preparo: string; 
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit, OnDestroy {

  // Array exibido no HTML (filtrado)
  receitas: ReceitaExibida[] = []; 
  
  // Array completo (imutável) para ser a base da busca
  private todasReceitas: ReceitaExibida[] = [];
  
  // Para controlar o carregamento
  isLoading = true;
  errorMessage = '';

  // Subject para cancelar observables ao destruir o componente
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private receitaService: ReceitaService
  ) {}
  
  ngOnInit() {
    this.carregarReceitas();
  }

  /**
   * Carrega os dados da API e preenche os arrays 'todasReceitas' e 'receitas'
   */
  carregarReceitas() {
    this.isLoading = true;
    this.errorMessage = '';

    this.receitaService.getReceitas(1, 20)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (receitas: ReceitaExibida[]) => {
          this.todasReceitas = receitas;
          this.receitas = receitas;
          this.isLoading = false;
          console.log('Receitas carregadas:', this.receitas);
        },
        error: (erro) => {
          this.errorMessage = 'Erro ao carregar receitas. Tente novamente.';
          this.isLoading = false;
          console.error('Erro ao carregar receitas:', erro);
        }
      });
  }

  /**
   * Filtra a lista de receitas com base no termo digitado na barra de pesquisa
   * @param event Evento de mudança da ion-searchbar
   */
  handleSearch(event: any) {
    const termoBusca = event.target.value.toLowerCase();
    
    // Se o termo de busca estiver vazio, exibe todas as receitas originais
    if (!termoBusca) {
      this.receitas = this.todasReceitas;
      return;
    }

    // Filtra a lista completa (todasReceitas) e atualiza a lista exibida (receitas)
    this.receitas = this.todasReceitas.filter(receita => {
      return receita.nome.toLowerCase().includes(termoBusca);
    });
  }

  /**
   * Trata erro ao carregar imagem, exibindo uma imagem padrão
   * @param event Evento de erro da imagem
   */
  onImageError(event: any) {
    event.target.src = 'assets/icon/placeholder-recipe.svg';
  }

  /**
   * Navega para a página de detalhes da receita
   * @param receitaNome Nome da receita
   */
  verDetalhes(receitaNome: string) {
    const id = receitaNome.toLowerCase().replace(/ /g, '-'); 
    console.log('Navegando para:', '/detalhe', id);
    this.router.navigate(['./detalhe', id], { relativeTo: this.route });
  }

  /**
   * Limpa subscriptions ao destruir o componente
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
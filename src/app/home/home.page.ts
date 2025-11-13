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

  receitas: ReceitaExibida[] = []; 
  
  private todasReceitas: ReceitaExibida[] = [];
  
  isLoading = true;
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private receitaService: ReceitaService
  ) {}
  
  ngOnInit() {
    this.carregarReceitas();
  }

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

  
   

  handleSearch(event: any) {
    const termoBusca = event.target.value.toLowerCase();
    
    if (!termoBusca) {
      this.receitas = this.todasReceitas;
      return;
    }

    this.receitas = this.todasReceitas.filter(receita => {
      return receita.nome.toLowerCase().includes(termoBusca);
    });
  }

  onImageError(event: any) {
    event.target.src = 'assets/icon/placeholder-recipe.svg';
  }

  verDetalhes(receitaNome: string) {
    const id = receitaNome.toLowerCase().replace(/ /g, '-'); 
    console.log('Navegando para:', '/detalhe', id);
    this.router.navigate(['./detalhe', id], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
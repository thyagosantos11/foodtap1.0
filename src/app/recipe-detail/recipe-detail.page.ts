// src/app/recipe-detail/recipe-detail.page.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RECIPE_VIDEOS } from '../data/recipe-videos';

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
  videoUrl?: string;
}

interface Avaliacao {
  id: string;
  nome: string;
  nota: number;
  comentario: string;
  data: string;
}@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
  standalone: false
})
export class RecipeDetailPage implements OnInit {

  receita: ReceitaExibida | undefined;
  avaliacoes: Avaliacao[] = [];
  
  novaAvaliacao = {
    nome: '',
    nota: 5,
    comentario: ''
  };
  
  private apiUrl = "https://api-receitas-pi.vercel.app/receitas/todas?page=1&limit=20"; // URL completa

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.carregarDetalhes();
    this.carregarAvaliacoes();
  }  async carregarDetalhes() {
    // 1. Pega o ID (nome formatado) da URL
    const receitaIdFormatado = this.route.snapshot.paramMap.get('id');
    
    if (!receitaIdFormatado) {
        console.error('ID da receita não encontrado na URL.');
        return;
    }

    try {
        // 2. Faz a requisição para obter a lista completa
        const response = await fetch(this.apiUrl);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.items && Array.isArray(data.items)) {
            
            // 3. Busca na lista o item que corresponde ao ID formatado
            const receitaEncontrada = data.items.find((item: ReceitaItem) => 
                item.receita.toLowerCase().replace(/ /g, '-') === receitaIdFormatado
            );

            if (receitaEncontrada) {
                // 4. Mapeia e define os detalhes da receita
                this.receita = {
                    nome: receitaEncontrada.receita,
                    imagemUrl: receitaEncontrada.link_imagem,
                    ingredientes: this.formatarLista(receitaEncontrada.ingredientes),
                    preparo: this.formatarLista(receitaEncontrada.modo_preparo),
                    videoUrl: RECIPE_VIDEOS[receitaIdFormatado]
                };
            } else {
                console.warn('Receita não encontrada na API.');
            }
        }
    } catch (error) {
        console.error('Falha ao carregar detalhes da receita:', error);
    }
  }

    /**
     * Função auxiliar para formatar a string de ingredientes/preparo em lista HTML.
     * @param texto String com itens separados por ponto e vírgula ou ponto.
     * @returns String formatada com quebras de linha (\n) para uso no HTML.
     */
    private formatarLista(texto: string): string {
        // Tenta substituir pontos e vírgulas (ou apenas pontos) por nova linha para facilitar o *ngFor no HTML
        return texto.replace(/; /g, '\n').replace(/\. /g, '\n').trim();
    }

    carregarAvaliacoes() {
      const receitaId = this.route.snapshot.paramMap.get('id');
      const chave = `avaliacoes_${receitaId}`;
      const dados = localStorage.getItem(chave);
      if (dados) {
        try {
          this.avaliacoes = JSON.parse(dados);
        } catch (e) {
          this.avaliacoes = [];
        }
      }
    }

    adicionarAvaliacao() {
      if (!this.novaAvaliacao.nome.trim() || !this.novaAvaliacao.comentario.trim()) {
        alert('Preencha nome e comentário!');
        return;
      }

      const avaliacao: Avaliacao = {
        id: Date.now().toString(),
        nome: this.novaAvaliacao.nome,
        nota: this.novaAvaliacao.nota,
        comentario: this.novaAvaliacao.comentario,
        data: new Date().toLocaleDateString('pt-BR')
      };

      this.avaliacoes.unshift(avaliacao);
      this.salvarAvaliacoes();
      this.novaAvaliacao = { nome: '', nota: 5, comentario: '' };
    }

    private salvarAvaliacoes() {
      const receitaId = this.route.snapshot.paramMap.get('id');
      const chave = `avaliacoes_${receitaId}`;
      localStorage.setItem(chave, JSON.stringify(this.avaliacoes));
    }

    deletarAvaliacao(id: string) {
      this.avaliacoes = this.avaliacoes.filter(a => a.id !== id);
      this.salvarAvaliacoes();
    }

    obterNotaMedia(): number {
      if (this.avaliacoes.length === 0) return 0;
      const soma = this.avaliacoes.reduce((acc, a) => acc + a.nota, 0);
      return Math.round((soma / this.avaliacoes.length) * 10) / 10;
    }
}
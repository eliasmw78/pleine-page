import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LIVRES } from '../livres';

@Component({
  selector: 'app-fiche',
  imports: [RouterLink],
  templateUrl: './fiche.html',
  styleUrl: './fiche.css'
})
export class Fiche {
  readonly id = input.required<string>();
  readonly livre = computed(() => LIVRES.find(l => l.id === Number(this.id())));
  
  protected readonly panier = signal<number[]>([]);
  protected readonly ajoute = computed(() => this.panier().includes(Number(this.id())));
  
  protected readonly suggestions = computed(() =>
    LIVRES.filter(l => l.id !== Number(this.id())).slice(0, 4)
  );

  protected ajouter() {
    this.panier.update(p => [...p, Number(this.id())]);
  }
}

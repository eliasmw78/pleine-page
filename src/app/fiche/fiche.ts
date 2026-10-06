import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LIVRES } from '../livres';
import { PanierService } from '../panier/panier.service';

@Component({
  selector: 'app-fiche',
  imports: [RouterLink],
  templateUrl: './fiche.html',
  styleUrl: './fiche.css'
})
export class Fiche {
  protected readonly panierService = inject(PanierService);

  readonly id = input.required<string>();
  readonly livre = computed(() => LIVRES.find(l => l.id === Number(this.id())));

  // Ce computed interroge directement le panier global persistant dans le localStorage
  protected readonly ajoute = computed(() =>
    this.panierService.estDansLePanier(Number(this.id()))
  );

  protected readonly quantiteDansPanier = computed(() =>
    this.panierService.quantiteDe(Number(this.id()))
  );

  protected readonly suggestions = computed(() =>
    LIVRES.filter(l => l.id !== Number(this.id())).slice(0, 4)
  );

  protected ajouter(): void {
    const livre = this.livre();
    if (livre) {
      this.panierService.ajouter(livre);
    }
  }
}

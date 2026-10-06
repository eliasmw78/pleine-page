import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LIVRES, Livre } from '../livres';
import { PanierService } from '../panier/panier.service';

@Component({
  selector: 'app-catalogue',
  imports: [RouterLink],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css'
})
export class Catalogue {
  protected readonly panierService = inject(PanierService);

  protected readonly filtre = signal('');
  protected readonly resultats = computed(() => {
    const q = this.filtre().trim().toLowerCase();
    if (!q) return LIVRES;
    return LIVRES.filter(l =>
      l.auteur.toLowerCase().includes(q) || l.titre.toLowerCase().includes(q)
    );
  });

  protected ajouterRapide(event: MouseEvent, livre: Livre): void {
    event.stopPropagation();
    event.preventDefault();
    this.panierService.ajouter(livre);
  }
}

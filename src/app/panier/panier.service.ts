import { Injectable, computed, effect, signal } from '@angular/core';
import { Livre, LIVRES } from '../livres';

export interface ArticlePanier {
  livre: Livre;
  quantite: number;
}

const STORAGE_KEY = 'pleine_page_panier';

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private readonly _articles = signal<ArticlePanier[]>(this.chargerPanier());
  readonly articles = this._articles.asReadonly();

  readonly codePromo = signal<string>('');
  readonly notification = signal<{ message: string; type: 'succes' | 'info' } | null>(null);

  // Computeds
  readonly totalArticles = computed(() =>
    this._articles().reduce((total, a) => total + a.quantite, 0)
  );

  readonly sousTotal = computed(() => {
    const total = this._articles().reduce((sum, a) => sum + a.livre.prix * a.quantite, 0);
    return Math.round(total * 100) / 100;
  });

  readonly tauxRemise = computed(() => {
    const code = this.codePromo().trim().toUpperCase();
    if (code === 'PLEINEPAGE10') return 0.10;
    if (code === 'BIBLIO20') return 0.20;
    return 0;
  });

  readonly montantRemise = computed(() => {
    return Math.round(this.sousTotal() * this.tauxRemise() * 100) / 100;
  });

  readonly seuilLivraisonGratuite = 35;

  readonly fraisDePort = computed(() => {
    if (this._articles().length === 0) return 0;
    const code = this.codePromo().trim().toUpperCase();
    if (code === 'CADEAU') return 0;
    return this.sousTotal() >= this.seuilLivraisonGratuite ? 0 : 3.90;
  });

  readonly restePourFraisOfferts = computed(() => {
    const reste = this.seuilLivraisonGratuite - this.sousTotal();
    return reste > 0 ? Math.round(reste * 100) / 100 : 0;
  });

  readonly progressionLivraison = computed(() => {
    if (this.sousTotal() <= 0) return 0;
    const pct = (this.sousTotal() / this.seuilLivraisonGratuite) * 100;
    return Math.min(100, Math.round(pct));
  });

  readonly totalFinal = computed(() => {
    const total = this.sousTotal() - this.montantRemise() + this.fraisDePort();
    return Math.max(0, Math.round(total * 100) / 100);
  });

  // Métriques poétiques & littéraires
  readonly estimationTempsLectureHeures = computed(() => {
    // Environ 5 heures de lecture en moyenne par livre
    const totalMinutes = this._articles().reduce((acc, a) => {
      const pages = a.livre.pages ?? 300;
      return acc + (pages * 1.2 * a.quantite); // ~1.2 minute par page
    }, 0);
    const heures = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return { heures, minutes };
  });

  readonly hauteurPileCm = computed(() => {
    // Environ 2.4 cm d'épaisseur par livre
    const totalCm = this._articles().reduce((acc, a) => {
      return acc + (2.4 * a.quantite);
    }, 0);
    return Math.round(totalCm * 10) / 10;
  });

  readonly tassesDeThe = computed(() => {
    // Une tasse toutes les 45 minutes de lecture
    const { heures, minutes } = this.estimationTempsLectureHeures();
    const totalMinutes = heures * 60 + minutes;
    return Math.max(1, Math.round(totalMinutes / 45));
  });

  constructor() {
    // Synchronisation automatique dans localStorage dès qu'une mutation a lieu
    effect(() => {
      this.sauvegarderPanier(this._articles());
    });
  }

  estDansLePanier(id: number): boolean {
    return this._articles().some(a => a.livre.id === id);
  }

  quantiteDe(id: number): number {
    return this._articles().find(a => a.livre.id === id)?.quantite ?? 0;
  }

  ajouter(livre: Livre, quantite = 1): void {
    this._articles.update(items => {
      const existant = items.find(a => a.livre.id === livre.id);
      if (existant) {
        return items.map(a =>
          a.livre.id === livre.id ? { ...a, quantite: a.quantite + quantite } : a
        );
      }
      return [...items, { livre, quantite }];
    });
    this.afficherNotification(`« ${livre.titre} » a été ajouté à votre panier !`, 'succes');
  }

  incrementer(id: number): void {
    this._articles.update(items =>
      items.map(a => (a.livre.id === id ? { ...a, quantite: a.quantite + 1 } : a))
    );
  }

  decrementer(id: number): void {
    this._articles.update(items => {
      const existant = items.find(a => a.livre.id === id);
      if (!existant) return items;
      if (existant.quantite <= 1) {
        return items.filter(a => a.livre.id !== id);
      }
      return items.map(a =>
        a.livre.id === id ? { ...a, quantite: a.quantite - 1 } : a
      );
    });
  }

  modifierQuantite(id: number, quantite: number): void {
    if (quantite <= 0) {
      this.retirer(id);
      return;
    }
    this._articles.update(items =>
      items.map(a => (a.livre.id === id ? { ...a, quantite: Math.min(99, quantite) } : a))
    );
  }

  retirer(id: number): void {
    const item = this._articles().find(a => a.livre.id === id);
    this._articles.update(items => items.filter(a => a.livre.id !== id));
    if (item) {
      this.afficherNotification(`« ${item.livre.titre} » retiré du panier.`, 'info');
    }
  }

  vider(): void {
    this._articles.set([]);
    this.codePromo.set('');
    this.afficherNotification('Le panier a été vidé.', 'info');
  }

  appliquerCodePromo(code: string): boolean {
    const c = code.trim().toUpperCase();
    if (c === 'PLEINEPAGE10' || c === 'BIBLIO20' || c === 'CADEAU') {
      this.codePromo.set(c);
      this.afficherNotification(`Code « ${c} » appliqué avec succès !`, 'succes');
      return true;
    }
    this.afficherNotification('Code promotionnel invalide.', 'info');
    return false;
  }

  supprimerCodePromo(): void {
    this.codePromo.set('');
  }

  private afficherNotification(message: string, type: 'succes' | 'info'): void {
    this.notification.set({ message, type });
    setTimeout(() => {
      if (this.notification()?.message === message) {
        this.notification.set(null);
      }
    }, 3200);
  }

  private chargerPanier(): ArticlePanier[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];

      // Ré-enrichir avec les livres officiels si disponibles
      return parsed
        .map((item: any) => {
          const livre = LIVRES.find(l => l.id === item.livre?.id) || item.livre;
          const quantite = Number(item.quantite) || 1;
          return livre ? { livre, quantite } : null;
        })
        .filter((item): item is ArticlePanier => item !== null && item.quantite > 0);
    } catch (e) {
      console.warn('Impossible de charger le panier depuis localStorage', e);
      return [];
    }
  }

  private sauvegarderPanier(articles: ArticlePanier[]): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (e) {
      console.warn('Impossible de sauvegarder le panier dans localStorage', e);
    }
  }
}

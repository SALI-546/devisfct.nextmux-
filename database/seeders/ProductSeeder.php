<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductSeeder extends Seeder
{
    public function run()
    {
       
        DB::transaction(function () {
            
            $packs = [
                // 1. Création de Site Web
                // 1.1 Pack Site Vitrine
                [
                    'name' => 'Pack Site Vitrine',
                    'description' => 'Pack pour la création d\'un site vitrine avec plusieurs pages.',
                    'price_without_content' => null,
                    'price_with_content' => null,
                    'features' => [
                        [
                            'name' => 'Landing Page - Pack Site Vitrine',
                            'description' => 'Présentation générale avec 4 sections au plus.',
                            'price_without_content' => 80000,
                            'price_with_content' => 80000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Page d\'accueil - Pack Site Vitrine',
                            'description' => 'Page de présentation générale.',
                            'price_without_content' => 50000,
                            'price_with_content' => 50000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Page de services - Pack Site Vitrine',
                            'description' => 'Présentation des services offerts.',
                            'price_without_content' => 60000,
                            'price_with_content' => 60000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Page de contact - Pack Site Vitrine',
                            'description' => 'Formulaire de contact basique (Nom & Prénoms, Objet, Email, Message).',
                            'price_without_content' => 40000,
                            'price_with_content' => 40000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Mise en ligne - Pack Site Vitrine',
                            'description' => 'Déploiement du site sur un serveur d\'hébergement.',
                            'price_without_content' => 20000,
                            'price_with_content' => 20000,
                            'quantite' => 1,
                        ],
                    ],
                ],
                // 1.2 Pack Site Institutionnel
                [
                    'name' => 'Pack Site Institutionnel',
                    'description' => 'Pack pour la création d\'un site institutionnel complet.',
                    'price_without_content' => null,
                    'price_with_content' => null,
                    'features' => [
                        [
                            'name' => 'Inclus Site Vitrine - Pack Site Institutionnel',
                            'description' => 'Tout le contenu du site vitrine.',
                            'price_without_content' => 220000,
                            'price_with_content' => 220000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Page d\'actualités - Pack Site Institutionnel',
                            'description' => 'Section dédiée aux articles de presse ou nouveautés.',
                            'price_without_content' => 60000,
                            'price_with_content' => 60000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Galerie photo/vidéo - Pack Site Institutionnel',
                            'description' => 'Intégration d\'une galerie photo ou vidéo.',
                            'price_without_content' => 30000,
                            'price_with_content' => 30000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'FAQ - Pack Site Institutionnel',
                            'description' => 'Page Foire aux questions.',
                            'price_without_content' => 40000,
                            'price_with_content' => 40000,
                            'quantite' => 1,
                        ],
                    ],
                ],
                // 1.3 Pack Site E-commerce
                [
                    'name' => 'Pack Site E-commerce',
                    'description' => 'Pack pour la création d\'un site e-commerce complet.',
                    'price_without_content' => null,
                    'price_with_content' => null,
                    'features' => [
                        [
                            'name' => 'Inclus Site Institutionnel - Pack Site E-commerce',
                            'description' => 'Tout le contenu du site institutionnel.',
                            'price_without_content' => 300000,
                            'price_with_content' => 300000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Gestion des produits - Pack Site E-commerce',
                            'description' => 'Ajout, modification, suppression de produits dans la boutique.',
                            'price_without_content' => 50000,
                            'price_with_content' => 50000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Panier - Pack Site E-commerce',
                            'description' => 'Système de panier pour gérer les achats.',
                            'price_without_content' => 50000,
                            'price_with_content' => 50000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Page de paiement - Pack Site E-commerce',
                            'description' => 'Intégration des moyens de paiement en ligne (Mobile Money, cartes bancaires).',
                            'price_without_content' => 75000,
                            'price_with_content' => 75000,
                            'quantite' => 1,
                        ],
                    ],
                ],
                // 1.4 Fonctionnalités supplémentaires (Création de Site Web)
                [
                    'name' => 'Fonctionnalités supplémentaires - Création de Site Web',
                    'description' => 'Ajout de fonctionnalités supplémentaires à n\'importe quel pack de création de site web.',
                    'price_without_content' => null,
                    'price_with_content' => null,
                    'features' => [
                        [
                            'name' => 'Page supplémentaire - Création de Site Web',
                            'description' => 'Ajout d\'une page personnalisée supplémentaire.',
                            'price_without_content' => 35000,
                            'price_with_content' => 35000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Blog - Création de Site Web',
                            'description' => 'Section dédiée aux articles avec gestion des catégories.',
                            'price_without_content' => 50000,
                            'price_with_content' => 50000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Espace membre - Création de Site Web',
                            'description' => 'Création d\'un espace sécurisé pour les utilisateurs.',
                            'price_without_content' => 70000,
                            'price_with_content' => 70000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Système d\'authentication - Création de Site Web',
                            'description' => 'Gestion des comptes utilisateurs avec login/mot de passe.',
                            'price_without_content' => 45000,
                            'price_with_content' => 45000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Moyen de paiement en ligne - Création de Site Web',
                            'description' => 'Intégration de solutions comme Paypal, Stripe, etc.',
                            'price_without_content' => 60000,
                            'price_with_content' => 60000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Chatbot - Création de Site Web',
                            'description' => 'Outil d\'assistance automatisée pour les visiteurs du site.',
                            'price_without_content' => 80000,
                            'price_with_content' => 80000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Multilingue (+ 1 langue) - Création de Site Web',
                            'description' => 'Support pour plusieurs langues sur le site.',
                            'price_without_content' => 90000,
                            'price_with_content' => 90000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Référencement SEO avancé - Création de Site Web',
                            'description' => 'Optimisation pour améliorer le classement sur Google.',
                            'price_without_content' => 60000,
                            'price_with_content' => 60000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Migration d’hébergement - Création de Site Web',
                            'description' => 'Transfert du site vers un nouvel hébergement.',
                            'price_without_content' => 40000,
                            'price_with_content' => 40000,
                            'quantite' => 1,
                        ],
                        [
                            'name' => 'Installation de Mise en place d\'un CMS - Création de Site Web',
                            'description' => 'Installation et configuration d\'un CMS comme WordPress, Joomla, etc.',
                            'price_without_content' => 50000,
                            'price_with_content' => 50000,
                            'quantite' => 1,
                        ],
                    ],
                ],

               
            ];

            foreach ($packs as $packData) {
                // Créer le pack principal (parent)
                $pack = Product::create([
                    'name' => $packData['name'],
                    'description' => $packData['description'],
                    'price_without_content' => $packData['price_without_content'],
                    'price_with_content' => $packData['price_with_content'],
                    'parent_id' => null, 
                ]);

                Log::info("Pack créé: {$pack->name} (ID: {$pack->id})");

               
                foreach ($packData['features'] as $featureData) {
                    
                    $uniqueName = "{$featureData['name']}";

                    Product::create([
                        'name' => $uniqueName,
                        'description' => $featureData['description'],
                        'price_without_content' => $featureData['price_without_content'],
                        'price_with_content' => $featureData['price_with_content'],
                        'parent_id' => $pack->id, 
                    ]);

                    Log::info("Feature créée: {$uniqueName} (Parent ID: {$pack->id})");
                }
            }
        });
    }
}

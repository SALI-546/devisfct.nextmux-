<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Quote;
use App\Models\Client;
use Illuminate\Support\Facades\Auth; // Importer Auth
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class QuoteController extends Controller
{
    /**
     * Récupérer tous les devis avec possibilité de recherche.
     */
    public function index(Request $request)
    {
        $query = Quote::with(['client.user', 'items.product']);

        // Recherche par numéro de devis, nom de client, email ou entreprise
        if ($search = $request->input('search')) {
            $query->where('numero', 'like', "%{$search}%")
                  ->orWhereHas('client', function($q) use ($search) {
                      $q->where('nom', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('entreprise', 'like', "%{$search}%");
                  });
        }

        $quotes = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($quotes, 200);
    }

    /**
     * Créer un nouveau devis avec conditions.
     */
    public function store(Request $request)
    {
        // Log des données reçues pour le débogage
        Log::info('Données reçues pour la création du devis:', $request->all());

        // Générer un numéro de devis unique si non fourni
        $numero = $request->input('numero', 'DEV-' . date('Y') . '-' . str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT));

        // Récupérer l'utilisateur authentifié
        $user = Auth::user();

        // Valider les données générales, client et conditions
        $validator = Validator::make($request->all(), [
            'numero' => 'required|string|unique:quotes,numero',
            'date_emission' => 'required|date',
            'include_tva' => 'required|boolean',
            'logo' => 'nullable|image|max:2048',
            'client' => 'required|array',
            'client.entreprise' => 'required|string|max:255',
            'client.nom' => 'required|string|max:255',
            'client.email' => 'required|email|max:255',
            'client.telephone' => 'required|string|max:20',
            'client.adresse' => 'required|string',
            // Supprimer 'client.user_id'
            // Conditions
            'paiement' => 'required|string|max:255',
            'commentaires' => 'nullable|string',
            'signature' => 'nullable|image|max:2048',
            // 'items' peut être géré ici ou via une requête PATCH séparée
        ]);

        if ($validator->fails()) {
            Log::warning('Validation échouée pour la création du devis:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Gérer le logo si fourni
        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        // Gérer la signature si fournie
        $signaturePath = null;
        if ($request->hasFile('signature')) {
            $signaturePath = $request->file('signature')->store('signatures', 'public');
        }

        // Vérifier si le client existe déjà par email
        $clientData = $request->input('client');
        $client = Client::where('email', $clientData['email'])->first();

        if (!$client) {
            // Créer le client et l'associer à l'utilisateur authentifié
            try {
                $client = Client::create([
                    'entreprise' => $clientData['entreprise'],
                    'nom' => $clientData['nom'],
                    'email' => $clientData['email'],
                    'telephone' => $clientData['telephone'],
                    'adresse' => $clientData['adresse'],
                    'user_id' => $user->id, // Associer le client à l'utilisateur authentifié
                ]);
                Log::info('Nouveau client créé:', $client->toArray());
            } catch (QueryException $e) {
                Log::error('Erreur lors de la création du client:', ['error' => $e->getMessage()]);
                if ($e->errorInfo[1] == 1062) { // Duplicate entry
                    return response()->json(['errors' => ['client.email' => ['L\'email est déjà utilisé.']]], 422);
                }
                // Autres erreurs
                return response()->json(['errors' => ['server' => ['Erreur serveur lors de la création du client.']]], 500);
            }
        } else {
            // Si le client existe, assurez-vous qu'il est associé à l'utilisateur authentifié
            $client->user_id = $user->id;
            $client->save();
        }

        // Créer le devis et l'associer au client
        try {
            $quote = Quote::create([
                'numero' => $numero,
                'date_emission' => $request->date_emission,
                'include_tva' => $request->include_tva,
                'logo_path' => $logoPath,
                'client_id' => $client->id,
                'statut' => 'Brouillon',
                'paiement' => $request->paiement,
                'commentaires' => $request->commentaires,
                'signature_path' => $signaturePath,
            ]);
            Log::info('Nouveau devis créé:', $quote->toArray());
        } catch (QueryException $e) {
            Log::error('Erreur lors de la création du devis:', ['error' => $e->getMessage()]);
            if ($e->errorInfo[1] == 1062) { // Duplicate entry
                return response()->json(['errors' => ['numero' => ['Le numéro de devis est déjà utilisé.']]], 422);
            }
            // Autres erreurs
            return response()->json(['errors' => ['server' => ['Erreur serveur lors de la création du devis.']]], 500);
        }

        return response()->json($quote, 201);
    }

    /**
     * Afficher un devis spécifique.
     */
    public function show(Quote $quote)
    {
        $quote->load(['client.user', 'items.product']);

        // Transformer les items pour s'assurer que 'prix' est un nombre
        $quote->items->transform(function($item) {
            $item->prix = (float) $item->prix;
            return $item;
        });

        return response()->json($quote, 200);
    }

    /**
     * Mettre à jour les informations des articles du devis.
     */
    public function updateItems(Request $request, Quote $quote)
    {
        // Log des données reçues
        Log::info('Données reçues pour la mise à jour des articles du devis:', $request->all());

        // Définir les règles de validation de base
        $rules = [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantite' => 'required|integer|min:1',
            'items.*.prix' => 'required|numeric|min:0',
        ];

        // Ajouter la validation de 'tva' seulement si 'include_tva' est vrai
        if ($quote->include_tva) {
            $rules['items.*.tva'] = 'required|integer|min:0|max:100';
        } else {
            $rules['items.*.tva'] = 'nullable|integer|min:0|max:100';
        }

        // Valider les données
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            Log::warning('Validation échouée pour la mise à jour des articles:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Supprimer les articles existants
        $quote->items()->delete();

        // Ajouter les nouveaux articles
        foreach ($validator->validated()['items'] as $itemData) {
            try {
                $item = $quote->items()->create([
                    'product_id' => $itemData['product_id'],
                    'quantite' => $itemData['quantite'],
                    'prix' => $itemData['prix'],
                    'tva' => $itemData['tva'] ?? null, // Gérer la possibilité que 'tva' soit nullable
                ]);
                Log::info('Item ajouté:', $item->toArray());
            } catch (QueryException $e) {
                Log::error('Erreur lors de l\'ajout de l\'item:', ['error' => $e->getMessage()]);
                return response()->json(['errors' => ['server' => ['Erreur serveur lors de l\'ajout de l\'item.']]], 500);
            }
        }

        return response()->json($quote->items, 200);
    }

    /**
     * Mettre à jour les conditions du devis.
     */
    public function updateConditions(Request $request, Quote $quote)
    {
        // Log des données reçues avec plus de détails
        Log::info('Données reçues pour la mise à jour des conditions du devis:', $request->all());

        // Valider les données des conditions
        $validator = Validator::make($request->all(), [
            'paiement' => 'required|string|max:255',
            'commentaires' => 'nullable|string',
            'signature' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            Log::warning('Validation échouée pour la mise à jour des conditions:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Gérer la signature si fournie
        if ($request->hasFile('signature')) {
            // Supprimer l'ancienne signature si existante
            if ($quote->signature_path) {
                Storage::disk('public')->delete($quote->signature_path);
            }
            $signaturePath = $request->file('signature')->store('signatures', 'public');
            $quote->signature_path = $signaturePath;
        }

        // Mettre à jour les autres champs
        $quote->paiement = $request->paiement;
        $quote->commentaires = $request->commentaires ?? $quote->commentaires;
        $quote->save();

        Log::info('Conditions du devis mises à jour:', $quote->toArray());

        return response()->json($quote, 200);
    }

    /**
     * Dupliquer un devis.
     */
    public function duplicate(Quote $quote)
    {
        // Commencer une transaction pour assurer l'intégrité des données
        DB::beginTransaction();

        try {
            // Dupliquer le devis
            $newQuote = $quote->replicate(['numero', 'created_at', 'updated_at']);
            $newQuote->numero = 'DEV-' . date('Y') . '-' . str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT);
            $newQuote->statut = 'Brouillon';
            $newQuote->save();

            // Dupliquer les items
            foreach ($quote->items as $item) {
                $newItem = $item->replicate(['created_at', 'updated_at']);
                $newItem->quote_id = $newQuote->id;
                $newItem->save();
            }

            DB::commit();

            Log::info('Devis dupliqué avec succès:', $newQuote->toArray());

            return response()->json(['message' => 'Devis dupliqué avec succès.', 'quote' => $newQuote], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la duplication du devis:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Erreur lors de la duplication du devis.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Valider un devis.
     */
    public function validateQuote(Quote $quote)
    {
        // Valider uniquement si le devis est en cours ou en brouillon
        if (!in_array($quote->statut, ['En cours', 'Brouillon'])) {
            return response()->json(['message' => 'Le devis ne peut pas être validé dans son état actuel.'], 400);
        }

        $quote->statut = 'Validé';
        $quote->save();

        Log::info('Devis validé avec succès:', $quote->toArray());

        return response()->json(['message' => 'Devis validé avec succès.', 'quote' => $quote], 200);
    }
}

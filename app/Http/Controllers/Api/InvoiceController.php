<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Client;
use App\Models\Product;
use App\Models\Quote;
use App\Models\Emetteur;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log; 
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Invoice::with('client', 'items.product', 'emetteur');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('numero', 'like', "%$search%")
                    ->orWhereHas('client', function ($cq) use ($search) {
                        $cq->where('entreprise', 'like', "%$search%");
                    });
            });
        }

        $invoices = $query->orderBy('created_at', 'desc')->get();

       
        $invoices->map(function ($invoice) {
            $invoice->logo_url = $invoice->logo_url ? asset('storage/' . $invoice->logo_url) : null;
            $invoice->signature_url = $invoice->signature_path ? asset('storage/' . $invoice->signature_path) : null;
            return $invoice;
        });

        return response()->json($invoices, 200);
    }

    public function duplicate(Invoice $invoice)
    {
        DB::beginTransaction();
        try {
            $newInvoice = $invoice->replicate(['numero', 'created_at', 'updated_at', 'public_token']);
            $newInvoice->numero = 'INV-' . date('Y') . '-' . str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT);
            $newInvoice->statut = 'Brouillon';
            $newInvoice->public_token = Str::random(30);
            $newInvoice->emetteur_id = $invoice->emetteur_id;
            $newInvoice->save();

            foreach ($invoice->items as $item) {
                $newItem = $item->replicate(['created_at', 'updated_at']);
                $newItem->invoice_id = $newInvoice->id;
                $newItem->save();
            }

            DB::commit();

          
            $newInvoice->logo_url = $newInvoice->logo_url ? asset('storage/' . $newInvoice->logo_url) : null;
            $newInvoice->signature_url = $newInvoice->signature_path ? asset('storage/' . $newInvoice->signature_path) : null;

            return response()->json($newInvoice, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in InvoiceController@duplicate: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la duplication de la facture. Contactez l\'administrateur.'], 500);
        }
    }

    public function validateInvoice(Invoice $invoice)
    {
        if ($invoice->statut !== 'Brouillon') {
            return response()->json(['error' => 'La facture n\'est pas en brouillon, impossible de valider'], 400);
        }
        $invoice->update(['statut' => 'Payée']);
        return response()->json(['message' => 'Facture validée'], 200);
    }

    public function store(Request $request)
    {
        // Log des données reçues pour le débogage
        Log::info('Données reçues pour la création de la facture:', $request->all());

        // Générer un numéro de facture unique si non fourni
        $numero = $request->input('numero', 'INV-' . date('Y') . '-' . str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT));

        // Valider les données générales, client et conditions
        $validator = Validator::make($request->all(), [
            'numero' => 'required|string|unique:invoices,numero',
            'date_emission' => 'required|date',
            'include_tva' => 'required|boolean',
            'logo' => 'nullable|image|max:2048',
            'client' => 'required|array',
            'client.entreprise' => 'required|string|max:255',
            'client.email' => 'required|email|max:255',
            'client.telephone' => 'required|string|max:20',
            'client.adresse' => 'required|string',
            'emetteur' => 'required|array',
            'emetteur.nom' => 'nullable|string|max:255',
            'emetteur.email' => 'nullable|email|max:255',
            'emetteur.telephone' => 'nullable|string|max:255',
            'emetteur.adresse' => 'nullable|string',
            // Conditions
            'paiement' => 'required|string|max:255',
            'commentaires' => 'nullable|string',
            'signature' => 'nullable|image|max:2048',
            'statut' => 'required|in:Brouillon,Envoyée,Payée,Partiellement Payée,Annulée',
            'due_date' => 'nullable|date',
            // 'items' peut être géré ici ou via une requête PATCH séparée
        ]);

        if ($validator->fails()) {
            Log::warning('Validation échouée pour la création de la facture:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

       
        $signaturePath = null;
        if ($request->hasFile('signature')) {
            $signaturePath = $request->file('signature')->store('signatures', 'public');
        }

        DB::beginTransaction();
        try {
            $emetteurData = $request->input('emetteur');
            $emetteur = Emetteur::firstOrCreate(
                ['email' => $emetteurData['email'] ?? null],
                [
                    'nom' => $emetteurData['nom'],
                    'adresse' => $emetteurData['adresse'],
                    'telephone' => $emetteurData['telephone'],
                ]
            );

            $clientData = $request->input('client');
            $client = Client::firstOrCreate(
                ['email' => $clientData['email']],
                [
                    'entreprise' => $clientData['entreprise'],
                    'nom' => $clientData['nom'] ?? $clientData['entreprise'],
                    'telephone' => $clientData['telephone'],
                    'adresse' => $clientData['adresse'],
                ]
            );

            $invoice = Invoice::create([
                'client_id' => $client->id,
                'emetteur_id' => $emetteur->id,
                'quote_id' => null,
                'numero' => $numero,
                'date_emission' => $request->date_emission,
                'include_tva' => $request->include_tva,
                'paiement' => $request->paiement,
                'commentaires' => $request->commentaires,
                'signature_path' => $signaturePath,
                'statut' => $request->statut,
                'public_token' => Str::random(30),
                'due_date' => $request->due_date,
                'logo_url' => $logoPath,
            ]);

            foreach ($request->input('items', []) as $itemData) {
                $productId = null;
                if (isset($itemData['is_new_product']) && $itemData['is_new_product'] == true) {
                    $newProduct = Product::create([
                        'name' => $itemData['new_product_name'] ?? $itemData['description'],
                        'description' => $itemData['new_product_description'],
                        'price_without_content' => null,
                        'price_with_content' => $itemData['new_product_price'] ?? $itemData['prix'],
                        'parent_id' => null,
                    ]);
                    $productId = $newProduct->id;
                } else {
                    $productId = $itemData['product_id'];
                }

                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'product_id' => $productId,
                    'description' => $itemData['description'],
                    'quantite' => $itemData['quantite'],
                    'prix' => $itemData['prix'],
                    'tva' => $itemData['tva'],
                ]);
            }

            DB::commit();

          
            $invoice->logo_url = $invoice->logo_url ? asset('storage/' . $invoice->logo_url) : null;
            $invoice->signature_url = $invoice->signature_path ? asset('storage/' . $invoice->signature_path) : null;

            return response()->json($invoice->load('items.product', 'emetteur'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in InvoiceController@store: ' . $e->getMessage());
            return response()->json(['error' => 'Une erreur est survenue lors de la sauvegarde de la facture. Contactez l\'administrateur.'], 500);
        }
    }

    public function show(Invoice $invoice)
    {
       
        $invoice->logo_url = $invoice->logo_url ? asset('storage/' . $invoice->logo_url) : null;
        $invoice->signature_url = $invoice->signature_path ? asset('storage/' . $invoice->signature_path) : null;

        return response()->json($invoice->load('client', 'items.product', 'emetteur'), 200);
    }

    public function update(Request $request, Invoice $invoice)
    {
        // Log des données reçues pour le débogage
        Log::info('Données reçues pour la mise à jour de la facture:', $request->all());

        // Valider les données générales, client et conditions
        $validator = Validator::make($request->all(), [
            'numero' => ['required', Rule::unique('invoices')->ignore($invoice->id)],
            'date_emission' => 'required|date',
            'include_tva' => 'required|boolean',
            'logo' => 'nullable|image|max:2048',
            'client' => 'required|array',
            'client.entreprise' => 'required|string|max:255',
            'client.email' => 'required|email|max:255',
            'client.telephone' => 'required|string|max:20',
            'client.adresse' => 'required|string',
            'emetteur' => 'required|array',
            'emetteur.nom' => 'nullable|string|max:255',
            'emetteur.email' => ['nullable', 'email', 'max:255', Rule::unique('emetteurs')->ignore($invoice->emetteur_id)],
            'emetteur.telephone' => 'nullable|string|max:255',
            'emetteur.adresse' => 'nullable|string',
            // Conditions
            'paiement' => 'required|string|max:255',
            'commentaires' => 'nullable|string',
            'signature' => 'nullable|image|max:2048',
            'statut' => 'required|in:Brouillon,Envoyée,Payée,Partiellement Payée,Annulée',
            'due_date' => 'nullable|date',
            // 'items' peut être géré ici ou via une requête PATCH séparée
        ]);

        if ($validator->fails()) {
            Log::warning('Validation échouée pour la mise à jour de la facture:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Gérer le logo si fourni
        $logoPath = $invoice->logo_url ? str_replace(asset('storage/') . '/', '', $invoice->logo_url) : null;
        if ($request->hasFile('logo')) {
            // Supprimer l'ancien logo si existant
            if ($logoPath) {
                Storage::disk('public')->delete($logoPath);
            }
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        
        $signaturePath = $invoice->signature_path;
        if ($request->hasFile('signature')) {
           
            if ($invoice->signature_path) {
                Storage::disk('public')->delete($invoice->signature_path);
            }
            $signaturePath = $request->file('signature')->store('signatures', 'public');
        }

        DB::beginTransaction();
        try {
            $emetteurData = $request->input('emetteur');
            if (isset($emetteurData['email'])) {
                $emetteur = Emetteur::updateOrCreate(
                    ['email' => $emetteurData['email']],
                    [
                        'nom' => $emetteurData['nom'],
                        'adresse' => $emetteurData['adresse'],
                        'telephone' => $emetteurData['telephone'],
                    ]
                );
                $invoice->emetteur_id = $emetteur->id;
            }

            $clientData = $request->input('client');
            $client = Client::firstOrCreate(
                ['email' => $clientData['email']],
                [
                    'entreprise' => $clientData['entreprise'],
                    'nom' => $clientData['nom'] ?? $clientData['entreprise'],
                    'telephone' => $clientData['telephone'],
                    'adresse' => $clientData['adresse'],
                ]
            );

            $invoice->update([
                'client_id' => $client->id,
                'numero' => $request->numero,
                'date_emission' => $request->date_emission,
                'include_tva' => $request->include_tva,
                'paiement' => $request->paiement,
                'commentaires' => $request->commentaires,
                'statut' => $request->statut,
                'due_date' => $request->due_date,
                'logo_url' => $logoPath,
                'signature_path' => $signaturePath,
            ]);

            $invoice->items()->delete();
            foreach ($request->input('items', []) as $itemData) {
                $productId = null;
                if (isset($itemData['is_new_product']) && $itemData['is_new_product'] == true) {
                    $newProduct = Product::create([
                        'name' => $itemData['new_product_name'] ?? $itemData['description'],
                        'description' => $itemData['new_product_description'],
                        'price_without_content' => null,
                        'price_with_content' => $itemData['new_product_price'] ?? $itemData['prix'],
                        'parent_id' => null,
                    ]);
                    $productId = $newProduct->id;
                } else {
                    $productId = $itemData['product_id'];
                }

                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'product_id' => $productId,
                    'description' => $itemData['description'],
                    'quantite' => $itemData['quantite'],
                    'prix' => $itemData['prix'],
                    'tva' => $itemData['tva'],
                ]);
            }

            DB::commit();

            // Ajouter des URLs complètes pour le logo et la signature
            $invoice->logo_url = $invoice->logo_url ? asset('storage/' . $invoice->logo_url) : null;
            $invoice->signature_url = $invoice->signature_path ? asset('storage/' . $invoice->signature_path) : null;

            return response()->json($invoice->load('items.product', 'emetteur'), 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in InvoiceController@update: ' . $e->getMessage());
            return response()->json(['error' => 'Une erreur est survenue lors de la mise à jour de la facture. Contactez l\'administrateur.'], 500);
        }
    }

    public function convertQuoteToInvoice(Quote $quote)
    {
        DB::beginTransaction();
        try {
            $invoice = Invoice::create([
                'client_id' => $quote->client_id,
                'quote_id' => $quote->id,
                'emetteur_id' => $quote->emetteur_id,
                'numero' => 'INV-' . date('Y') . '-' . str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT),
                'date_emission' => now()->toDateString(),
                'include_tva' => $quote->include_tva,
                'paiement' => $quote->paiement,
                'commentaires' => $quote->commentaires,
                'signature_path' => $quote->signature_path,
                'statut' => 'Brouillon',
                'public_token' => Str::random(30),
                'due_date' => null,
                'logo_url' => $quote->logo_path,
            ]);

            foreach ($quote->items as $item) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'product_id' => $item->product_id,
                    'description' => $item->product ? $item->product->name : $item->description,
                    'quantite' => $item->quantite,
                    'prix' => $item->prix,
                    'tva' => $item->tva,
                ]);
            }

            DB::commit();

            $invoice->logo_url = $invoice->logo_url ? asset('storage/' . $invoice->logo_url) : null;
            $invoice->signature_url = $invoice->signature_path ? asset('storage/' . $invoice->signature_path) : null;

            return response()->json($invoice->load('items.product', 'emetteur'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in InvoiceController@convertQuoteToInvoice: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la conversion du devis en facture. Contactez l\'administrateur.'], 500);
        }
    }
}

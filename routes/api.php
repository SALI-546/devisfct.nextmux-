<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\QuoteController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\InvoiceController;
use App\Http\Controllers\API\WebProjectController;




/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// Routes pour les devis, sans middleware d'authentification
Route::prefix('quotes')->group(function () {
    Route::get('/', [QuoteController::class, 'index']); // Récupérer tous les devis avec possibilité de recherche
    Route::post('/', [QuoteController::class, 'store']); // Créer un nouveau devis
    Route::get('/{quote}', [QuoteController::class, 'show']); // Afficher un devis spécifique
    Route::patch('/{quote}/conditions', [QuoteController::class, 'updateConditions']); // Mettre à jour les conditions du devis
    Route::patch('/{quote}/items', [QuoteController::class, 'updateItems']); // Mettre à jour les articles du devis
    Route::post('/{quote}/duplicate', [QuoteController::class, 'duplicate']); // Dupliquer un devis
    Route::put('/{quote}/validate', [QuoteController::class, 'validateQuote']); // Valider un devis
    Route::put('/quotes/{quote}', [QuoteController::class, 'update']);
    Route::delete('/quotes/{quote}', [QuoteController::class, 'destroy']);
    Route::get('/quotes/check-numero', [QuoteController::class, 'checkNumero']);
});

// Route pour les utilisateurs
Route::get('/users', [UserController::class, 'index']);

// Route pour récupérer tous les produits
Route::get('/products', [ProductController::class, 'index'])->name('api.products.index');



// Routes pour les factures
Route::prefix('invoices')->group(function () {
    Route::get('/', [InvoiceController::class, 'index']); // Lister les factures avec option de recherche (paramètre ?search=)
    Route::post('/', [InvoiceController::class, 'store']); // Créer une nouvelle facture
    Route::get('/{invoice}', [InvoiceController::class, 'show']); // Afficher une facture
    Route::put('/{invoice}', [InvoiceController::class, 'update']); // Mettre à jour une facture existante
    Route::post('/convert/{quote}', [InvoiceController::class, 'convertQuoteToInvoice']); // Convertir un devis en facture
    Route::post('/{invoice}/duplicate', [InvoiceController::class, 'duplicate']); // Dupliquer une facture
    Route::post('/{invoice}/validate', [InvoiceController::class, 'validateInvoice']); // Valider une facture

    // Ajout des routes pour la mise à jour et la suppression
    Route::put('/quotes/{quote}', [QuoteController::class, 'update']);
    Route::delete('/quotes/{quote}', [QuoteController::class, 'destroy']);
});


Route::get('/projects', [WebProjectController::class, 'index']);
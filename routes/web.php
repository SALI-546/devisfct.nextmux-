<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DevisController;
use App\Http\Controllers\NewdevisController;
use App\Http\Controllers\FactureController;
use App\Http\Controllers\NewfactController;
use App\Http\Controllers\ProjetController;





// Redirection par défaut
Route::get('/', function () {
    return redirect()->route('dashboard');
});

// Dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');




// Devis
Route::get('/devis', [DevisController::class, 'index'])->name('devis.index');

// Nouveau Devis
Route::get('/devis/nouveau', [NewdevisController::class, 'index'])->name('new-devis.index');

// Factures
Route::get('/factures', [FactureController::class, 'index'])->name('factures.index');

// Nouvelle Facture
Route::get('/factures/nouveau', [NewfactController::class, 'index'])->name('new-fact.index');




// Projets
Route::get('/projets', [ProjetController::class, 'index'])->name('projets.index');


// Route pour la vue "Visualiser Devis"
Route::get('/devis/{id}', function ($id) {
    return view('devis.view');
})->where('id', '[0-9]+'); // Assurez-vous que l'ID est numérique ou ajustez le regex selon vos besoins

// Route pour visualiser une facture
Route::get('/facture/{id}', function ($id) {
    return view('factures.view', ['invoiceId' => $id]);
})->where('id', '[0-9]+');



// web.php
Route::get('/facture/{id}/edit', function($id) {
    return view('factures.edit', ['invoiceId' => $id]);
})->name('invoices.edit')->where('id', '[0-9]+');


// Fallback route - toute route non définie ci-dessus renvoie l'app React
Route::get('/{any}', function () {
    return view('app'); // Vue qui contient <div id="root"></div> par exemple
})->where('any', '.*');






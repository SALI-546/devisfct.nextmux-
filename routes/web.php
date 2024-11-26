<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CRMController;
use App\Http\Controllers\DevisController;
use App\Http\Controllers\NewdevisController;
use App\Http\Controllers\FactureController;
use App\Http\Controllers\NewfactController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ProjetController;
use App\Http\Controllers\CoursController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ParametresController;
use App\Http\Controllers\ProfilController;


// Redirection par défaut
Route::get('/', function () {
    return redirect()->route('dashboard');
});

// Dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// CRM
Route::get('/crm/clients', [CRMController::class, 'clients'])->name('crm.clients');

// Devis
Route::get('/devis', [DevisController::class, 'index'])->name('devis.index');

// Nouveau Devis
Route::get('/devis/nouveau', [NewdevisController::class, 'index'])->name('new-devis.index');

// Factures
Route::get('/factures', [FactureController::class, 'index'])->name('factures.index');

// Nouvelle Facture
Route::get('/factures/nouveau', [NewfactController::class, 'index'])->name('new-fact.index');

// Services
Route::get('/services', [ServiceController::class, 'index'])->name('services.index');

// Projets
Route::get('/projets', [ProjetController::class, 'index'])->name('projets.index');

// Formation
Route::get('/formation/cours', [CoursController::class, 'index'])->name('formation.cours');

// Paramètres

Route::get('/parametres/utilisateurs', [UserController::class, 'index'])->name('parametres.utilisateurs');
Route::get('/parametres/config', [ParametresController::class, 'index'])->name('parametres.config');

// Profil
Route::get('/profil/edit', [ProfilController::class, 'edit'])->name('profil.edit');
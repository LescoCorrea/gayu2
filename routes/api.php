<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\ArtisanController;
use App\Http\Controllers\AvisController;
use App\Http\Controllers\FavorisController;
use App\Http\Controllers\MetiersController;
use App\Http\Controllers\RegionsController;
use App\Http\Controllers\RealisationController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\CommentaireController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TemoignageController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::get('/users', [AuthController::class, 'allUser']);
/*------------ ROLE API -----------------------------*/
Route::post('/roles', [RolesController::class, 'store']);
Route::get('/roles', [RolesController::class, 'index']);
Route::get('/roles/{id}', [RolesController::class, 'show']);
Route::put('roles/{id}', [RolesController::class, 'update']);
Route::delete('/roles/{id}', [RolesController::class, 'destroy']);
/*------------ FIN API ROLE --------------------------*/
/*------------ METIER API -----------------------------*/
Route::post('/metiers', [MetiersController::class, 'store']);
Route::get('/metiers', [MetiersController::class, 'index']);
Route::get('/metiers/{id}', [MetiersController::class, 'show']);
Route::put('/metiers/{id}', [MetiersController::class, 'update']);
Route::delete('/metiers/{id}', [MetiersController::class, 'destroy']);
/*------------ FIN API ROLE --------------------------*/
/*------------ METIER API -----------------------------*/
Route::post('/regions', [RegionsController::class, 'store']);
Route::get('/regions', [RegionsController::class, 'index']);
Route::get('/regions/{id}', [RegionsController::class, 'show']);
Route::put('/regions/{id}', [RegionsController::class, 'update']);
Route::delete('/regions/{id}', [RegionsController::class, 'destroy']);
/*------------ FIN ARTISANS ROLE --------------------------*/
Route::resource('artisans', ArtisanController::class);
Route::put('/artisans/{id}/', [ArtisanController::class, 'update'])->name('artisans.update');
Route::post('/artisans/{id}/assign', [ArtisanController::class, 'assign']);
Route::get('/artisans/{id}', [ArtisanController::class, 'show']);
Route::patch('/artisans/access/{id}', [ArtisanController::class, 'updateAccess']);
Route::get('/artisans/access/{id}', [ArtisanController::class, 'getAccess']);

/*------------ FIN API ROLE --------------------------*/
Route::get('/temoignages', [TemoignageController::class, 'index'])->name('temoignages.index');
Route::post('/temoignages', [TemoignageController::class, 'store'])->name('temoignages.store');
Route::get('/temoignages/{id}', [TemoignageController::class, 'show'])->name('temoignages.show');
Route::get('/temoignages/{id}/edit', [TemoignageController::class, 'edit'])->name('temoignages.edit');
Route::put('/temoignages/{id}', [TemoignageController::class, 'update'])->name('temoignages.update');
Route::delete('/temoignages/{id}', [TemoignageController::class, 'destroy'])->name('temoignages.destroy');

/*------- CONTACT ---------*/

Route::post('/contact', [ContactController::class, 'send']);

Route::get('/artisans/{id}/rating-count', [ArtisanController::class, 'getNoteCount']);

/*------------ API REALISATION ----------------------*/
//Route::resource('/realisations', RealisationController::class);


Route::middleware(['auth:sanctum', 'artisan'])->group(function () {
    Route::put('/artisan/status', [ArtisanController::class, 'updateStatus']);
    Route::get('artisan/profil', [ArtisanController::class, 'profil']);
    Route::put('/artisan/profile', [ArtisanController::class, 'updateProfil']);
    Route::put('/artisan/image', [ArtisanController::class, 'updateImage']);
    Route::get('/realisations', [RealisationController::class, 'index']);
    Route::post('/realisations', [RealisationController::class, 'store']);
    Route::get('/realisations/{id}', [RealisationController::class, 'show']);
    Route::put('/realisations/{id}', [RealisationController::class, 'update'])->name('realisations.update');
    Route::delete('/realisations/{id}', [RealisationController::class, 'destroy']);
    Route::get('/artisan/notifications', [NotificationController::class, 'getArtisanNotifications']);
    Route::put('/reservations/{id}/status', [ReservationController::class, 'updateStatus'])->name('reservations.updateStatus');
});

/*Route::get('/realisations/{id}/likes', [RealisationController::class, 'getLikeCount'])
    ->name('realisations.likes');

/*----------- API CLIENTS(USERS) ----------------------*/
Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    //Route::put('/realisations/{id}', [RealisationController::class, 'update']);

    Route::get('/favoris', [FavorisController::class, 'index']);
    Route::get('/favoris/{artisan_id}/exists', [FavorisController::class, 'favorisExist']);
    Route::post('/favoris/{id}', [FavorisController::class, 'addFavoris']);
    Route::get('/archives', [FavorisController::class, 'archives']);
    Route::post('/favoris/{artisan_id}/archive', [FavorisController::class, 'archiveFavoris']);
    Route::put('/favoris/{artisan_id}/desarchiver', [FavorisController::class, 'desarchiverFavoris']);
    Route::delete('/favoris/{id}', [FavorisController::class, 'removeFavoris']);
    route::get('/favoris/{artisan_id}/favoris', [FavorisController::class, 'isFavorite']);
    /*---------- FIN API FAVORIS ---------------*/

    /*------- Reservation  ----*/
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::get('/reservations-artisan', [ReservationController::class, 'indexArtisan']);
    //Route::post('/reservations', [ReservationController::class, 'store']);
    Route::post('/reservations/{id}', [ReservationController::class, 'store']);
    Route::put('/reservations/{id}', [ReservationController::class, 'update']);
    Route::put('/reservations/{id}', [ReservationController::class, 'updateReservation']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);
    /*------- FIN ----------*/

    /*-------- AVIS -----------*/
    Route::get('/avis', [AvisController::class, 'index']);
    Route::post('/avis/{id}', [AvisController::class, 'store']);
    Route::post('/rate/{id}', [ArtisanController::class, 'storeNote']);
    //Route::get('/artisans/{id}/rating-count', [ArtisanController::class, 'getNoteCount']);
    /*------- FIN ------------*/

    /*----- COMMENTAIRE -------*/
    Route::post('/realisations/commentaire/{realisationId}', [CommentaireController::class, 'store']);
    Route::delete('/commentaire/{id}', [CommentaireController::class, 'destroy']);
    Route::get('/commentaires', [CommentaireController::class, 'getIndex']);
    /*-------- FIN -----------*/

    /*------ LIKE ------------*/
    Route::post('commentaires/{id}/like', [CommentaireController::class, 'likeComment']);
    Route::delete('commentaires/{id}/unlike', [CommentaireController::class, 'unlikeComment']);
    Route::get('commentaires/{id}/like/count', [CommentaireController::class, 'getLikesCount']);
    /*-------- FIN  -----------*/

    /*------ NOTIFICATION ------*/
    Route::get('/user/notifications', [NotificationController::class, 'getUserNotifications']);

    /*---- LIKE REALISATION ----*/
    Route::post('/realisations/{id}/like', [RealisationController::class, 'like'])
    ->name('realisations.like');
    Route::delete('/realisations/{id}/like', [RealisationController::class, 'like'])
    ->name('realisations.like');
    Route::get('/realisations/{id}/aime', [RealisationController::class, 'getLikeCount'])
    ->name('realisations.likes');

    /*----- PROFIL USER --------*/
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::get('/user/profil', [AuthController::class, 'getUserDetails']);
});

<?php

namespace App\Http\Controllers;

use App\Models\Favoris;
use App\Models\Artisan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class FavorisController extends Controller
{

    /*public function index()
    {
        $user = Auth::user();
        $favoris = $user->favoris()->with(['artisan', 'artisan.metiers', 'artisan.regions'])->get();
        return response()->json($favoris);
    }*/

    public function index()
    {
        $user = Auth::user();
        // Exclure les favoris archivés de la liste retournée
        $favoris = $user->favoris()->whereNull('archived_at')->with(['artisan', 'artisan.metiers', 'artisan.regions'])->get();
        return response()->json($favoris);
    }

    public function favorisExist($artisan_id)
    {
        $user = Auth::user();

        // Vérifier si l'artisan est déjà dans les favoris de l'utilisateur.
        $favoris = $user->favoris()->where('artisan_id', $artisan_id)->exists();

        return response()->json(['favori_existe' => $favoris]);
    }

    public function addFavoris($artisanId)
    {
        $user = Auth::user();

        // Vérifier si l'artisan existe
        $artisan = Artisan::findOrFail($artisanId);

        // Vérifier si l'artisan est déjà dans les favoris de l'utilisateur
        if ($user->artisansFavoris()->where('artisan_id', $artisanId)->exists()) {
            return response()->json(['message' => 'L\'artisan est déjà dans les favoris'], 400);
        }

        // Ajouter l'artisan aux favoris de l'utilisateur
        $favoris = new Favoris();
        $favoris->user_id = $user->id;
        $favoris->artisan_id = $artisanId;
        $favoris->save();

        return response()->json(['message' => 'Artisan ajouté aux favoris']);
    }

    public function archives()
    {
        $user = Auth::user();
        $archives = $user->favoris()->with(['artisan', 'artisan.metiers', 'artisan.regions'])
            ->whereNotNull('archived_at')
            ->get();
        return response()->json($archives);
    }

    public function archiveFavoris($artisan_id)
    {
        $user = Auth::user();

        // Vérifier si l'artisan est dans les favoris de l'utilisateur
        $favoris = $user->favoris()->where('artisan_id', $artisan_id)->first();

        if (!$favoris) {
            return response()->json(['message' => 'L\'artisan n\'est pas dans les favoris'], 400);
        }

        // Archiver le favori
        $favoris->archived_at = now();
        $favoris->save();

        return response()->json(['message' => 'Artisan archivé des favoris']);
    }

    public function desarchiverFavoris($artisan_id)
    {
        $user = Auth::user();

        // Vérifier si l'artisan est dans les favoris archivés de l'utilisateur
        $favoris = $user->favoris()->where('artisan_id', $artisan_id)->whereNotNull('archived_at')->first();

        if (!$favoris) {
            return response()->json(['message' => 'L\'artisan n\'est pas dans les favoris archivés'], 400);
        }

        // Désarchiver le favori
        $favoris->archived_at = null;
        $favoris->save();

        return response()->json(['message' => 'Artisan désarchivé des favoris']);
    }

    public function removeFavoris($artisanId)
    {
        $user = Auth::user();

        // Vérifier si l'artisan est dans les favoris de l'utilisateur
        $favoris = $user->favoris()->where('artisan_id', $artisanId)->first();

        if (!$favoris) {
            return response()->json(['message' => 'L\'artisan n\'est pas dans les favoris'], 400);
        }

        // Supprimer l'artisan des favoris de l'utilisateur
        $favoris->delete();

        return response()->json(['message' => 'Artisan supprimé des favoris']);
    }
}

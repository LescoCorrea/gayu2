<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;
use App\Models\Artisan;
use App\Models\Roles;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class ArtisanController extends Controller
{
    public function index()
    {
        /*$artisans = Artisan::all();
        return response()->json(['status' => 200, 'artisans' => $artisans,]);*/

        $artisans = Artisan::with('metiers', 'regions')->orderByDesc('created_at')->get();
        return response()->json(['status' => 200, 'artisans' => $artisans]);
    }

    public function profil()
    {
        try {
            $artisan = Auth::guard('sanctum')->user();

            if (!$artisan) {
                return response()->json(['error' => 'Aucun artisan trouvé.'], 404);
            }

            // Charger les détails de l'artisan actuellement connecté
            $artisanDetails = Artisan::with('metiers', 'regions')
                ->where('id', $artisan->id)
                ->first();

            if (!$artisanDetails) {
                return response()->json(['error' => 'Détails de l\'artisan non trouvés.'], 404);
            }

            return response()->json(['status' => 200, 'artisan' => $artisanDetails->makeVisible('password')]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des détails de l\'artisan', ['exception' => $e]);
            return response()->json(['error' => 'Une erreur s\'est produite lors de la récupération des détails de l\'artisan'], 500);
        }
    }

    public function store(Request $request)
    {
        // Validez les données du formulaire ici si nécessaire
        $validatedData = $request->validate([
            'prenom' => 'required|string',
            'nom' => 'required|string',
            'email' => 'required|email|unique:artisans,email',
            'password' => 'required|string',
            'téléphone' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'atélier' => 'required|string',
            'addréss' => 'required|string',
            'region' => 'required|exists:regions,id',
            'metier' => 'required|exists:metiers,id',
        ]);

        $hashedPassword = Hash::make($validatedData['password']);

        $imageName = Str::random() . '.' . $request->file('image')->getClientOriginalExtension();
        $imagePath = $request->file('image')->storeAs('artisans', $imageName, 'public');

        $artisan = new Artisan([
            'prenom' => $validatedData['prenom'],
            'nom' => $validatedData['nom'],
            'email' => $validatedData['email'],
            'password' => $hashedPassword,
            'téléphone' => $validatedData['téléphone'],
            'image' => $imagePath,
            'atélier' => $validatedData['atélier'],
            'addréss' => $validatedData['addréss'],

        ]);


        $artisan->save();

        // Attachez le lieu (region) à l'artisan
        $artisan->regions()->attach($validatedData['region']);

        // Attachez le métier à l'artisan
        $artisan->metiers()->attach($validatedData['metier']);

        return response()->json([
            'message' => 'Artisan créé avec succès',
            'artisan' => $artisan
        ], 201);
    }

    public function update(Request $request, $id)
    {
        // Log des données de la requête et ID
        //Log::info('Updating artisan with ID:', ['id' => $id]);
        //Log::info('Request data:', $request->all());

        $artisan = Artisan::findOrFail($id);

        // Validation avec l'ID de l'artisan actuel
        $validatedData = $request->validate([
            'prenom' => 'required|string',
            'nom' => 'required|string',
            'email' => 'required|email|unique:artisans,email,' . $id,
            'password' => 'nullable|string',
            'téléphone' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'atélier' => 'required|string',
            'addréss' => 'required|string',
            'region' => 'required|exists:regions,id',
            'metier' => 'required|exists:metiers,id',
        ]);

        // Mise à jour des données de l'artisan
        $artisan->prenom = $validatedData['prenom'];
        $artisan->nom = $validatedData['nom'];
        $artisan->email = $validatedData['email'];
        if ($request->filled('password')) {
            $artisan->password = Hash::make($validatedData['password']);
        }
        $artisan->téléphone = $validatedData['téléphone'];
        $artisan->atélier = $validatedData['atélier'];
        $artisan->addréss = $validatedData['addréss'];


        if ($request->hasFile('image')) {
            if ($artisan->image) {
                Storage::disk('public')->delete($artisan->image);
            }
            $imageName = Str::random() . '.' . $request->file('image')->getClientOriginalExtension();
            $imagePath = $request->file('image')->storeAs('artisans', $imageName, 'public');
            $artisan->image = $imagePath;
        }

        $artisan->save();
        // Mise à jour des relations
        $artisan->regions()->sync($validatedData['region']);
        $artisan->metiers()->sync($validatedData['metier']);

        $artisan = Artisan::with('regions', 'metiers')->findOrFail($id);

        return response()->json([
            'message' => 'Artisan mis à jour avec succès',
            'artisan' => $artisan
        ], 200);
    }

    public function updateAccess(Request $request, $id)
    {
        try {

            // Valider les données de la requête
            $validatedData = $request->validate([
                'access' => 'required|string|in:actif,inactif',
            ]);

            // Rechercher l'artisan par son identifiant
            $artisan = Artisan::findOrFail($id);

            // Mettre à jour la colonne 'access' de l'artisan
            $artisan->access = $validatedData['access'];
            $artisan->save(); // Utilisez save() au lieu de update()

            // Rechercher à nouveau l'artisan après mise à jour
            $artisan = Artisan::findOrFail($id);

            return response()->json(['message' => 'Accès mis à jour avec succès.', 'artisan' => $artisan], 200);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour de l\'accès de l\'artisan', ['exception' => $e]);
            return response()->json(['error' => 'Une erreur s\'est produite lors de la mise à jour de l\'accès de l\'artisan'], 500);
        }
    }

    public function getAccess($id)
    {
        try {
            // Rechercher l'artisan par son identifiant
            $artisan = Artisan::findOrFail($id);

            // Renvoyer l'état d'accès de l'artisan
            return response()->json([
                'status' => 200,
                'access' => $artisan->access,
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération de l\'accès de l\'artisan', ['exception' => $e]);
            return response()->json([
                'error' => 'Une erreur s\'est produite lors de la récupération de l\'accès de l\'artisan',
            ], 500);
        }
    }

    public function updateProfil(Request $request)
    {
        $artisan = Auth::guard('sanctum')->user();

        // Validation des données
        $validator = Validator::make($request->all(), [
            'prenom' => 'sometimes|required|string|max:255',
            'nom' => 'sometimes|required|string|max:255',
            'téléphone' => 'sometimes|required|string|max:15',
            'email' => 'sometimes|required|string|email|max:255|unique:artisans,email,' . $artisan->id,
            'password' => 'sometimes|nullable|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->has('prenom')) {
            $artisan->prenom = $request->prenom;
        }

        if ($request->has('nom')) {
            $artisan->nom = $request->nom;
        }

        if ($request->has('email')) {
            $artisan->email = $request->email;
        }

        if ($request->has('téléphone')) {
            $artisan->téléphone = $request->téléphone;
        }

        if ($request->filled('password')) {
            $artisan->password = Hash::make($request->input('password'));
        }

        $artisan->save();

        return response()->json([
            'status' => 200,
            'message' => 'Profil mis à jour avec succès.',
        ], 200);
    }

    public function updateImage(Request $request)
    {
        // Récupérer l'utilisateur authentifié (artisan)
        $artisan = Auth::guard('sanctum')->user();

        //Log::info('Request data:', $request->all());
        $validator = $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Suppression de l'ancienne image si elle existe
        if ($request->hasFile('image')) {
            if ($artisan->image) {
                Storage::disk('public')->delete($artisan->image);
            }
            $imageName = Str::random() . '.' . $request->file('image')->getClientOriginalExtension();
            $imagePath = $request->file('image')->storeAs('artisans', $imageName, 'public');
            $artisan->image = $imagePath;
        }
        $artisan->save();

        return response()->json([
            'status' => 200,
            'message' => 'Image mise à jour avec succès.',
        ], 200);
    }

    public function show($id)
    {
        try {
            $artisan = Artisan::with(['metiers', 'regions', 'roles', 'details', 'realisations.images'])->findOrFail($id);
            return response()->json(['status' => 200, 'artisan' => $artisan]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des détails de l\'artisan', ['exception' => $e]);
            return response()->json(['error' => 'Une erreur s\'est produite lors de la récupération des détails de l\'artisan'], 500);
        }
    }

    public function storeNote(Request $request)
    {
        // Validation des données reçues
        $validatedData = $request->validate([
            'artisan_id' => 'required|exists:artisans,id',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        // Récupération de l'utilisateur authentifié
        $user = Auth::user();

        // Vérification si l'utilisateur est authentifié
        if (!$user) {
            return response()->json(['error' => 'Non Authentifié !!.'], 401);
        }

        // Vérification si l'utilisateur n'est pas un artisan
        if ($user instanceof \App\Models\Artisan) {
            return response()->json(['error' => 'Les artisans ne peuvent pas se noter eux-mêmes.'], 403);
        }

        // Recherche de l'artisan basé sur l'ID fourni
        $artisan = Artisan::findOrFail($validatedData['artisan_id']);

        // Enregistrement de la note
        Rating::create([
            'artisan_id' => $artisan->id,
            'user_id' => $user->id,
            'rating' => $validatedData['rating'],
        ]);

        // Mise à jour de la note moyenne de l'artisan
        $artisan->update([
            'rating' => $artisan->averageRating(),
        ]);

        // Réponse JSON pour confirmer l'enregistrement
        return response()->json(['message' => 'Note enregistrée avec succès'], 201);
    }

    public function getNoteCount($artisanId)
    {
        // Comptage du nombre de notes pour cet artisan
        $noteCount = Rating::where('artisan_id', $artisanId)->count();

        // Réponse JSON avec le nombre de notes
        return response()->json(['note_count' => $noteCount], 200);
    }

    public function assign(Request $request, $id): JsonResponse
    {
        $artisan = Artisan::find($id);

        if (!$artisan) {
            return response()->json(['message' => 'Artisan non trouvé.'], 404);
        }

        $validationRules = [
            'roleId' => 'required|exists:roles,id',
            'description' => 'required|string',
            'conseil' => 'required|string',
        ];

        $request->validate($validationRules);

        try {
            // Attachez le rôle à l'artisan
            $artisan->roles()->sync([$request->roleId]);

            // Mettez à jour la description et le conseil de l'artisan
            $artisan->details()->create([
                'description' => $request->input('description'),
                'conseil' => $request->input('conseil'),
            ]);

            return response()->json(['message' => 'Rôle, description et conseil attribués avec succès']);
        } catch (\Exception $e) {
            // Gérez les erreurs si nécessaire
            return response()->json(['error' => 'Une erreur s\'est produite lors de l\'attribution du rôle, de la description et du conseil'], 500);
        }
    }

    public function updateStatus(Request $request)
    {
        $request->validate([
            'status' => 'required|string|in:disponible,occupé',
        ]);

        // Récupérer l'artisan connecté
        $artisan = Auth::guard('sanctum')->user();

        // Mettre à jour le statut
        $artisan->status = $request->input('status');
        $artisan->save();

        return response()->json([
            'message' => 'Statut mis à jour avec succès!',
            'artisan' => $artisan,
        ]);
    }

    public function destroy($id)
    {
        try {
            // Recherchez l'artisan par son identifiant
            $artisan = Artisan::findOrFail($id);

            // Supprimez les rôles associés à cet artisan dans la table de jointure artisan_role
            $artisan->roles()->detach();

            // Supprimez toutes les réalisations associées à cet artisan
            $artisan->realisations()->each(function ($realisation) {
                // Supprimez toutes les images de réalisation associées à chaque réalisation
                $realisation->images()->delete();

                $realisation->comments()->delete();
                // Supprimez la réalisation elle-même
                $realisation->delete();
            });

            // Supprimez l'image du stockage
            Storage::delete($artisan->image);

            // Détachez les relations avec la région et le métier
            $artisan->regions()->detach();
            $artisan->metiers()->detach();

            // Supprimez toutes les réservations associées à cet artisan
            $artisan->reservations()->delete();

            // Supprimez l'artisan de la base de données
            $artisan->delete();

            //Log::info('Artisan supprimé avec succès', ['artisan_id' => $id]);
            return response()->json(['message' => 'Artisan supprimé avec succès']);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression de l\'artisan', ['exception' => $e]);
            return response()->json(['error' => 'Une erreur s\'est produite lors de la suppression de l\'artisan'], 500);
        }
    }
}

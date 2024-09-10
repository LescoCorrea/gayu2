<?php

namespace App\Http\Controllers;

use App\Models\Artisan;
use App\Models\User;
use App\Models\Realisation;
use App\Models\Aime;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\RealisationImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class RealisationController extends Controller
{


    public function index()
    {
        try {
            $artisan = Auth::guard('sanctum')->user();

            if (!$artisan) {
                return response()->json(['error' => 'Non authentifié.'], 401);
            }
            $realisations = $artisan->realisations()->with('images')->get();

            foreach ($realisations as $realisation) {
                //Log::info('Realisation ID: ' . $realisation->id, ['images' => $realisation->images->toArray()]);
            }

            return response()->json([
                'status' => 200,
                'realisations' => $realisations,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des réalisations', 'message' => $e->getMessage()], 500);
        }
    }

    public function showArtisanRealisations($artisanId)
    {
        try {
            // Récupérer les réalisations spécifiques de l'artisan
            $realisations = Realisation::where('artisan_id', $artisanId)->with(['artisan', 'images'])->get();

            return response()->json(['realisations' => $realisations], 200);
        } catch (\Exception $e) {
            // En cas d'erreur, renvoyer une réponse d'erreur
            return response()->json(['error' => 'Erreur lors de la récupération des réalisations', 'message' => $e->getMessage()], 500);
        }
    }

    /*public function store(Request $request)
    {
        // Validation des données
        $validatedData = $request->validate([
            'titre' => 'required|string',
            'prix' => 'required|numeric',
            'status' => 'required|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('images') && count($request->file('images')) > 5) {
            return response()->json(['error' => 'Vous ne pouvez télécharger que jusqu\'à 5 images.'], 422);
        }

        try {
            // Récupérer l'artisan authentifié !!
            $artisan = Auth::user();

            // Créer la réalisation associée à l'artisan
            $realisation = $artisan->realisations()->create($validatedData);

            // Sauvegarder les images associées à la réalisation
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imageName = Str::random() . '.' . $image->getClientOriginalExtension();
                    $image->storeAs('realisation', $imageName, 'public');

                    // Créer une entrée dans la table realisation_images
                    $realisation->images()->create(['image' => $imageName]);
                }
            }

            return response()->json(['message' => 'Réalisation créée avec succès', 'realisation' => $realisation], 201);
        } catch (\Exception $e) {
            // En cas d'erreur, renvoyer une réponse d'erreur
            return response()->json(['error' => 'Erreur lors de la création de la réalisation', 'message' => $e->getMessage()], 500);
        }
    }*/

    public function store(Request $request)
    {
        // Validation des données
        $validatedData = $request->validate([
            'titre' => 'required|string',
            'prix' => 'required|numeric',
            'status' => 'required|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('images') && count($request->file('images')) > 5) {
            return response()->json(['error' => 'Vous ne pouvez télécharger que jusqu\'à 5 images.'], 422);
        }

        try {
            // Récupérer l'artisan authentifié en utilisant le garde approprié
            $artisan = Auth::guard('sanctum')->user();

            if (!$artisan) {
                return response()->json(['error' => 'Non authentifié.'], 401);
            }

            // Créer la réalisation associée à l'artisan
            $realisation = $artisan->realisations()->create($validatedData);

            // Sauvegarder les images associées à la réalisation
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imageName = Str::random() . '.' . $image->getClientOriginalExtension();
                    $image->storeAs('realisation', $imageName, 'public');

                    // Créer une entrée dans la table realisation_images
                    $realisation->images()->create(['image' => $imageName]);
                }
            }

            return response()->json(['message' => 'Réalisation créée avec succès.', 'realisation' => $realisation], 201);
        } catch (\Exception $e) {
            // En cas d'erreur, renvoyer une réponse d'erreur
            return response()->json(['error' => 'Erreur lors de la création de la réalisation.', 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $realisation = Realisation::with('images')->find($id);

        if ($realisation) {
            return response()->json([
                'status' => 200,
                'data' => $realisation,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Réalisation non trouvée.',
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        // Validation des données
        $validatedData = $request->validate([
            'titre' => 'required|string',
            'prix' => 'required|numeric',
            'status' => 'required|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('images') && count($request->file('images')) > 5) {
            return response()->json(['error' => 'Vous ne pouvez télécharger que jusqu\'à 5 images.'], 422);
        }

        try {
            // Récupérer l'artisan authentifié en utilisant le garde approprié
            $artisan = Auth::guard('sanctum')->user();

            if (!$artisan) {
                return response()->json(['error' => 'Non authentifié.'], 401);
            }

            // Trouver la réalisation à mettre à jour
            $realisation = Realisation::findOrFail($id);

            // Vérifier si l'artisan authentifié est le propriétaire de la réalisation
            if ($realisation->artisan_id !== $artisan->id) {
                return response()->json(['error' => 'Autorisation refusée.'], 403);
            }

            // Mettre à jour les champs de la réalisation
            $realisation->titre = $validatedData['titre'];
            $realisation->prix = $validatedData['prix'];
            $realisation->status = $validatedData['status'];

            // Gestion des images
            if ($request->hasFile('images')) {
                // Ajouter les nouvelles images
                foreach ($request->file('images') as $image) {
                    $imageName = Str::random() . '.' . $image->getClientOriginalExtension();
                    $image->storeAs('realisation', $imageName, 'public');

                    // Créer une entrée dans la table realisation_images
                    $realisation->images()->create(['image' => $imageName]);
                }
            }

            // Supprimer les images spécifiées
            if ($request->has('images_to_delete')) {
                foreach ($request->input('images_to_delete') as $imageId) {
                    $image = RealisationImage::find($imageId);

                    if ($image) {
                        // Supprimer l'image du système de fichiers
                        Storage::disk('public')->delete('realisation/' . $image->image);

                        // Supprimer l'enregistrement de la base de données
                        $image->delete();

                        //Log::info('Image supprimée: ' . $image->image);
                    }
                }
            }

            // Sauvegarder les modifications
            $realisation->save();

            return response()->json(['message' => 'Réalisation mise à jour avec succès.', 'realisation' => $realisation], 200);
        } catch (\Exception $e) {
            // En cas d'erreur, renvoyer une réponse d'erreur
            return response()->json(['error' => 'Erreur lors de la mise à jour de la réalisation.', 'message' => $e->getMessage()], 500);
        }
    }

    public function getLikeCount($id)
    {
        // Trouver la réalisation
        $realisation = Realisation::find($id);

        if (!$realisation) {
            return response()->json(['error' => 'Réalisation non trouvée'], 404);
        }

        // Compter le nombre total de likes
        $likeCount = Aime::where('realisation_id', $id)->count();

        return response()->json(['count' => $likeCount], 200);
    }

    public function like($id)
    {
        $realisation = Realisation::find($id);

        if (!$realisation) {
            return response()->json(['error' => 'Réalisation non trouvée'], 404);
        }

        $user = auth()->user();
        if ($user instanceof User) {
            $userId = $user->id;
            $likeType = 'user_id';
        } elseif ($user instanceof Artisan) {
            $userId = $user->id;
            $likeType = 'artisan_id';
        } else {
            return response()->json(['error' => 'Type d\'utilisateur non pris en charge.'], 403);
        }

        $aime = Aime::firstOrCreate([
            'realisation_id' => $id,
            $likeType => $userId,
        ]);

        return response()->json(['success' => 'Like ajouté']);
    }

    public function unlike($id)
    {
        $realisation = Realisation::find($id);

        if (!$realisation) {
            return response()->json(['error' => 'Réalisation non trouvée'], 404);
        }

        $user = auth()->user();
        if ($user instanceof User) {
            $userId = $user->id;
            $likeType = 'user_id';
        } elseif ($user instanceof Artisan) {
            $userId = $user->id;
            $likeType = 'artisan_id';
        } else {
            return response()->json(['error' => 'Type d\'utilisateur non pris en charge.'], 403);
        }

        $aime = Aime::where('realisation_id', $id)
            ->where($likeType, $userId)
            ->first();

        if ($aime) {
            $aime->delete();
            return response()->json(['success' => 'Like retiré']);
        }

        return response()->json(['error' => 'Like non trouvé'], 404);
    }



    /*public function like(Request $request, $realisationId)
    {
        try {
            $artisan = Auth::guard('sanctum')->user();

            if (!$artisan) {
                return response()->json(['error' => 'Non authentifié.'], 401);
            }

            $realisation = Realisation::findOrFail($realisationId);

            $like = Aime::where('realisation_id', $realisationId)
                ->where('user_id', $artisan->id)
                ->first();

            if ($like) {
                // Si le like existe déjà, le supprimer (unlike)
                $like->delete();
                return response()->json([
                    'message' => 'Réalisation unlikée avec succès.',
                    'likeCount' => $realisation->aimes()->count()
                ]);
            } else {
                // Sinon, créer un nouveau like
                Aime::create([
                    'realisation_id' => $realisationId,
                    'user_id' => $artisan->id,
                ]);
                return response()->json([
                    'message' => 'Réalisation likée avec succès.',
                    'likeCount' => $realisation->aimes()->count()
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de l\'action de like.',
                'message' => $e->getMessage()
            ], 500);
        }
    }*/

    public function destroy($id)
    {
        try {
            $realisation = Realisation::findOrFail($id);

            // Supprimer les images associées à la réalisation du stockage
            foreach ($realisation->images as $image) {
                $exist = Storage::disk('public')->exists("realisation/{$image->image}");
                if ($exist) {
                    Storage::disk('public')->delete("realisation/{$image->image}");
                }
            }

            // Supprimer les images associées à la réalisation de la base de données
            $realisation->images()->delete();

            $realisation->delete();

            return response()->json([
                'message' => 'Réalisation supprimée avec succès'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression de la réalisation',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Commentaire;
use App\Models\Realisation;
use App\Models\Artisan;
use App\Models\User;
use App\Models\Like;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class CommentaireController extends Controller
{

    public function getIndex()
    {
        $commentaires = Commentaire::with([
            'user',
            'artisan',
            'replies.user',
            'replies.artisan',
            'replies.replies.user',  // Charger les réponses des réponses
            'replies.replies.artisan'
        ])
            ->whereNull('parent_comment_id') // Assurez-vous de récupérer uniquement les commentaires de premier niveau
            ->orderBy('created_at', 'asc')
            ->get();

        Log::info($commentaires);
        // Retourner la réponse JSON avec les commentaires
        return response()->json([
            'message' => 'Succès',
            'commentaires' => $commentaires
        ], 200);
    }

    /*public function store(Request $request, $realisationId)
    {
        try {
            Log::info('Début de la méthode store pour le commentaire.');

            $commentaire = $request->input('commentaire');
            $parentCommentId = $request->input('parent_comment_id');
            $user = auth()->user();

            Log::info('parent_comment_id reçu : ' . $parentCommentId);
            Log::info('Données reçues : ' . json_encode($request->all()));

            if ($user instanceof User) {
                Log::info('Utilisateur normal détecté.');

                $commentaireModel = new Commentaire([
                    'realisation_id' => $realisationId,
                    'commentaire' => $commentaire,
                    'parent_comment_id' => $parentCommentId,
                    'user_id' => $user->id,
                ]);

                $commentaireModel->save();
            } elseif ($user instanceof Artisan) {
                Log::info('Artisan détecté.');

                $commentaireModel = new Commentaire([
                    'realisation_id' => $realisationId,
                    'commentaire' => $commentaire,
                    'parent_comment_id' => $parentCommentId,
                ]);

                $user->commentaire()->save($commentaireModel);
            } else {
                Log::info('Type d\'utilisateur non pris en charge.');
                return response()->json(['error' => 'Type d\'utilisateur non pris en charge.'], 403);
            }

            Log::info('Commentaire ajouté avec succès.');

            return response()->json([
                'commentaire' => $commentaireModel,
                'is_reply' => !!$parentCommentId,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'ajout du commentaire : ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de l\'ajout du commentaire.'], 500);
        }
    }*/

    /*public function store(Request $request)
    {
        // Validation des données
        $request->validate([
            'realisation_id' => 'required|exists:realisations,id',
            'commentaire' => 'required|string',
            'parent_comment_id' => 'nullable|exists:commentaires,id',
        ]);

        // Déterminer le type d'utilisateur
        $user = $request->user();

        // Création du commentaire
        $commentaire = new Commentaire();
        $commentaire->realisation_id = $request->input('realisation_id');
        $commentaire->commentaire = $request->input('commentaire');
        $commentaire->parent_comment_id = $request->input('parent_comment_id');

        // Vérifier si c'est une réponse
        if ($commentaire->parent_comment_id !== null) {
            $commentaire->is_reply = true;

            // Vérifier si le commentaire parent existe
            $parentComment = Commentaire::find($commentaire->parent_comment_id);
            if (!$parentComment) {
                return response()->json(['error' => 'Le commentaire parent n\'existe pas.'], 404);
            }
        } else {
            $commentaire->is_reply = false;
        }

        // Attribution de l'utilisateur ou de l'artisan en fonction du type
        if ($user instanceof User) {
            $commentaire->user_id = $user->id;
        } elseif ($user instanceof Artisan) {
            $commentaire->artisan_id = $user->id;
        } else {
            return response()->json(['error' => 'Type d\'utilisateur non pris en charge.'], 403);
        }

        // Sauvegarde du commentaire
        $commentaire->save();



        return response()->json(['message' => 'Commentaire créé avec succès', 'commentaire' => $commentaire], 201);
    }*/

    /*public function store(Request $request)
    {
        // Validation des données
        $request->validate([
            'realisation_id' => 'required|exists:realisations,id',
            'commentaire' => 'required|string',
            'parent_comment_id' => 'nullable|exists:commentaires,id',
        ]);

        // Déterminer le type d'utilisateur
        $user = $request->user();

        // Récupérer la réalisation associée au commentaire
        $realisation = Realisation::findOrFail($request->input('realisation_id'));

        // Création du commentaire
        $commentaire = new Commentaire();
        $commentaire->realisation_id = $realisation->id;
        $commentaire->commentaire = $request->input('commentaire');
        $commentaire->parent_comment_id = $request->input('parent_comment_id');

        // Vérifier si c'est une réponse
        if ($commentaire->parent_comment_id !== null) {
            $commentaire->is_reply = true;

            // Vérifier si le commentaire parent existe
            $parentComment = Commentaire::find($commentaire->parent_comment_id);
            
            if (!$parentComment) {
                return response()->json(['error' => 'Le commentaire parent n\'existe pas.'], 404);
            }

            // Ajouter une notification pour la réponse au commentaire parent
            if ($parentComment->user_id) {
                $notification = new Notification();
                $notification->user_id = $parentComment->user_id; // Utiliser l'user_id du commentaire parent
                $notification->artisan_id = $realisation->artisan_id;
                $notification->realisation_id = $commentaire->realisation_id;

                $notification->message = " a répondu à votre commentaire sur la réalisation '{$realisation->titre}'.";

                $notification->save();
            } else {
                return response()->json(['error' => 'L\'utilisateur associé au commentaire parent est invalide.'], 403);
            }
        } else {
            $commentaire->is_reply = false;
        }

        // Attribution de l'utilisateur ou de l'artisan en fonction du type
        if ($user instanceof User) {
            $commentaire->user_id = $user->id;
        } elseif ($user instanceof Artisan) {
            // Attribuer directement l'artisan_id associé à la réalisation
            $commentaire->artisan_id = $realisation->artisan_id;
        } else {
            return response()->json(['error' => 'Type d\'utilisateur non pris en charge.'], 403);
        }

        // Sauvegarde du commentaire
        $commentaire->save();

        $notification = new Notification();
        $notification->artisan_id = $realisation->artisan_id; // Utiliser l'artisan_id associé à la réalisation
        $notification->user_id = $commentaire->user_id;
        $notification->realisation_id = $commentaire->realisation_id;

        // Récupération des informations de l'utilisateur et de la réalisation pour un meilleur message
        $user = User::find($commentaire->user_id); // Charger les informations de l'utilisateur
        $realisation = Realisation::find($commentaire->realisation_id); // Charger les informations de la réalisation
        $user_name = $user ? $user->name : 'Utilisateur inconnu';
        $realisation_titre = $realisation ? $realisation->titre : 'Réalisation inconnue'; // Assurez-vous que votre modèle Realisation a un attribut 'titre'
        $notification->message = " a commenté votre réalisation '{$realisation_titre}'.";

        $notification->save();

        return response()->json(['message' => 'Commentaire créé avec succès', 'commentaire' => $commentaire], 201);
    }*/

    /*public function store(Request $request)
    {
        // Validation des données
        $request->validate([
            'realisation_id' => 'required|exists:realisations,id',
            'commentaire' => 'required|string',
            'parent_comment_id' => 'nullable|exists:commentaires,id',
        ]);

        // Déterminer le type d'utilisateur
        $user = $request->user();

        // Récupérer la réalisation associée au commentaire
        $realisation = Realisation::findOrFail($request->input('realisation_id'));

        // Création du commentaire
        $commentaire = new Commentaire();
        $commentaire->realisation_id = $realisation->id;
        $commentaire->commentaire = $request->input('commentaire');
        $commentaire->parent_comment_id = $request->input('parent_comment_id');

        // Attribution de l'utilisateur ou de l'artisan en fonction du type
        if ($user instanceof User) {
            $commentaire->user_id = $user->id;
        } elseif ($user instanceof Artisan) {
            $commentaire->artisan_id = $realisation->artisan_id;
        } else {
            return response()->json(['error' => 'Type d\'utilisateur non pris en charge.'], 403);
        }

        // Sauvegarde du commentaire
        $commentaire->save();

        // Vérifier si c'est une réponse
        if ($commentaire->parent_comment_id !== null) {
            $commentaire->is_reply = true;

            // Vérifier si le commentaire parent existe
            $parentComment = Commentaire::find($commentaire->parent_comment_id);

            if (!$parentComment) {
                return response()->json(['error' => 'Le commentaire parent n\'existe pas.'], 404);
            }

            // Ajouter une notification pour la réponse au commentaire parent
            if ($parentComment->user_id) {
                $notification = new Notification();
                $notification->user_id = $parentComment->user_id; // Utiliser l'user_id du commentaire parent
                $notification->artisan_id = $realisation->artisan_id;
                $notification->realisation_id = $commentaire->realisation_id;

                // Récupération des informations de l'utilisateur et de la réalisation pour un meilleur message
                $realisation_titre = $realisation->titre; // Assurez-vous que votre modèle Realisation a un attribut 'titre'
                $notification->message = "a répondu à votre commentaire <<{$parentComment->commentaire}>> sur la réalisation '{$realisation_titre}'.";

                // Débogage des valeurs
                Log::info('Notification Réponse: ', [
                    'user_id' => $notification->user_id,
                    'artisan_id' => $notification->artisan_id,
                    'realisation_id' => $notification->realisation_id,
                    'message' => $notification->message,
                ]);

                $notification->save();
            } else {
                return response()->json(['error' => 'L\'utilisateur associé au commentaire parent est invalide.'], 403);
            }
        } else {
            $commentaire->is_reply = false;

            // Ajouter une notification pour le nouveau commentaire
            $notification = new Notification();
            $notification->artisan_id = $realisation->artisan_id; // Utiliser l'artisan_id associé à la réalisation
            $notification->user_id = $commentaire->user_id;
            $notification->realisation_id = $commentaire->realisation_id;

            // Récupération des informations de l'utilisateur et de la réalisation pour un meilleur message
            $user_name = $user->name;
            $realisation_titre = $realisation->titre;
            $notification->message = "{$user_name} a commenté votre réalisation '{$realisation_titre}'.";

            // Débogage des valeurs
            Log::info('Notification Commentaire: ', [
                'user_id' => $notification->user_id,
                'artisan_id' => $notification->artisan_id,
                'realisation_id' => $notification->realisation_id,
                'message' => $notification->message,
            ]);

            $notification->save();
        }

        return response()->json(['message' => 'Commentaire créé avec succès', 'commentaire' => $commentaire], 201);
    }*/

    protected function createNotification($userId, $artisanId, $type, $message, $realisationImage   = null)
    {
        $notification = new Notification();
        $notification->user_id = $userId;
        $notification->artisan_id = $artisanId;
        $notification->type = $type;
        $notification->message = $message;
        $notification->realisation_image = $realisationImage;
        $notification->save();
    }

    public function store(Request $request)
    {
        // Validation des données reçues
        $request->validate([
            'realisation_id' => 'required|exists:realisations,id',
            'commentaire' => 'required|string',
            'parent_comment_id' => 'nullable|exists:commentaires,id',
        ]);

        // Récupérer la réalisation
        $realisation = Realisation::find($request->input('realisation_id'));

        // Récupérer l'utilisateur authentifié
        $user = Auth::user();

        // Créer un nouvel objet Commentaire
        $commentaire = new Commentaire([
            'realisation_id' => $realisation->id,
            'commentaire' => $request->input('commentaire'),
            'parent_comment_id' => $request->input('parent_comment_id'),
            'is_reply' => $request->input('parent_comment_id') ? true : false,
        ]);

        // Déterminer le type d'utilisateur et assigner les identifiants appropriés
        if ($user instanceof User) {
            $commentaire->user_id = $user->id;
        } elseif ($user instanceof Artisan) {
            $commentaire->artisan_id = $user->id;
        } else {
            return response()->json(['error' => 'Type d\'utilisateur non pris en charge.'], 403);
        }

        // Sauvegarder le commentaire
        $commentaire->save();

        return response()->json([
            'message' => 'Commentaire ajouté avec succès',
            'commentaire' => $commentaire
        ], 201);
    }

    /*public function store(Request $request)
    {
        // Validation des données
        $request->validate([
            'realisation_id' => 'required|exists:realisations,id',
            'commentaire' => 'required|string',
            'parent_comment_id' => 'nullable|exists:commentaires,id',
        ]);

        // Déterminer le type d'utilisateur
        $user = $request->user();

        // Création du commentaire
        $commentaire = new Commentaire();
        $commentaire->realisation_id = $request->input('realisation_id');
        $commentaire->commentaire = $request->input('commentaire');
        $commentaire->parent_comment_id = $request->input('parent_comment_id');
        $commentaire->is_reply = $commentaire->parent_comment_id !== null;

        // Vérifier si c'est une réponse et si le commentaire parent existe
        if ($commentaire->is_reply) {
            $parentComment = Commentaire::find($commentaire->parent_comment_id);
            if (!$parentComment) {
                return response()->json(['error' => 'Le commentaire parent n\'existe pas.'], 404);
            }
        }

        // Attribution de l'utilisateur ou de l'artisan en fonction du type
        if ($user instanceof User) {
            $commentaire->user_id = $user->id;
        } elseif ($user instanceof Artisan) {
            $commentaire->artisan_id = $user->id;
        } else {
            return response()->json(['error' => 'Type d\'utilisateur non pris en charge.'], 403);
        }

        // Sauvegarde du commentaire
        $commentaire->save();

        $commentaire->load(['user', 'artisan', 'replies.user', 'replies.artisan']);

        // Créer une notification avec le message spécifique et l'image de la réalisation
        $realisation = Realisation::find($commentaire->realisation_id);
        if ($realisation && $user instanceof User) {
            // Construction du message de notification avec le nom de l'image
            $mainImage = $realisation->mainImage();
            $realisationImage = $mainImage ? $mainImage->image : 'Aucune image disponible'; // Si aucune image principale n'est définie

            if ($commentaire->is_reply) {
                $parentComment = $commentaire->parentComment; // Assuming you have a way to get the parent comment
                $message = " a répondu à votre commentaire : <<{$parentComment->commentaire}>>";
                $this->createNotification($parentComment->artisan_id, $user->id, 'réponse', $message, $realisationImage);
            } else {
                $message = " a commenté votre réalisation :";
                $this->createNotification($user->id, $realisation->artisan_id, 'commentaire', $message, $realisationImage);
            }
        } elseif ($realisation && $user instanceof Artisan) {
            $mainImage = $realisation->mainImage();
            $realisationImage = $mainImage ? $mainImage->image : 'Aucune image disponible';
            // Notification pour l'utilisateur qui a commenté (ou répliqué)
            if ($commentaire->is_reply) {
                $parentComment = $commentaire->parentComment; // Assuming you have a way to get the parent comment
                $message = " a répondu à votre commentaire : <<{$parentComment->commentaire}>>";
                $this->createNotification($parentComment->user_id, $user->id, 'réponse', $message, $realisationImage); // Pas d'image pour les réponses
            } else {
                $message = "Vous avez commenté la réalisation {$realisation->titre} ({$realisationImage})";
                $this->createNotification($user->id, $realisation->artisan_id, 'commentaire', $message, $realisationImage);
            }
        }

        return response()->json(['message' => 'Commentaire créé avec succès', 'commentaire' => $commentaire], 201);
    }*/

    /*public function likeComment(Request $request, $commentaireId)
    {
        try {
            Log::info('Début de la méthode like pour le commentaire.');

            $user = auth()->user();

            $likeData = ['commentaire_id' => $commentaireId];

            if ($user instanceof User) {
                Log::info('Utilisateur normal détecté.');

                $likeData['user_id'] = $user->id;
                $existingLike = Like::where('commentaire_id', $commentaireId)->where('user_id', $user->id)->first();
            } elseif ($user instanceof Artisan) {
                Log::info('Artisan détecté.');

                $likeData['artisan_id'] = $user->id;
                $existingLike = Like::where('commentaire_id', $commentaireId)->where('artisan_id', $user->id)->first();
            } else {
                Log::info('Type d\'utilisateur non pris en charge.');
                return response()->json(['error' => 'Type d\'utilisateur non pris en charge.'], 403);
            }

            if ($existingLike) {
                Log::info('Annulation du like existant.');
                $existingLike->delete();
                return response()->json(['message' => 'Like retiré.'], 200);
            } else {
                Log::info('Ajout d\'un nouveau like.');
                if (isset($likeData['user_id']) || isset($likeData['artisan_id'])) {
                    Like::create($likeData);
                    return response()->json(['message' => 'Commentaire liké.'], 201);
                } else {
                    Log::error('Aucun ID utilisateur ou artisan fourni.');
                    return response()->json(['error' => 'Erreur lors du like du commentaire.'], 500);
                }
            }
        } catch (\Exception $e) {
            Log::error('Erreur lors du like du commentaire : ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors du like du commentaire.'], 500);
        }
    }*/

    /*public function likeComment(Request $request, $commentaireId)
    {
        try {
            $user = auth()->user();
            $likeData = ['commentaire_id' => $commentaireId];
            $commentaire = Commentaire::find($commentaireId);

            if (!$commentaire) {
                return response()->json(['error' => 'Commentaire non trouvé.'], 404);
            }

            if ($user instanceof User) {
                Log::info('Utilisateur normal détecté.');
                $likeData['user_id'] = $user->id;
                $existingLike = Like::where('commentaire_id', $commentaireId)->where('user_id', $user->id)->first();
            } elseif ($user instanceof Artisan) {
                Log::info('Artisan détecté.');
                $likeData['artisan_id'] = $user->id;
                $existingLike = Like::where('commentaire_id', $commentaireId)->where('artisan_id', $user->id)->first();
            } else {
                return response()->json(['error' => 'Type d\'utilisateur non pris en charge.'], 403);
            }

            if ($existingLike) {
                $existingLike->delete();
                return response()->json(['message' => 'Like retiré.'], 200);
            } else {
                if (isset($likeData['user_id']) || isset($likeData['artisan_id'])) {
                    Like::create($likeData);

                    // Création de la notification
                    $realisation = $commentaire->realisation;
                    $mainImage = $realisation->mainImage();
                    $realisationImage = $mainImage ? $mainImage->image : 'Aucune image disponible';

                    if ($user instanceof User) {
                        $message = "a aimé votre commentaire : {$commentaire->commentaire}";
                        $this->createNotification($commentaire->artisan_id, $user->id, 'like', $message, $realisationImage);
                    } elseif ($user instanceof Artisan) {
                        $message = "a aimé votre commentaire : {$commentaire->commentaire}";
                        $this->createNotification($commentaire->user_id, $user->id, 'like', $message, $realisationImage);
                    }

                    return response()->json(['message' => 'Commentaire liké.'], 201);
                } else {
                    return response()->json(['error' => 'Erreur lors du like du commentaire.'], 500);
                }
            }
        } catch (\Exception $e) {
            Log::error('Erreur lors du like du commentaire : ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors du like du commentaire.'], 500);
        }
    }*/

    /*public function likeComment(Request $request, $commentaireId)
    {
        try {
            $user = auth()->user();
            $likeData = ['commentaire_id' => $commentaireId];
            $commentaire = Commentaire::find($commentaireId);

            if (!$commentaire) {
                return response()->json(['error' => 'Commentaire non trouvé.'], 404);
            }

            if ($user instanceof User) {
                //Log::info('Utilisateur normal détecté.');
                $likeData['user_id'] = $user->id;
                $existingLike = Like::where('commentaire_id', $commentaireId)->where('user_id', $user->id)->first();
            } elseif ($user instanceof Artisan) {
                //Log::info('Artisan détecté.');
                $likeData['artisan_id'] = $user->id;
                $existingLike = Like::where('commentaire_id', $commentaireId)->where('artisan_id', $user->id)->first();
            } else {
                return response()->json(['error' => 'Type d\'utilisateur non pris en charge.'], 403);
            }

            if ($existingLike) {
                $existingLike->delete();
                return response()->json(['message' => 'Like retiré.'], 200);
            } else {
                if (isset($likeData['user_id']) || isset($likeData['artisan_id'])) {
                    Like::create($likeData);

                    // Création de la notification
                    $realisation = $commentaire->realisation;
                    $mainImage = $realisation->mainImage();
                    $realisationImage = $mainImage ? $mainImage->image : 'Aucune image disponible';

                    if ($user instanceof User) {
                        $message = "a aimé votre commentaire : {$commentaire->commentaire}";
                        $this->createNotification($commentaire->artisan_id, $user->id, 'like', $message, $realisationImage);
                    } elseif ($user instanceof Artisan) {
                        $message = "a aimé votre commentaire : {$commentaire->commentaire}";
                        $this->createNotification($commentaire->user_id, $user->id, 'like', $message, $realisationImage);
                    }

                    return response()->json(['message' => 'Commentaire liké.'], 201);
                } else {
                    return response()->json(['error' => 'Erreur lors du like du commentaire.'], 500);
                }
            }
        } catch (\Exception $e) {
            Log::error('Erreur lors du like du commentaire : ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors du like du commentaire.'], 500);
        }
    }*/

    public function likeComment($commentId)
    {
        $user = Auth::user();
        $comment = Commentaire::find($commentId);

        if (!$comment) {
            return response()->json(['error' => 'Commentaire non trouvé.'], 404);
        }

        $like = Like::where('commentaire_id', $commentId)
            ->where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orWhere('artisan_id', $user->id);
            })
            ->first();

        if ($like) {
            // Si le like existe, le supprimer
            $like->delete();
            $isLiked = false;
        } else {
            // Sinon, créer un nouveau like
            Like::create([
                'commentaire_id' => $commentId,
                'user_id' => $user instanceof User ? $user->id : null,
                'artisan_id' => $user instanceof Artisan ? $user->id : null,
            ]);
            $isLiked = true;
        }

        $likesCount = $comment->likes()->count();

        return response()->json([
            'isLiked' => $isLiked,
            'likesCount' => $likesCount
        ]);
    }



    public function unlikeComment($id)
    {
        try {
            $commentaire = Commentaire::findOrFail($id);

            Log::info("ID du commentaire avant suppression du like : $id");

            $like = Like::where('commentaire_id', $id)
                ->where(function ($query) {
                    $query->where('user_id', Auth::id())
                        ->orWhere('artisan_id', Auth::id());
                })->first();

            if ($like) {
                $like->delete();
                return response()->json(['message' => 'Like retiré avec succès'], 200);
            } else {
                return response()->json(['error' => 'Like non trouvé'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la suppression du like', 'message' => $e->getMessage()], 500);
        }
    }

    public function getLikesCount($id)
    {
        try {
            // Compter les likes pour ce commentaire
            $likesCount = Like::where('commentaire_id', $id)->count();

            return response()->json(['likeCount' => $likesCount], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération du nombre de likes', 'message' => $e->getMessage()], 500);
        }
    }
}

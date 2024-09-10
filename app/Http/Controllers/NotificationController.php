<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Artisan;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class NotificationController extends Controller
{
    public function getUserNotifications(Request $request)
    {
        $user = Auth::user();

        if ($user instanceof User) {
            // Log pour vérifier l'utilisateur authentifié
            Log::info('Utilisateur authentifié : ' . $user->id);

            $notifications = Notification::where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->whereIn('type', ['réponse', 'like'])
                    ->orWhere('artisan_id', $user->id);
            })
                ->with('artisan', 'user')
                ->orderByDesc('created_at')
                ->get();

            // Log pour vérifier les notifications de type 'like'
            $likeNotifications = $notifications->where('type', 'like');
            Log::info('Nombre de notifications de type like pour l\'utilisateur : ' . $likeNotifications->count());

            return response()->json(['notifications' => $notifications], 200);
        } else {
            return response()->json(['error' => 'Non authorisé.'], 403);
        }
    }


    public function getArtisanNotifications(Request $request)
    {
        $artisan = Auth::user();

        if ($artisan instanceof Artisan) {
            $notifications = Notification::where('artisan_id', $artisan->id)
                ->where(function ($query) use ($artisan) {
                    $query->where('type', 'commentaire')
                        ->orWhere(function ($query) use ($artisan) {
                            $query->where('user_id', $artisan->id)
                                ->where('type', 'réponse');
                        })
                        ->orWhere(function ($query) use ($artisan) {
                            $query->where('type', 'like')
                                ->where('artisan_id', '!=', $artisan->id); // Filtrer les likes reçus
                        });
                })
                ->with('artisan', 'user', 'realisation')
                ->orderByDesc('created_at')
                ->get();

            //Log::info('Artisan notifications count: ' . $notifications->count());

            return response()->json(['notifications' => $notifications], 200);
        } else {
            return response()->json(['error' => 'Non authorisé.'], 403);
        }
    }
}

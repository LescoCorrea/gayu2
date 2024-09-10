<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Artisan;

class AuthController extends Controller
{
    public function allUser()
    {
        // Récupérer tous les utilisateurs de la base de données
        $users = User::all();

        // Retourner les utilisateurs sous forme de réponse JSON
        return response()->json($users);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $isFirstUser = User::count() === 0;

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_as' => $isFirstUser ? 1 : 0,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'message' => 'Connexion réussie en tant qu\'utilisateur normal.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role_as,
            ],
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Vérifiez si l'utilisateur ou l'artisan existe dans la base de données
        $user = User::where('email', $request->email)->first();
        $artisan = Artisan::where('email', $request->email)->first();

        // Vérifiez l'existence de l'utilisateur normal
        if ($user) {
            // Vérifie le mot de passe
            if (Hash::check($request->password, $user->password)) {
                // Authentification réussie pour l'utilisateur normal
                $token = $user->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'status' => 200,
                    'message' => 'Connexion réussie en tant qu\'utilisateur normal.',
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role_as,
                    ],
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                ]);
            } else {
                // Mot de passe incorrect pour l'utilisateur normal
                return response()->json([
                    'status' => 401,
                    'message' => 'Mot de passe incorrect. Veillez vérifier votre mot de passe.',
                ], 401);
            }
        }

        // Vérifiez l'existence de l'artisan
        if ($artisan) {
            // Authentification pour les artisans
            if (Auth::guard('artisan')->attempt($request->only('email', 'password'))) {
                $artisan = Artisan::where('email', $request->email)->first();

                if ($artisan->access === 'inactif') {
                    return response()->json([
                        'status' => 403,
                        'message' => 'L\'accès à votre compte est refusé. Veuillez contacter l\'administrateur.',
                    ], 403);
                }

                $token = $artisan->createToken('auth_token')->plainTextToken;
                $roles = $artisan->roles()->pluck('name');

                return response()->json([
                    'status' => 200,
                    'message' => 'Connexion réussie en tant qu\'artisan.',
                    'artisan' => [
                        'id' => $artisan->id,
                        'name' => $artisan->prenom,
                        'email' => $artisan->email,
                        'role' => $roles,
                        'détail' => $artisan,
                    ],
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                ]);
            } else {
                // Mot de passe incorrect pour l'artisan
                return response()->json([
                    'status' => 401,
                    'message' => 'Mot de passe incorrect. Veillez vérifier votre mot de passe.',
                ], 401);
            }
        }

        // Si aucun utilisateur ni artisan n'existe
        return response()->json([
            'status' => 401,
            'message' => 'Email incorrect. Veillez vérifier votre email',
        ], 401);
    }

    public function getUserDetails(Request $request)
    {
        // Récupérer l'utilisateur actuellement authentifié
        $user = Auth::user();

        // Vérifier si l'utilisateur est authentifié
        if ($user) {
            return response()->json([
                'status' => 'success',
                'user' => $user
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|nullable|string|min:8|confirmed',
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'Profil mis à jour avec succès.',
            'user' => $user,
        ]);
    }

    /*public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Vérifiez si l'utilisateur existe dans la base de données
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            // Tentative d'authentification pour les artisans si l'utilisateur échoue
            if (!Auth::guard('artisan')->attempt($request->only('email', 'password'))) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Identifiants incorrects. Veuillez vérifier votre email et votre mot de passe.',
                ], 401);
            } else {
                // Récupérez les détails de l'artisan connecté
                $artisan = Artisan::where('email', $request->email)->firstOrFail();
                $token = $artisan->createToken('auth_token')->plainTextToken;
                $roles = $artisan->roles()->pluck('name');
                
                return response()->json([
                    'status' => 200,
                    'message' => 'Connexion réussie en tant qu\'artisan.',
                    'artisan' => [
                        'id' => $artisan->id,
                        'name' => $artisan->prenom,
                        'email' => $artisan->email,
                        'role' => $roles,
                        'détail' => $artisan,
                    ],
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                ]);
            }
        }

        // Si l'utilisateur normal est authentifié avec succès
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'message' => 'Connexion réussie en tant qu\'utilisateur normal.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role_as,
                
            ],
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }*/

    public function me(Request $request)
    {
        if (Auth::check()) {
            $user = Auth::user();

            if ($user instanceof Artisan) {
                $role = $user->roles()->pluck('name');
            } else {
                $role = $user->role_as;
            }

            $name = trim(($user->prenom ?? '') . ' ' . ($user->nom ?? ''));
            if (empty($name)) {
                $name = $user->name;
            }
            $image = $user->image ? asset('storage/' . $user->image) : null;

            return response()->json([
                'status' => 200,
                'user' => [
                    'id' => $user->id,
                    'name' => $name,
                    'role' => $role,
                    'image' => $image,
                    'message' => 'Utilisateur connecté'
                ],
            ]);
        }
        return response()->json([
            'status' => 401,
            'message' => 'Non autorisé. Aucun utilisateur connecté.',
        ], 401);
    }
}

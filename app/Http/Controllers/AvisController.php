<?php

namespace App\Http\Controllers;

use App\Models\Avis;
use App\Models\Artisan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AvisController extends Controller
{
    public function index()
    {
        // Récupérer l'ID de l'artisan connecté
        $artisanId = Auth::id();
        
        // Récupérer les avis liés à cet artisan
        $avis = Avis::where('artisan_id', $artisanId)
                    ->with('user', 'artisan')
                    ->get();
        
        return response()->json($avis, 200);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'artisan_id' => 'required|exists:artisans,id',
            'avis' => 'required|string|max:255',
            'note' => 'nullable|integer|min:1|max:5',
        ]);

        $avis = new Avis();
        $avis->user_id = Auth::id();
        $avis->artisan_id = $request->artisan_id;
        $avis->avis = $request->avis;
        $avis->note = $request->note;
        $avis->save();

        return response()->json($avis, 200);
    }

    public function storeNote(Request $request)
    {
        $validatedData = $request->validate([
            'artisan_id' => 'required|exists:artisans,id',
            'note' => 'nullable|integer|min:1|max:5',
        ]);

        $note = new Avis($validatedData);

        $user = Auth::user();
        if ($user instanceof \App\Models\User) {
            $note->user_id = $user->id;
        } elseif ($user instanceof \App\Models\Artisan) {
            $note->artisan_id = $user->id;
        }

        $note->save();

        return response()->json(['message' => 'Rating saved successfully', 'note' => $note], 201);
    }
}

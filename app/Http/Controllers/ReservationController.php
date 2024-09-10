<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Artisan;
use Illuminate\Support\Facades\Auth;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ReservationController extends Controller
{
    /*public function index()
    {
        $reservations = Reservation::with(['artisan', 'user'])->get();
        return response()->json($reservations);
    }*/

    public function index()
    {
        // Récupérer l'ID de l'utilisateur authentifié
        $userId = auth()->id();

        // Filtrer les réservations par l'utilisateur authentifié
        $reservations = Reservation::with(['artisan', 'user'])
            ->where('user_id', $userId)
            ->get();

        return response()->json($reservations);
    }

    public function indexArtisan(Request $request)
    {
        // Récupérer l'ID de l'artisan connecté
        $artisanId = auth()->user()->id; // Assurez-vous que votre système d'authentification est configuré correctement

        // Récupérer les réservations associées à l'artisan
        $reservations = Reservation::with(['artisan', 'user'])
            ->where('artisan_id', $artisanId)
            ->get();

        return response()->json($reservations);
    }

    public function store(Request $request, $id)
    {
        $request->validate([
            'date' => ['required', 'date_format:Y-m-d'],
            'heure' => ['required', 'date_format:H:i'],
            'message' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $artisan = Artisan::findOrFail($id);


        $date = $request->input('date');
        $heure = $request->input('heure');


        // Créer des objets Carbon pour la date et l'heure
        $dateCarbon = Carbon::createFromFormat('Y-m-d', $date);
        $heureCarbon = Carbon::createFromFormat('H:i', $heure);

        // Création de la réservation
        $reservation = new Reservation();
        $reservation->user_id = auth()->id();
        $reservation->artisan_id = $artisan->id;
        $reservation->date = $dateCarbon->toDateString();
        $reservation->heure = $heureCarbon->toTimeString();
        $reservation->message = $request->input('message');


        // Vérifiez s'il y a une image téléchargée
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('reservation', $imageName, 'public');

            $reservation->image = $imageName;
        }

        // Sauvegarde de la réservation associée à l'artisan
        $artisan->reservations()->save($reservation);

        return response()->json(['message' => 'Reservation créée avec succès!']);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:En attente,Rejeter,Valider',
        ]);

        $reservation = Reservation::findOrFail($id);
        $reservation->update(['status' => $request->input('status')]);

        return response()->json(['message' => 'Réservation mise à jour avec succès!', 'reservation' => $reservation]);
    }

    public function updateReservation(Request $request, $id)
    {
        // Valider les données d'entrée
        $request->validate([
            'date' => 'required|date',
            'heure' => 'required|date_format:H:i',
            'message' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);


        $reservation = Reservation::findOrFail($id);

        // Mettre à jour les champs de la réservation
        $reservation->date = $request->input('date');
        $reservation->heure = $request->input('heure');
        $reservation->message = $request->input('message');

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $path = $image->store('reservations', 'public');
            $reservation->image = $path;
        }


        $reservation->save();


        return response()->json([
            'message' => 'Réservation mise à jour avec succès',
            'reservation' => $reservation
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        // Récupérer l'artisan connecté
        $artisan = Auth::guard('sanctum')->user();

        // Vérifier si l'artisan connecté est bien celui lié à la réservation
        $reservation = Reservation::findOrFail($id);

        if ($artisan->id !== $reservation->artisan_id) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        // Valider et mettre à jour le statut
        $request->validate([
            'status' => 'required|in:En attente,Rejeter,Valider',
        ]);

        $reservation->status = $request->input('status');
        $reservation->save();

        return response()->json(['message' => 'Statut de la réservation mis à jour avec succès.']);
    }

    public function destroy($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->delete();

        return response()->json(['message' => 'Réservation supprimée avec succès']);
    }
}

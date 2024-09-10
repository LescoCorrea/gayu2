<?php

namespace App\Http\Controllers;

use App\Models\Metiers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class MetiersController extends Controller
{
    public function index(Request $request)
    {
        $metiers = Metiers::orderByDesc('created_at')->get();
        return response()->json([
            'status' => 200,
            'metiers' => $metiers,
        ]);
    }


    public function show($id)
    {
        $metier = Metiers::find($id);

        if ($metier) {
            return response()->json([
                'status' => 200,
                'metier' => $metier,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Role non trouvée.',
            ]);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:191',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'data' => ['errors' => $validator->errors()->toArray()],
            ]);
        } else {
            Metiers::create([
                'name' => $request->input('name'),
            ]);

            return response()->json([
                'status' => 200,
                'data' => ['message' => 'Métier ajouté avec succès !!.'],
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:191',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'data' => ['errors' => $validator->errors()->toArray()],
            ]);
        }

        try {
            $metier = Metiers::findOrFail($id);
            Log::info('Métier trouvé pour la mise à jour. ID : ' . $id);
            $metier->update([
                'name' => $request->input('name'),
            ]);

            Log::info('Métier mis à jour avec succès. ID : ' . $id);

            return response()->json([
                'status' => 200,
                'data' => ['message' => 'Métier mis à jour avec succès.'],
            ]);
        } catch (\Exception $e) {
            Log::info('Métier introuvable pour la mise à jour. ID : ' . $id);
            return response()->json([
                'status' => 404,
                'message' => 'Métier introuvable.',
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du rôle. ID : ' . $id . ' | Message : ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Erreur interne du serveur.',
            ]);
        }
    }

    public function destroy($id)
    {
        $metier = Metiers::find($id);

        if ($metier) {
            $metier->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Métier supprimé avec succès.',
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Métier introuvable.',
            ]);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Regions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class RegionsController extends Controller
{
    public function index(Request $request)
    {
        $region = Regions::orderByDesc('created_at')->get();
        return response()->json([
            'status' => 200,
            'regions' => $region,
        ]);
    }

    public function show($id)
    {
        $region = Regions::find($id);

        if ($region) {
            return response()->json([
                'status' => 200,
                'region' => $region,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Région non trouvée.',
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
            Regions::create([
                'name' => $request->input('name'),
            ]);

            return response()->json([
                'status' => 200,
                'data' => ['message' => 'Région ajouté avec succès !!.'],
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
            $region = Regions::findOrFail($id);
            Log::info('Région trouvé pour la mise à jour. ID : ' . $id);
            $region->update([
                'name' => $request->input('name'),
            ]);

            Log::info('Région mis à jour avec succès. ID : ' . $id);

            return response()->json([
                'status' => 200,
                'data' => ['message' => 'Région mis à jour avec succès.'],
            ]);
        } catch (\Exception $e) {
            Log::info('Région introuvable pour la mise à jour. ID : ' . $id);
            return response()->json([
                'status' => 404,
                'message' => 'Région introuvable.',
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
        $region = Regions::find($id);

        if ($region) {
            $region->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Région supprimé avec succès.',
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Région introuvable.',
            ]);
        }
    }
}

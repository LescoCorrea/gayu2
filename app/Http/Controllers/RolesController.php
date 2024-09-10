<?php

namespace App\Http\Controllers;

use App\Models\Roles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class RolesController extends Controller
{

    public function index(Request $request)
    {
        $role = Roles::orderByDesc('created_at')->get();
        return response()->json([
            'status' => 200,
            'roles' => $role,
        ]);
    }

    public function show($id)
    {
        $role = Roles::find($id);

        if ($role) {
            return response()->json([
                'status' => 200,
                'role' => $role,
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
            Roles::create([
                'name' => $request->input('name'),
            ]);

            return response()->json([
                'status' => 200,
                'data' => ['message' => 'Rôle ajouté avec succès !!.'],
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
            $role = Roles::findOrFail($id);
            Log::info('Rôle trouvé pour la mise à jour. ID : ' . $id);
            $role->update([
                'name' => $request->input('name'),
            ]);

            Log::info('Rôle mis à jour avec succès. ID : ' . $id);

            return response()->json([
                'status' => 200,
                'data' => ['message' => 'Role mis à jour avec succès.'],
            ]);
        } catch (\Exception $e) {
            Log::info('Rôle introuvable pour la mise à jour. ID : ' . $id);
            return response()->json([
                'status' => 404,
                'message' => 'Role introuvable.',
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
        $role = Roles::find($id);

        if ($role) {
            $role->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Rôle supprimé avec succès.',
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Role introuvable.',
            ]);
        }
    }
}

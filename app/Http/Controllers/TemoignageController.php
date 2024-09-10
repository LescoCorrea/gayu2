<?php

namespace App\Http\Controllers;

use App\Models\Temoignage;
use Illuminate\Http\Request;


class TemoignageController extends Controller
{
    public function index()
    {
        $temoignages = Temoignage::orderByDesc('created_at')->get();
        return response()->json($temoignages);
    }

    public function store(Request $request)
    {
        $temoignage = new Temoignage();
        $temoignage->nom_complet = $request->input('nom_complet');
        $temoignage->profession = $request->input('profession');
        $temoignage->temoignage = $request->input('temoignage');
        $temoignage->save();

        return response()->json($temoignage, 201);
    }

    public function show($id)
    {
        $temoignage = Temoignage::find($id);
        return response()->json($temoignage);
    }

    public function update(Request $request, $id)
    {
        $temoignage = Temoignage::find($id);
        $temoignage->nom_complet = $request->input('nom_complet');
        $temoignage->profession = $request->input('profession');
        $temoignage->temoignage = $request->input('temoignage');
        $temoignage->save();

        return response()->json($temoignage);
    }

    public function destroy($id)
    {
        $temoignage = Temoignage::find($id);
        $temoignage->delete();

        return response()->json(['message' => 'Témoignage supprimé']);
    }
}

<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Mail;


use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        // Validation des données du formulaire de contact
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        // Préparation des données pour l'email
        $data = [
            'title' => 'Nouvelle soumission du formulaire de contact',
            'body' => $request->message,
            'from' => $request->email,
            'name' => $request->name
        ];

        // Envoi de l'email
        Mail::send('emails.contact', compact('data'), function($message) use ($data) {
            $message->to('jeanpascalcorrea@gmail.com')
                    ->subject($data['title'])
                    ->from($data['from'], $data['name']);
        });

        // Réponse JSON après l'envoi du message
        return response()->json(['message' => 'Votre message a été envoyé avec succès !']);
    }
}

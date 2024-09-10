<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function envelope(): Envelope 
    {
        return new Envelope(
            subject: 'Contactez-nous',
            from : new Address('sengayusengayu@gmail.com', 'SenGayu'),
        );
    }

    public function build()
    {
        return $this->subject('Contact Form Submission')
                    ->view('emails.contact');
    }
}

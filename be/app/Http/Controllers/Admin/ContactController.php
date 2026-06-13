<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Helpers\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ContactController extends Controller
{
    public function index(): Response
    {
        $contacts = Contact::latest()->paginate(15);
        return Inertia::render('Contacts/Index', ['contacts' => $contacts]);
    }

    public function show(Contact $contact): Response
    {
        if ($contact->status === 'unread') {
            $oldValue = $contact->toArray();
            $contact->update(['status' => 'read']);
            ActivityLogger::log('UPDATE', 'contacts', "Marked contact message from '{$contact->name}' as read", $oldValue, $contact->toArray());
        }

        return Inertia::render('Contacts/Show', ['contact' => $contact]);
    }

    public function destroy(Contact $contact): RedirectResponse
    {
        $oldValue = $contact->toArray();
        $contact->delete();

        ActivityLogger::log('DELETE', 'contacts', "Deleted contact message from '{$oldValue['name']}'", $oldValue, null);

        return redirect()->route('admin.contacts.index')->with('success', 'Message deleted successfully.');
    }
}

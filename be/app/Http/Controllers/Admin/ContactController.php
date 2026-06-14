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
    public function index(Request $request): Response
    {
        $query = Contact::latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('subject', 'like', '%' . $search . '%')
                  ->orWhere('message', 'like', '%' . $search . '%')
                  ->orWhere('phone', 'like', '%' . $search . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $contacts = $query->paginate(15)->withQueryString();

        return Inertia::render('Contacts/Index', [
            'contacts' => $contacts,
            'filters' => $request->only(['search', 'status'])
        ]);
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

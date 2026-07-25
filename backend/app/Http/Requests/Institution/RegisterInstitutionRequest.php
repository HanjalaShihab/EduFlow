<?php

namespace App\Http\Requests\Institution;

use Illuminate\Foundation\Http\FormRequest;

class RegisterInstitutionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', 'unique:institutions'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:institutions'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'country' => ['required', 'string', 'max:100'],
            'postal_code' => ['sometimes', 'string', 'max:20'],
            'type' => ['required', 'string', 'in:school,college,university,training_institute'],
            'website' => ['sometimes', 'string', 'url', 'max:255'],
            'logo' => ['sometimes', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'admin_name' => ['required', 'string', 'max:255'],
            'admin_email' => ['required', 'string', 'email', 'max:255'],
            'admin_phone' => ['required', 'string', 'max:20'],
            'max_students' => ['sometimes', 'integer', 'min:0'],
            'max_teachers' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Institution name is required.',
            'email.required' => 'Institution email is required.',
            'email.unique' => 'This email is already registered.',
            'phone.required' => 'Phone number is required.',
            'address.required' => 'Address is required.',
            'type.required' => 'Institution type is required.',
            'type.in' => 'Invalid institution type. Choose school, college, university, or training institute.',
            'admin_name.required' => 'Administrator name is required.',
        ];
    }
}


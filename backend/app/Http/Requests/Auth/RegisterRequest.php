<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', 'in:student,teacher,institution_admin'],
            'institution_id' => ['required_if:role,student,teacher', 'integer', 'exists:institutions,id'],
            'student_id' => ['required_if:role,student', 'string', 'max:50'],
            'employee_id' => ['sometimes', 'string', 'max:50'],
            'department_id' => ['required_if:role,student', 'integer', 'exists:departments,id'],
            'program_id' => ['required_if:role,student', 'integer', 'exists:programs,id'],
            'semester_id' => ['required_if:role,student', 'integer', 'exists:semesters,id'],
            'section_id' => ['required_if:role,student', 'integer', 'exists:sections,id'],
            'phone' => ['sometimes', 'string', 'max:20'],
            'gender' => ['sometimes', 'string', 'in:male,female,other'],
            'date_of_birth' => ['sometimes', 'date'],
            'institution_email' => ['sometimes', 'string', 'email', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Full name is required.',
            'email.required' => 'Email address is required.',
            'email.unique' => 'This email is already registered.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
            'role.required' => 'User role is required.',
            'role.in' => 'Invalid user role selected.',
            'institution_id.required_if' => 'Institution selection is required.',
            'student_id.required_if' => 'Student ID is required.',
        ];
    }
}


<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Autenticação e Autorização tratadas no nível de middleware/rotas
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', 'in:admin,accountant'],
            'crc' => ['required_if:role,accountant', 'nullable', 'string', 'max:50'],
            'office_name' => ['required_if:role,accountant', 'nullable', 'string', 'max:255'],
            'active' => ['nullable', 'boolean']
        ];
    }

    /**
     * Custom messages for validation.
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'Este endereço de e-mail já está em uso.',
            'crc.required_if' => 'O campo CRC é obrigatório para contadores.',
            'office_name.required_if' => 'O campo Nome do Escritório é obrigatório para contadores.',
        ];
    }
}

<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('pode fazer login com credenciais validas e conta ativa', function () {
    $user = User::factory()->create([
        'email' => 'contador@teste.com',
        'password' => Hash::make('senha12345'),
        'role' => 'accountant',
        'active' => true,
        'crc' => 'SC-123456/O',
        'office_name' => 'Teste Contabilidade',
    ]);

    $payload = [
        'email' => 'contador@teste.com',
        'password' => 'senha12345',
    ];

    $response = $this->postJson('/api/v1/auth/login', $payload);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'token',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'role',
                    'crc',
                    'office_name',
                    'active',
                ],
            ],
        ]);
});

test('nao pode fazer login com senha incorreta', function () {
    $user = User::factory()->create([
        'email' => 'contador@teste.com',
        'password' => Hash::make('senha12345'),
    ]);

    $payload = [
        'email' => 'contador@teste.com',
        'password' => 'senha_errada',
    ];

    $response = $this->postJson('/api/v1/auth/login', $payload);

    $response->assertStatus(401)
        ->assertJson([
            'success' => false,
            'message' => 'Credenciais inválidas ou conta desativada.',
        ]);
});

test('nao pode fazer login com conta inativa', function () {
    $user = User::factory()->create([
        'email' => 'contador@teste.com',
        'password' => Hash::make('senha12345'),
        'active' => false,
    ]);

    $payload = [
        'email' => 'contador@teste.com',
        'password' => 'senha12345',
    ];

    $response = $this->postJson('/api/v1/auth/login', $payload);

    $response->assertStatus(401)
        ->assertJson([
            'success' => false,
            'message' => 'Credenciais inválidas ou conta desativada.',
        ]);
});

test('login exige email e senha', function () {
    $response = $this->postJson('/api/v1/auth/login', []);

    $response->assertStatus(422)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'email',
                'password',
            ],
        ]);
});

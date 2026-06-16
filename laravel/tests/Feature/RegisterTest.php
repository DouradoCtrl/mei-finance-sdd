<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('pode cadastrar um contador com dados validos', function () {
    $payload = [
        'name' => 'Contador Teste',
        'email' => 'contador@teste.com',
        'crc' => 'SC-123456/O',
        'office_name' => 'Teste Contabilidade',
        'password' => 'senha12345',
    ];

    $response = $this->postJson('/api/register', $payload);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
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

    $this->assertDatabaseHas('users', [
        'email' => 'contador@teste.com',
        'role' => 'accountant',
        'crc' => 'SC-123456/O',
        'office_name' => 'Teste Contabilidade',
        'active' => true,
    ]);
});

test('nao pode cadastrar contador com email duplicado', function () {
    User::factory()->create([
        'email' => 'contador@teste.com',
    ]);

    $payload = [
        'name' => 'Outro Contador',
        'email' => 'contador@teste.com',
        'crc' => 'SC-123456/O',
        'office_name' => 'Outro Escritorio',
        'password' => 'senha12345',
    ];

    $response = $this->postJson('/api/register', $payload);

    $response->assertStatus(422)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'email',
            ],
        ]);
});

test('cadastro valida campos obrigatorios', function () {
    $response = $this->postJson('/api/register', []);

    $response->assertStatus(422)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'name',
                'email',
                'crc',
                'office_name',
                'password',
            ],
        ]);
});

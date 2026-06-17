<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guest cannot access user management endpoints', function () {
    $response = $this->getJson('/api/users');
    $response->assertStatus(401);
});

test('accountant cannot access user management endpoints', function () {
    $accountant = User::factory()->create(['role' => 'accountant']);

    $response = $this->actingAs($accountant)->getJson('/api/users');
    $response->assertStatus(403);
});

test('admin can list users with pagination', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    User::factory()->count(20)->create(['role' => 'accountant']);

    $response = $this->actingAs($admin)->getJson('/api/users');
    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'data' => [
                    '*' => [
                        'id', 'name', 'email', 'role', 'crc', 'office_name', 'active', 'created_at'
                    ]
                ],
                'links',
                'meta'
            ]
        ]);
});

test('admin can create a new admin user', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $payload = [
        'name' => 'New Admin User',
        'email' => 'new.admin@example.com',
        'password' => 'password123',
        'role' => 'admin',
    ];

    $response = $this->actingAs($admin)->postJson('/api/users', $payload);
    $response->assertStatus(201)
        ->assertJson([
            'success' => true,
            'message' => 'Usuário criado com sucesso.',
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'new.admin@example.com',
        'role' => 'admin',
        'crc' => null,
        'office_name' => null
    ]);
});

test('admin can create a new accountant user', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $payload = [
        'name' => 'New Accountant User',
        'email' => 'new.accountant@example.com',
        'password' => 'password123',
        'role' => 'accountant',
        'crc' => 'RS-123456/O',
        'office_name' => 'RS Contadores'
    ];

    $response = $this->actingAs($admin)->postJson('/api/users', $payload);
    $response->assertStatus(201);

    $this->assertDatabaseHas('users', [
        'email' => 'new.accountant@example.com',
        'role' => 'accountant',
        'crc' => 'RS-123456/O',
        'office_name' => 'RS Contadores'
    ]);
});

test('admin can update a user and promotions clear professional data', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $accountant = User::factory()->create([
        'role' => 'accountant',
        'crc' => 'RS-123456/O',
        'office_name' => 'Silva Contadores'
    ]);

    $payload = [
        'name' => 'Promoted User',
        'email' => 'promoted@example.com',
        'role' => 'admin',
        'active' => true
    ];

    $response = $this->actingAs($admin)->putJson("/api/users/{$accountant->id}", $payload);
    $response->assertStatus(200);

    $this->assertDatabaseHas('users', [
        'id' => $accountant->id,
        'name' => 'Promoted User',
        'role' => 'admin',
        'crc' => null,
        'office_name' => null
    ]);
});

test('admin cannot delete themselves', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->deleteJson("/api/users/{$admin->id}");
    $response->assertStatus(422)
        ->assertJson([
            'success' => false,
            'message' => 'Não é permitido excluir o seu próprio usuário logado.'
        ]);

    $this->assertDatabaseHas('users', ['id' => $admin->id]);
});

test('admin can delete other users', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $other = User::factory()->create(['role' => 'accountant']);

    $response = $this->actingAs($admin)->deleteJson("/api/users/{$other->id}");
    $response->assertStatus(200);

    $this->assertDatabaseMissing('users', ['id' => $other->id]);
});

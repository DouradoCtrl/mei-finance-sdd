<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('pode realizar logout revogando o token', function () {
    $user = User::factory()->create([
        'email' => 'contador@teste.com',
        'password' => Hash::make('senha12345'),
        'role' => 'accountant',
        'active' => true,
    ]);

    // Generate token by hitting login
    $loginResponse = $this->postJson('/api/v1/auth/login', [
        'email' => 'contador@teste.com',
        'password' => 'senha12345',
    ]);

    $token = $loginResponse->json('data.token');

    // Access protected route
    $this->getJson('/api/v1/profile/me', [
        'Authorization' => 'Bearer ' . $token,
    ])->assertStatus(200);

    // Hit logout
    $logoutResponse = $this->postJson('/api/v1/logout', [], [
        'Authorization' => 'Bearer ' . $token,
    ]);

    $logoutResponse->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Sessão encerrada com sucesso.',
        ]);

    $this->app['auth']->forgetGuards();

    // Access protected route again (should fail)
    $this->getJson('/api/v1/profile/me', [
        'Authorization' => 'Bearer ' . $token,
    ])->assertStatus(401);
});

test('nao pode realizar logout se nao autenticado', function () {
    $response = $this->postJson('/api/v1/logout');
    $response->assertStatus(401);
});

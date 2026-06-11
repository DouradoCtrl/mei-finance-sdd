<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthAttributesTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_sets_default_role_and_active_status(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'secret123',
            'cnpj' => '12345678901234',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('data.usuario.role', 'default');
        $response->assertJsonPath('data.usuario.active', true);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'role' => 'default',
            'active' => true,
        ]);
    }

    public function test_inactive_user_cannot_login(): void
    {
        $user = User::factory()->create([
            'email' => 'inactive@example.com',
            'password' => bcrypt('secret123'),
            'active' => false,
            'role' => 'default',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'inactive@example.com',
            'password' => 'secret123',
        ]);

        $response->assertStatus(403);
        $response->assertJsonPath('success', false);
        $response->assertJsonPath('message', 'Sua conta está desativada. Entre em contato com o suporte.');
    }

    public function test_inactive_user_is_blocked_by_active_middleware(): void
    {
        $user = User::factory()->create([
            'email' => 'active-then-inactive@example.com',
            'active' => true,
        ]);

        $token = $user->createToken('TestToken')->plainTextToken;

        // Verify initially active user can access
        $response = $this->getJson('/api/user', [
            'Authorization' => "Bearer {$token}"
        ]);
        $response->assertStatus(200);

        // Deactivate user
        $user->update(['active' => false]);
        $this->app['auth']->forgetUser();

        // Access should now be blocked
        $response = $this->getJson('/api/user', [
            'Authorization' => "Bearer {$token}"
        ]);
        $response->assertStatus(403);
        $response->assertJsonPath('message', 'Sua conta está desativada. Entre em contato com o suporte.');
    }
}

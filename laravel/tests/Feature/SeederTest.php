<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('sementeira cria o administrador padrao corretamente', function () {
    $this->seed();

    $this->assertDatabaseHas('users', [
        'email' => 'admin@meifinance.com',
        'role' => 'admin',
        'crc' => null,
        'office_name' => null,
        'active' => true,
    ]);

    // Retrieve user and check password
    $admin = User::where('email', 'admin@meifinance.com')->first();
    expect($admin)->not->toBeNull();
    expect(Hash::check('admin123', $admin->password))->toBeTrue();
});

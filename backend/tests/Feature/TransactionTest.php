<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_list_transactions(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        // Transação do usuário logado
        Transaction::create([
            'user_id' => $user->id,
            'transaction_date' => '2026-06-10',
            'description' => 'MINHA TRANSACAO',
            'amount' => 1500.00,
            'source' => 'checking_account',
            'classification' => 'business_pj',
            'fit_id' => 'fit111',
        ]);

        // Transação de outro usuário (não deve ser listada)
        Transaction::create([
            'user_id' => $otherUser->id,
            'transaction_date' => '2026-06-10',
            'description' => 'OUTRA TRANSACAO',
            'amount' => 500.00,
            'source' => 'checking_account',
            'classification' => 'business_pj',
            'fit_id' => 'fit222',
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/transactions');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.description', 'MINHA TRANSACAO');
    }

    public function test_user_can_parse_statement_ofx(): void
    {
        $user = User::factory()->create();

        $ofxContent = <<<OFX
OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
<BANKMSGSRSV1>
<STMTTRNRS>
<TRNUID>1
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<STMTRS>
<CURDEF>BRL
<BANKTRANLIST>
<DTSTART>20260601
<DTEND>20260615
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20260611120000[-3:BRT]
<TRNAMT>-450.00
<FITID>10293810293
<MEMO>ALUGUEL ESCRITORIO
</STMTTRN>
</BANKTRANLIST>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>
OFX;

        $file = UploadedFile::fake()->createWithContent('extrato.ofx', $ofxContent);

        $response = $this->actingAs($user)
            ->postJson('/api/transactions/parse', [
                'source' => 'checking_account',
                'format' => 'ofx',
                'file' => $file,
            ]);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.transaction_date', '2026-06-11');
        $response->assertJsonPath('data.0.amount', -450);
        $response->assertJsonPath('data.0.description', 'ALUGUEL ESCRITORIO');
        $response->assertJsonPath('data.0.fit_id', '10293810293');
    }

    public function test_user_can_confirm_transactions_and_duplicates_are_ignored(): void
    {
        $user = User::factory()->create();

        // Insere previamente uma transação no banco (duplicada de teste)
        Transaction::create([
            'user_id' => $user->id,
            'transaction_date' => '2026-06-10',
            'description' => 'DUPLICADA',
            'amount' => -100.00,
            'source' => 'checking_account',
            'classification' => 'personal_pf',
            'fit_id' => '111222333',
        ]);

        $response = $this->actingAs($user)
            ->postJson('/api/transactions/confirm', [
                'transactions' => [
                    // Transação nova
                    [
                        'transaction_date' => '2026-06-12',
                        'description' => 'NOVA',
                        'amount' => 500.00,
                        'source' => 'checking_account',
                        'classification' => 'business_pj',
                        'fit_id' => '999888777',
                    ],
                    // Transação duplicada (deve ser ignorada pelo fit_id)
                    [
                        'transaction_date' => '2026-06-10',
                        'description' => 'DUPLICADA',
                        'amount' => -100.00,
                        'source' => 'checking_account',
                        'classification' => 'personal_pf',
                        'fit_id' => '111222333',
                    ],
                ]
            ]);

        $response->assertStatus(201);
        $response->assertJsonPath('success', true);

        // Apenas 2 transações devem existir no banco (a inicial e a nova, a duplicada foi ignorada)
        $this->assertEquals(2, Transaction::count());

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'description' => 'NOVA',
            'amount' => 500.00,
            'classification' => 'business_pj',
        ]);
    }

    public function test_user_can_delete_their_transaction(): void
    {
        $user = User::factory()->create();
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'transaction_date' => '2026-06-10',
            'description' => 'DELETAR',
            'amount' => -50.00,
            'source' => 'checking_account',
            'classification' => 'personal_pf',
        ]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/transactions/{$transaction->id}");

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $this->assertEquals(0, Transaction::count());
    }

    public function test_user_cannot_delete_other_users_transaction(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $transaction = Transaction::create([
            'user_id' => $otherUser->id,
            'transaction_date' => '2026-06-10',
            'description' => 'OUTRA',
            'amount' => -50.00,
            'source' => 'checking_account',
            'classification' => 'personal_pf',
        ]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/transactions/{$transaction->id}");

        $response->assertStatus(404);
        $this->assertEquals(1, Transaction::count());
    }

    public function test_user_can_reclassify_their_transaction(): void
    {
        $user = User::factory()->create();
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'transaction_date' => '2026-06-10',
            'description' => 'ALTERAR',
            'amount' => -50.00,
            'source' => 'checking_account',
            'classification' => 'personal_pf',
        ]);

        $response = $this->actingAs($user)
            ->patchJson("/api/transactions/{$transaction->id}/classify", [
                'classification' => 'business_pj',
            ]);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        
        $transaction->refresh();
        $this->assertEquals('business_pj', $transaction->classification);
    }

    public function test_user_cannot_reclassify_other_users_transaction(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $transaction = Transaction::create([
            'user_id' => $otherUser->id,
            'transaction_date' => '2026-06-10',
            'description' => 'OUTRA',
            'amount' => -50.00,
            'source' => 'checking_account',
            'classification' => 'personal_pf',
        ]);

        $response = $this->actingAs($user)
            ->patchJson("/api/transactions/{$transaction->id}/classify", [
                'classification' => 'business_pj',
            ]);

        $response->assertStatus(404);
        
        $transaction->refresh();
        $this->assertEquals('personal_pf', $transaction->classification);
    }

    public function test_user_can_filter_transactions(): void
    {
        $user = User::factory()->create();

        // Transaction 1
        Transaction::create([
            'user_id' => $user->id,
            'transaction_date' => '2026-06-01',
            'description' => 'SUPERMERCADO',
            'amount' => -150.00,
            'source' => 'checking_account',
            'classification' => 'personal_pf',
            'bank_name' => 'Nubank',
        ]);

        // Transaction 2
        Transaction::create([
            'user_id' => $user->id,
            'transaction_date' => '2026-06-10',
            'description' => 'SERVICO TI',
            'amount' => 3000.00,
            'source' => 'checking_account',
            'classification' => 'business_pj',
            'bank_name' => 'Itaú',
            'alias' => 'Faturamento Web',
        ]);

        // Test filter by bank_name
        $response = $this->actingAs($user)
            ->getJson('/api/transactions?bank_name=Nubank');
        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.description', 'SUPERMERCADO');

        // Test filter by search query (description)
        $response = $this->actingAs($user)
            ->getJson('/api/transactions?search=super');
        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');

        // Test filter by search query (alias)
        $response = $this->actingAs($user)
            ->getJson('/api/transactions?search=Web');
        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.description', 'SERVICO TI');

        // Test filter by start_date / end_date
        $response = $this->actingAs($user)
            ->getJson('/api/transactions?start_date=2026-06-05&end_date=2026-06-15');
        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.description', 'SERVICO TI');
    }

    public function test_user_can_update_transaction_alias(): void
    {
        $user = User::factory()->create();
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'transaction_date' => '2026-06-10',
            'description' => 'CONTA DE AGUA',
            'amount' => -80.00,
            'source' => 'checking_account',
            'classification' => 'personal_pf',
        ]);

        // Update alias
        $response = $this->actingAs($user)
            ->patchJson("/api/transactions/{$transaction->id}/alias", [
                'alias' => 'SABESP Casa',
            ]);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.alias', 'SABESP Casa');

        $transaction->refresh();
        $this->assertEquals('SABESP Casa', $transaction->alias);

        // Can also clear alias (set to null)
        $response = $this->actingAs($user)
            ->patchJson("/api/transactions/{$transaction->id}/alias", [
                'alias' => null,
            ]);

        $response->assertStatus(200);
        $transaction->refresh();
        $this->assertNull($transaction->alias);
    }
}

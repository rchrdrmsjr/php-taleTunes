<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Audiobook;
use App\Models\User;

class AudiobookSearchTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test that an audiobook can be found by its generated code.
     *
     * @return void
     */
    public function test_audiobook_can_be_found_by_code()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $audiobook = Audiobook::factory()->create([
            'generated_code' => 'TESTCODE123',
            'is_public' => true,
        ]);

        $response = $this->getJson(route('audiobooks.searchByCode', ['code' => 'TESTCODE123']));

        $response->assertStatus(200)
                 ->assertJson(['audiobook' => ['id' => $audiobook->id]]);
    }

    /**
     * Test that a 404 is returned if the audiobook code is not found.
     *
     * @return void
     */
    public function test_audiobook_not_found_returns_404()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->getJson(route('audiobooks.searchByCode', ['code' => 'NONEXISTENTCODE']));

        $response->assertStatus(404)
                 ->assertJson(['error' => 'Audiobook not found.']);
    }

    /**
     * Test that an unauthorized user cannot search for audiobooks by code.
     *
     * @return void
     */
    public function test_unauthorized_user_cannot_search_by_code()
    {
        $response = $this->getJson(route('audiobooks.searchByCode', ['code' => 'TESTCODE123']));

        $response->assertStatus(401);
    }
} 
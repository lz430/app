<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Feature;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DmrFeatureTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function api_returns_features_grouped_by_category()
    {
        $firstCategory = factory(Category::class)->create([
            'title'                     => 'First Category',
            'slug'                      => 'first-category',
            'display_order'             => 1,
        ]);

        $secondCategory = factory(Category::class)->create([
            'title'                     => 'Second Category',
            'slug'                      => 'second-category',
            'display_order'             => 2,
        ]);

        $firstFeature = factory(Feature::class)->create([
            'title'             => 'First Feature',
            'slug'              => 'first-feature',
            'category_id'   => $firstCategory->id,
            'display_order'     => 1,
            'jato_schema_ids'   => collect([12345, 23456])->toJson(),
        ]);

        $secondFeature = factory(Feature::class)->create([
            'title'             => 'Second Feature',
            'slug'              => 'second-feature',
            'category_id'   => $firstCategory->id,
            'display_order'     => 2,
            'jato_schema_ids'   => collect([78901, 89012])->toJson(),
        ]);

        factory(Feature::class)->create([
            'title'             => 'Third Feature',
            'slug'              => 'third-feature',
            'category_id'   => $secondCategory->id,
            'display_order'     => 1,
            'jato_schema_ids'   => collect([56789, 67890])->toJson(),
        ]);

        factory(Feature::class)->create([
            'title'             => 'Fourth Feature',
            'slug'              => 'fourth-feature',
            'category_id'   => $secondCategory->id,
            'display_order'     => 2,
            'jato_schema_ids'   => collect([12345, 23456])->toJson(),
        ]);

        $response = $this->json('GET', route('categories.index'), ['includes' => 'features']);

        $response->assertJsonFragment([
            [
                'type'          => 'category',
                'id'            => ''.$firstCategory->id.'',
                'attributes'    => [
                    'title'                     => 'First Category',
                    'slug'                      => 'first-category',
                    'display_order'             => 1,
                ],
                'relationships' => [
                    'features'  => [
                        'data'  => [
                            [
                                'type'  => 'feature',
                                'id'    => ''.$firstFeature->id.'',
                            ],
                            [
                                'type'  => 'feature',
                                'id'    => ''.$secondFeature->id.'',
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }
}

<?php

namespace Tests\Feature;


use App\DmrCategory;
use App\DmrFeature;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DmrFeatureTest extends TestCase
{
    use RefreshDatabase;
    
    /** @test */
    public function api_returns_features_grouped_by_category()
    {
        $firstCategory = factory(DmrCategory::class)->create([
            'title'                     => 'First Category',
            'slug'                      => 'first-category',
            'display_order'             => 1,
        ]);
        
        $secondCategory = factory(DmrCategory::class)->create([
            'title'                     => 'Second Category',
            'slug'                      => 'second-category',
            'display_order'             => 2,
        ]);

        $firstFeature = factory(DmrFeature::class)->create([
            'title'             => 'First Feature',
            'slug'              => 'first-feature',
            'dmr_category_id'   => $firstCategory->id,
            'display_order'     => 1,
            'jato_schema_ids'   => collect([12345, 23456])->toJson(),
        ]);
        
        $secondFeature = factory(DmrFeature::class)->create([
            'title'             => 'Second Feature',
            'slug'              => 'second-feature',
            'dmr_category_id'   => $firstCategory->id,
            'display_order'     => 2,
            'jato_schema_ids'   => collect([78901, 89012])->toJson(),
        ]);

        factory(DmrFeature::class)->create([
            'title'             => 'Third Feature',
            'slug'              => 'third-feature',
            'dmr_category_id'   => $secondCategory->id,
            'display_order'     => 1,
            'jato_schema_ids'   => collect([56789, 67890])->toJson(),
        ]);

        factory(DmrFeature::class)->create([
            'title'             => 'Fourth Feature',
            'slug'              => 'fourth-feature',
            'dmr_category_id'   => $secondCategory->id,
            'display_order'     => 2,
            'jato_schema_ids'   => collect([12345, 23456])->toJson(),
        ]);

        $response = $this->json('GET', route('categories.index'), ['includes' => 'features']);

        $response->assertJsonFragment([
            [
                'type'          => 'category',
                'id'            => '' . $firstCategory->id . '',
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
                                'id'    => '' . $firstFeature->id . '',
                            ],
                            [
                                'type'  => 'feature',
                                'id'    => '' . $secondFeature->id . '',
                            ],
                        ]
                    ]
                ]
            ]
        ]);
    }
}

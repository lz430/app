<?php

namespace Tests\Unit;

use DeliverMyRide\VAuto\Importer;
use Tests\TestCase;

class ImporterTest extends TestCase
{
    /** @test */
    public function it_can_return_features_that_do_not_need_splitting()
    {
        $this->assertEquals(
            [
                [
                    'feature' => 'Front airbags',
                    'content' => 'Standard',
                ],
            ],
            Importer::splitJATOFeaturesAndContent(
                'Front airbags',
                'Standard'
            )
        );
    }

    /** @test */
    public function it_does_not_try_to_split_on_slashes_without_spaces()
    {
        $this->assertEquals(
            [
                [
                    'feature' => 'Automatic trunk/hatch closing',
                    'content' => 'Not Available',
                ],
            ],
            Importer::splitJATOFeaturesAndContent(
                'Automatic trunk/hatch closing',
                'Not Available '
            )
        );
    }

    /** @test */
    public function it_can_split_without_parens()
    {
        $this->assertEquals(
            [
                [
                    'feature' => 'Air filter',
                    'content' => 'Not Available',
                ],
                [
                    'feature' => 'carbon filter',
                    'content' => 'Not Available',
                ],
            ],
            Importer::splitJATOFeaturesAndContent(
                'Air filter / carbon filter',
                'Not Available / Not Available'
            )
        );
    }

    /** @test */
    public function it_can_split_single_jato_feature_and_content()
    {
        $this->assertEquals(
            [
                [
                    'feature' => 'Brake assist',
                    'content' => 'Standard',
                ],
                [
                    'feature' => 'Brake assist with preview',
                    'content' => 'Not Available',
                ],
            ],
            Importer::splitJATOFeaturesAndContent(
                'Brake assist (with preview)',
                'Standard (Not Available)'
            )
        );
    }

    /** @test */
    public function it_can_split_double_jato_feature_and_content()
    {
        $this->assertEquals(
            [
                [
                    'feature' => 'Front airbags driver',
                    'content' => 'Standard',
                ],
                [
                    'feature' => 'Front airbags passenger',
                    'content' => 'Standard',
                ],
            ],
            Importer::splitJATOFeaturesAndContent(
                'Front airbags (driver / passenger)',
                'Standard / Standard'
            )
        );
    }

    /** @test */
    public function if_content_count_and_feature_count_dont_match_it_defaults_to_first_content()
    {
        $this->assertEquals(
            [
                [
                    'feature' => 'Front seat thigh support adjustment driver',
                    'content' => 'Manual',
                ],
                [
                    'feature' => 'Front seat thigh support adjustment passenger',
                    'content' => 'Manual',
                ],
            ],
            Importer::splitJATOFeaturesAndContent(
                'Front seat thigh support adjustment (driver / passenger)',
                'Manual'
            )
        );
    }

    /** @test */
    public function it_can_split_triple_jato_feature_and_content()
    {
        $this->assertEquals(
            [
                [
                    'feature' => 'Side curtain airbags front',
                    'content' => 'Not Available',
                ],
                [
                    'feature' => 'Side curtain airbags rear',
                    'content' => 'Not Available',
                ],
                [
                    'feature' => 'Side curtain airbags front to rear',
                    'content' => 'Standard',
                ],
            ],
            Importer::splitJATOFeaturesAndContent(
                'Side curtain airbags (front / rear / front to rear)',
                'Not Available / Not Available / Standard'
            )
        );
    }
}

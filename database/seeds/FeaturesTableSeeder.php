<?php

use Illuminate\Database\Seeder;

class FeaturesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('features')->insert([
            [
                'is_active' => 1,
                'title' => 'Black',
                'slug' => 'black',
                'category_id' => 0
            ],
            [
                'is_active' => 1,
                'title' => 'White',
                'slug' => 'white',
                'category_id' => 0
            ],
            [
                'is_active' => 1,
                'title' => 'Gray',
                'slug' => 'gray',
                'category_id' => 0
            ],
            [
                'is_active' => 1,
                'title' => 'Silver',
                'slug' => 'silver',
                'category_id' => 0
            ],
            [
                'is_active' => 1,
                'title' => 'Red',
                'slug' => 'red',
                'category_id' => 0
            ],
            [
                'is_active' => 1,
                'title' => 'Blue',
                'slug' => 'blue',
                'category_id' => 0
            ],
            [
                'is_active' => 1,
                'title' => 'Green',
                'slug' => 'green',
                'category_id' => 0
            ],
            [
                'is_active' => 1,
                'title' => 'Tan',
                'slug' => 'tan',
                'category_id' => 0
            ],
            [
                'is_active' => 1,
                'title' => 'Burgandy',
                'slug' => 'burgandy',
                'category_id' => 0
            ],
            [
                'is_active' => 1,
                'title' => 'Orange',
                'slug' => 'orange',
                'category_id' => 0
            ],
            [
                'is_active' => 1,
                'title' => 'Brown',
                'slug' => 'brown',
                'category_id' => 0
            ],
            [
                'is_active' => 1,
                'title' => 'Purple',
                'slug' => 'purple',
                'category_id' => 0
            ],
            [
                'is_active' => 1,
                'title' => 'Yellow',
                'slug' => 'yellow',
                'category_id' => 0
            ],
        ]);
    }
}

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
        DB::table('categories')->insert([
           [
               'title' => 'Vehicle Color',
               'slug' => 'vehicle_color'
           ],
        ]);

        // gets the inserted id of the record from the categories table
        $categoryId = DB::getPdo()->lastInsertId();

        DB::table('features')->insert([
            [
                'is_active' => 0,
                'title' => 'Black',
                'slug' => 'black',
                'category_id' => $categoryId
            ],
            [
                'is_active' => 0,
                'title' => 'White',
                'slug' => 'white',
                'category_id' => $categoryId
            ],
            [
                'is_active' => 0,
                'title' => 'Gray',
                'slug' => 'gray',
                'category_id' => $categoryId
            ],
            [
                'is_active' => 0,
                'title' => 'Silver',
                'slug' => 'silver',
                'category_id' => $categoryId
            ],
            [
                'is_active' => 0,
                'title' => 'Red',
                'slug' => 'red',
                'category_id' => $categoryId
            ],
            [
                'is_active' => 0,
                'title' => 'Blue',
                'slug' => 'blue',
                'category_id' => $categoryId
            ],
            [
                'is_active' => 0,
                'title' => 'Green',
                'slug' => 'green',
                'category_id' => $categoryId
            ],
            [
                'is_active' => 0,
                'title' => 'Tan',
                'slug' => 'tan',
                'category_id' => $categoryId
            ],
            [
                'is_active' => 0,
                'title' => 'Burgandy',
                'slug' => 'burgandy',
                'category_id' => $categoryId
            ],
            [
                'is_active' => 0,
                'title' => 'Orange',
                'slug' => 'orange',
                'category_id' => $categoryId
            ],
            [
                'is_active' => 0,
                'title' => 'Brown',
                'slug' => 'brown',
                'category_id' => $categoryId
            ],
            [
                'is_active' => 0,
                'title' => 'Purple',
                'slug' => 'purple',
                'category_id' => $categoryId
            ],
            [
                'is_active' => 0,
                'title' => 'Yellow',
                'slug' => 'yellow',
                'category_id' => $categoryId
            ],
        ]);
    }
}

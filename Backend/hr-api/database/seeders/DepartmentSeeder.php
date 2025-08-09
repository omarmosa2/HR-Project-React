<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Department::insert([
            [
                'name' => 'Engineering',
                'description' => 'Engineering Department',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Human Resources',
                'description' => 'HR Department',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Finance',
                'description' => 'Finance Department',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

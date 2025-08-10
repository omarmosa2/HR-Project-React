<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
            \App\Models\User::insert([
            [
                'name' => 'John1 Doe',
                'email' => 'john1@example.com',
                'password' => bcrypt('password'),
            ],  
        ]);

        $this->call([
            DepartmentSeeder::class,
            EmployeeSeeder::class,
            PayrollSeeder::class,
        ]);


    
    }
}

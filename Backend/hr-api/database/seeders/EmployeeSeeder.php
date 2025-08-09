<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Employee::insert([
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '123-456-7890',
                'department_id' => 1,
                'position' => 'Software Engineer',
                'hire_date' => '2021-06-15',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'phone' => '987-654-3210',
                'department_id' => 2,
                'position' => 'HR Manager',
                'hire_date' => '2020-02-20',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mike Brown',
                'email' => 'mike@example.com',
                'phone' => '555-555-5555',
                'department_id' => 3,
                'position' => 'Accountant',
                'hire_date' => '2022-01-10',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

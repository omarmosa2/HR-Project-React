<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Payroll;
use App\Models\Employee;

class PayrollSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $employees = Employee::all();
        
        if ($employees->isEmpty()) {
            $this->command->info('No employees found. Please run EmployeeSeeder first.');
            return;
        }

        $periods = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08'];
        $statuses = ['pending', 'processed', 'paid'];

        foreach ($employees as $employee) {
            // Create payroll records for the last 3 months
            foreach (array_slice($periods, -3) as $period) {
                $baseSalary = rand(3000, 8000);
                $additions = rand(0, 1000);
                $deductions = rand(200, 800);
                $netSalary = $baseSalary + $additions - $deductions;

                Payroll::create([
                    'employee_id' => $employee->id,
                    'period' => $period,
                    'base_salary' => $baseSalary,
                    'additions' => $additions,
                    'deductions' => $deductions,
                    'net_salary' => $netSalary,
                    'status' => $statuses[array_rand($statuses)],
                ]);
            }
        }

        $this->command->info('Payroll records created successfully!');
    }
}

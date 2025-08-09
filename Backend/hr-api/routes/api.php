<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


// Auth
Route::post('login', [\App\Http\Controllers\API\AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [\App\Http\Controllers\API\AuthController::class, 'logout']);

    // Departments
    Route::apiResource('departments', \App\Http\Controllers\API\DepartmentController::class);

    // Employees
    Route::apiResource('employees', \App\Http\Controllers\API\EmployeeController::class);

    // Attendance
    Route::apiResource('attendances', \App\Http\Controllers\API\AttendanceController::class)->except(['show']);

    // Leave Requests
    Route::apiResource('leave-requests', \App\Http\Controllers\API\LeaveRequestController::class);
    Route::post('leave-requests/{id}/approve', [\App\Http\Controllers\API\LeaveRequestController::class, 'approve']);
    Route::post('leave-requests/{id}/reject', [\App\Http\Controllers\API\LeaveRequestController::class, 'reject']);

    // Payroll
    Route::apiResource('payrolls', \App\Http\Controllers\API\PayrollController::class);
});

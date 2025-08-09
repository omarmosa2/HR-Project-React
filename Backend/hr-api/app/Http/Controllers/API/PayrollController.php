<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payroll;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payrolls = Payroll::with('employee')->get();
        return response()->json(['data' => $payrolls]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'period' => 'required|string',
            'base_salary' => 'required|numeric|min:0',
            'additions' => 'nullable|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:pending,processed,paid',
        ]);

        // Calculate net salary
        $validated['additions'] = $validated['additions'] ?? 0;
        $validated['deductions'] = $validated['deductions'] ?? 0;
        $validated['net_salary'] = $validated['base_salary'] + $validated['additions'] - $validated['deductions'];
        $validated['status'] = $validated['status'] ?? 'pending';

        $payroll = Payroll::create($validated);
        $payroll->load('employee');

        return response()->json($payroll, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $payroll = Payroll::with('employee')->findOrFail($id);
        return response()->json($payroll);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $payroll = Payroll::findOrFail($id);

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'period' => 'required|string',
            'base_salary' => 'required|numeric|min:0',
            'additions' => 'nullable|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:pending,processed,paid',
        ]);

        // Calculate net salary
        $validated['additions'] = $validated['additions'] ?? 0;
        $validated['deductions'] = $validated['deductions'] ?? 0;
        $validated['net_salary'] = $validated['base_salary'] + $validated['additions'] - $validated['deductions'];

        $payroll->update($validated);
        $payroll->load('employee');

        return response()->json($payroll);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $payroll = Payroll::findOrFail($id);
        $payroll->delete();

        return response()->json(['message' => 'Payroll record deleted successfully']);
    }
}

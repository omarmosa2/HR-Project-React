<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use App\Http\Resources\LeaveRequestResource;
use App\Http\Requests\StoreLeaveRequestRequest;
use App\Http\Requests\UpdateLeaveRequestRequest;

class LeaveRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leaveRequests = LeaveRequest::with('employee')->get();
        return LeaveRequestResource::collection($leaveRequests);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeaveRequestRequest $request)
    {
        $leaveRequest = LeaveRequest::create($request->validated());
        return new LeaveRequestResource($leaveRequest);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $leaveRequest = LeaveRequest::with('employee')->findOrFail($id);
        return new LeaveRequestResource($leaveRequest);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeaveRequestRequest $request, $id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);
        $leaveRequest->update($request->validated());
        return new LeaveRequestResource($leaveRequest);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);
        $leaveRequest->delete();
        return response()->json(['message' => 'Leave request deleted successfully']);
    }

    public function approve($id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);
        $leaveRequest->status = 'approved';
        $leaveRequest->save();
        return new LeaveRequestResource($leaveRequest);
    }

    public function reject($id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);
        $leaveRequest->status = 'rejected';
        $leaveRequest->save();
        return new LeaveRequestResource($leaveRequest);
    }
}

<?php

use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\LogoutController;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\TempImageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('blogs',[BlogController::class,'store']);
Route::post('save-temp-image',[TempImageController::class,'store']);
Route::get('blogs',[BlogController::class,'index']);
Route::get('blogs/{id}',[BlogController::class,'show']);
Route::put('blogs/{id}',[BlogController::class,'update']);
Route::delete('blogs/{id}',[BlogController::class,'destroy']);
Route::post('/register',RegisterController::class)->name('register');
Route::post('/login', LoginController::class)->name('login');
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/logout', LogoutController::class)->name('logout');
// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

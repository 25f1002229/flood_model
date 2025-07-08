<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FloodPredictionController;

Route::get('/flood-prediction', [FloodPredictionController::class, 'predict']);
